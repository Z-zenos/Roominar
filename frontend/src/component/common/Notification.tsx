'use client';

import type { NotificationTypeCode } from '@/src/lib/api/generated';
import { Bell, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import useDayjsLocale from '@/src/hooks/useDayjsLocale';
import dayjs from '@/src/utils/dayjs';
import { cn } from '@/src/utils/app.util';
import clsx from 'clsx';
import DotLoader from './Loader/DotLoader';
import { useCallback, useEffect, useRef } from 'react';
import {
  useListingNotificationsInfiniteQuery,
  useMarkNotificationAsReadMutation,
} from '@/src/api/user.api';
import { Link } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { CiBellOn } from 'react-icons/ci';

interface NotificationItemProps {
  id: number;
  content: string;
  createdAt: Date;
  isRead: boolean;
  avatarUrl?: string;
  actionUrl?: string;
  senderId?: number;
  typeCode: NotificationTypeCode;
  onRefetch?: () => void;
}

interface NotificationIconProps {
  totalUnreadNotifications: number;
}

export function NotificationItem({
  id,
  content,
  createdAt,
  isRead,
  avatarUrl,
  actionUrl,
  typeCode,
  onRefetch,
}: NotificationItemProps) {
  useDayjsLocale();
  const timeAgo = dayjs(createdAt).fromNow();
  const router = useRouter();

  const { trigger: markAsRead } = useMarkNotificationAsReadMutation({
    onSuccess: () => {
      onRefetch?.();
      router.push(actionUrl || '/');
    },
  });

  return (
    <Link
      onPress={() => isRead || markAsRead({ notificationId: id })}
      className={cn(
        'flex items-start gap-3 px-4 py-3 rounded-xl transition-all duration-200 group cursor-pointer',
        isRead ? 'bg-white hover:bg-gray-100' : 'bg-blue-sub hover:bg-blue-100',
      )}
    >
      {/* Avatar / Icon */}
      <div className='flex-shrink-0'>
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt='Avatar'
            width={40}
            height={40}
            className='rounded-full object-cover w-10 h-10'
          />
        ) : (
          <div className='w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center'>
            <Bell className='w-5 h-5 text-gray-500' />
          </div>
        )}
      </div>

      {/* Content */}
      <div className='flex-1 text-sm text-gray-700'>
        <div
          className={clsx(
            isRead ? 'text-gray-500' : 'font-semibold text-gray-900',
          )}
        >
          {content}
        </div>
        <div className='text-xs text-gray-500 mt-1'>{timeAgo}</div>
      </div>

      {/* Arrow icon */}
      <div className='self-center opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
        <ArrowRight className='w-4 h-4 text-gray-400' />
      </div>
    </Link>
  );
}

export interface NotificationListProps {
  onRefetch?: () => void;
  onClose?: () => void;
}

export function NotificationList({
  onRefetch,
  onClose,
}: NotificationListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const {
    data: notifications,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useListingNotificationsInfiniteQuery(true);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || isFetchingNextPage || !hasNextPage) return;

    const { scrollTop, scrollHeight, clientHeight } = el;
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      fetchNextPage();
    }
  }, []);

  // Infinite scroll handler
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.addEventListener('scroll', handleScroll);
    return () => {
      if (el) el.removeEventListener('scroll', handleScroll);
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, handleScroll]);

  return (
    <div
      ref={scrollRef}
      className='overflow-y-auto max-h-[calc(100vh-100px)] pr-2 space-y-2'
    >
      {notifications?.pages.flatMap((page, i) =>
        page.data.map((notification, index) => (
          <NotificationItem
            key={`notification-${i}-${index}`}
            id={notification.id}
            content={notification.content}
            createdAt={notification.createdAt}
            isRead={notification.isRead}
            avatarUrl={notification.avatarUrl}
            actionUrl={notification.actionUrl}
            typeCode={notification.typeCode}
            onRefetch={() => {
              refetch();
              onRefetch?.();
              onClose();
            }}
          />
        )),
      )}

      {isFetchingNextPage && (
        <div className='flex justify-center py-4'>
          <DotLoader />
        </div>
      )}

      {!hasNextPage && notifications?.pages[0].data.length === 0 && (
        <div className='flex items-center justify-center h-full text-gray-500 py-6'>
          No notifications
        </div>
      )}
    </div>
  );
}

export function NotificationIcon({
  totalUnreadNotifications,
}: NotificationIconProps) {
  return (
    <>
      <CiBellOn className='w-7 h-7' />
      {totalUnreadNotifications > 0 && (
        <span
          className={clsx(
            'absolute -top-2 -right-4 bg-red-500 text-white rounded-full flex items-center justify-center text-xs',
            totalUnreadNotifications === 0 ? 'hidden' : 'block',
            totalUnreadNotifications > 99 && 'w-8 h-5',
            totalUnreadNotifications > 9 && 'w-6 h-5 -right-3',
            totalUnreadNotifications <= 9 && 'w-5 h-5 -right-2',
          )}
        >
          {totalUnreadNotifications}
          {totalUnreadNotifications > 99 && '+'}
        </span>
      )}
    </>
  );
}
