'use client';

import type { NotificationTypeCode } from '@/src/lib/api/generated';
import { Bell, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import useDayjsLocale from '@/src/hooks/useDayjsLocale'; // Hook bạn đã tạo
import dayjs from '@/src/utils/dayjs';
import { cn } from '@/src/utils/app.util';
import clsx from 'clsx';
import DotLoader from './Loader/DotLoader';
import { useCallback, useEffect, useRef } from 'react';
import { useListingNotificationsInfiniteQuery } from '@/src/api/user.api';

interface NotificationItemProps {
  content: string;
  createdAt: Date;
  isRead: boolean;
  avatarUrl?: string;
  actionUrl?: string;
  senderId?: number;
  typeCode: NotificationTypeCode;
}

export function NotificationItem({
  content,
  createdAt,
  isRead,
  avatarUrl,
  actionUrl,
  typeCode,
}: NotificationItemProps) {
  useDayjsLocale();
  const timeAgo = dayjs(createdAt).fromNow();

  return (
    <Link
      href={actionUrl || '#'}
      className={cn(
        'flex items-start gap-3 px-4 py-3 rounded-xl transition-all duration-200 group',
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
            'line-clamp-3 min-h-16 max-h-16',
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

export function NotificationList() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const {
    data: notifications,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
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
            content={notification.content}
            createdAt={notification.createdAt}
            isRead={notification.isRead}
            avatarUrl={notification.avatarUrl}
            actionUrl={notification.actionUrl}
            typeCode={notification.typeCode}
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
