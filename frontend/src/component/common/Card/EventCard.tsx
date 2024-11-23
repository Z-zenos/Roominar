'use client';

import clsx from 'clsx';
import Chip from '../Chip';
import { MdOutlineAccessTime, MdOutlineOnlinePrediction } from 'react-icons/md';
import { Button } from '@nextui-org/button';
import { FaRegShareSquare, FaTags, FaUserFriends } from 'react-icons/fa';
import { BsThreeDots } from 'react-icons/bs';
import { Image, Link, useDisclosure } from '@nextui-org/react';
import { SlNote } from 'react-icons/sl';
import { useRouter, useSearchParams } from 'next/navigation';
import { styles } from '@/src/constants/styles.constant';
import type {
  ApiException,
  ErrorResponse400,
  MyEventItem,
  SearchEventsItem,
  TagItem,
} from '@/src/lib/api/generated';
import { formatEventDate } from '@/src/utils/app.util';
import dayjs from 'dayjs';
import EventBookmark from '@/src/view/event/EventBookmark';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { IoMdLogIn } from 'react-icons/io';
import Ticket from './Ticket';
import { useState } from 'react';
import { useCancelEventApplicationMutation } from '@/src/api/application.api';
import ConfirmDialog from '../Dialog/ConfirmDialog';

interface EventCardProps {
  className?: string;
  direction?: 'horizontal' | 'vertical';
  variant?: 'simple' | 'complex';
  event: SearchEventsItem | MyEventItem;
}

function EventCard({
  className,
  direction = 'vertical',
  variant = 'complex',
  event,
}: EventCardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession();

  const [isCanceled, setIsCanceled] = useState<boolean>(false);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const { trigger: cancelEventApplication, isMutating: isCanceling } =
    useCancelEventApplicationMutation({
      onSuccess() {
        setIsCanceled(true);
        toast.success('Canceled your application successfully!');
        onClose();
      },
      onError(error: ApiException<unknown>) {
        toast.error(
          (error.body as ErrorResponse400)?.message ??
            (error.body as ErrorResponse400)?.errorCode ??
            'Unknown Error 😵',
        );
      },
    });

  return (
    <div
      className={clsx(
        'bg-white rounded-lg py-3 shadow-[rgba(60,_64,_67,_0.15)_0px_1px_1px_0px,_rgba(60,_64,_67,_0.15)_0px_2px_4px_2px] active:shadow-none transition-all',
        direction === 'vertical'
          ? 'min-w-[300px] w-[300px] 600px:max-w-[400px] max-w-[300px] border-t border-t-gray-300'
          : 'border border-gray-200 items-start px-3',
        className,
      )}
    >
      <div
        className={clsx(
          'flex gap-4 justify-start cursor-pointer ',
          direction === 'vertical'
            ? 'flex-col'
            : 'flex-row justify-between items-start flex-wrap ',
          variant === 'complex' && 'pb-3',
        )}
        onClick={() => router.push(`/events/${event.slug}`)}
      >
        <div
          className={clsx(
            direction === 'vertical' ? '' : 'w-[50%]',
            'flex gap-2 flex-col',
          )}
        >
          <div className='flex gap-3 items-center px-3'>
            <Image
              src={
                event.coverImageUrl ??
                'https://cdn-icons-png.flaticon.com/128/3175/3175209.png'
              }
              width={32}
              height={32}
              alt='event cover image'
            />
            <div>
              <p className='font-semibold text-sm'>{event.organizationName}</p>
              <p className='font-light text-xs text-gray-600'>
                Published on {dayjs(event?.publishedAt).format('MMM DD, YYYY')}
              </p>
            </div>
          </div>

          <div className='px-3'>
            <h3 className='font-medium text-nm text-primary line-clamp-2 h-12'>
              {event.name}
            </h3>
            <p className='text-sm font-light line-clamp-1 text-gray-700'>
              {event.organizeAddress}
            </p>
            <span className='flex items-center text-ss gap-1 my-2'>
              <MdOutlineAccessTime className='text-nm' />
              {formatEventDate(event.startAt)}
              {direction === 'horizontal' &&
                '〜' + formatEventDate(event.endAt)}
            </span>
            {direction === 'vertical' && (
              <div className={clsx(styles.between)}>
                <Chip
                  content={
                    status === 'authenticated'
                      ? `${event?.appliedNumber || 0} / ${event?.applicationNumber}`
                      : event.applicationNumber + ''
                  }
                  leftIcon={<FaUserFriends className='text-sm' />}
                  type='info'
                />
                {event.meetingToolCode && (
                  <Chip
                    content={event.meetingToolCode}
                    leftIcon={<MdOutlineOnlinePrediction className='text-sm' />}
                    type='success'
                  />
                )}
              </div>
            )}
            {direction === 'horizontal' && (
              <div className='flex flex-col justify-start gap-y-2 mt-3'>
                <div
                  className={clsx(
                    styles.flexStart,
                    'gap-2 flex-wrap',
                    variant === 'simple' && 'h-16',
                  )}
                >
                  <Chip
                    content={
                      event.applicationStartAt > new Date(Date.now())
                        ? 'Not open application'
                        : 'Opening application'
                    }
                    className='w-fit font-semibold'
                    type={
                      event.applicationStartAt > new Date(Date.now())
                        ? 'error'
                        : 'warning'
                    }
                  />
                  {event.meetingToolCode && (
                    <Chip
                      content={event.meetingToolCode}
                      leftIcon={
                        <MdOutlineOnlinePrediction className='text-sm' />
                      }
                      className=''
                      type='success'
                    />
                  )}
                  <Chip
                    content={
                      status === 'authenticated'
                        ? `${event?.appliedNumber || 0} / ${event?.applicationNumber}`
                        : event.applicationNumber + ''
                    }
                    leftIcon={<FaUserFriends className='text-sm' />}
                    type='info'
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div
          className={clsx(
            direction === 'vertical'
              ? ''
              : 'w-[45%] flex justify-end items-start h-full',
          )}
        >
          <div className='w-full h-auto'>
            <Image
              src={event.coverImageUrl}
              alt={event.name}
              height={200}
              className={clsx(
                'object-cover aspect-video',
                direction === 'horizontal'
                  ? 'rounded-md max-h-[200px]'
                  : 'rounded-none',
              )}
            />
          </div>
          <div
            className={clsx(
              'flex items-center gap-3 px-3',
              direction === 'horizontal'
                ? 'justify-center flex-col'
                : 'justify-start flex-row mt-3',
            )}
          >
            <Button
              isIconOnly
              color='success'
              variant='flat'
              onClick={() => {
                if (status === 'authenticated') {
                  router.push(`/events/${event.slug}/apply`);
                } else {
                  toast(
                    () => (
                      <span className={clsx(styles.between, 'gap-2')}>
                        <span>
                          You need to <b>login</b> for apply event
                        </span>
                        <IoMdLogIn size={16} />
                      </span>
                    ),
                    {
                      icon: '⚠️',
                    },
                  );
                }
              }}
            >
              <SlNote size={16} />
            </Button>
            <EventBookmark
              isBookmarked={event?.isBookmarked}
              eventId={event?.id}
            />
            <Button
              isIconOnly
              color='warning'
              variant='flat'
            >
              <FaRegShareSquare size={16} />
            </Button>
            <Button
              isIconOnly
              color='default'
              variant='flat'
            >
              <BsThreeDots size={16} />
            </Button>
          </div>
        </div>
      </div>

      {variant === 'complex' && event.tags.length > 0 && (
        <div className={clsx(styles.between, 'border-t border-t-slate-300')}>
          <div
            className={clsx(
              styles.flexStart,
              'flex-wrap gap-x-2 mt-2',
              direction === 'vertical' && 'px-3',
            )}
          >
            <FaTags
              className='text-orange-500 '
              size={16}
            />
            {event.tags.map((tag: TagItem, i: number) => (
              <Link
                href={`?${searchParams.toString() ? searchParams.toString() + '&' : ''}tags[]=${tag.id}`}
                underline='hover'
                key={`event-card-tag-${tag.id}`}
                className={clsx(
                  'text-sm font-light text-gray-700 hover:text-primary',
                  searchParams.getAll('tags[]').includes(tag.id + '') &&
                    'text-primary font-semibold',
                )}
              >
                #{tag.name}
                {i === event.tags.length - 1 ? '' : ', '}
              </Link>
            ))}
          </div>

          {'isApplied' in event &&
            status === 'authenticated' &&
            event?.isApplied && (
              <div
                className={clsx('flex justify-end items-center !gap-4 mt-2')}
              >
                {event?.ticketName && <Ticket name={event?.ticketName} />}
                {!isCanceled && !event?.canceledAt && (
                  <Button
                    color='danger'
                    radius='sm'
                    variant='bordered'
                    size='sm'
                    className=' hover:text-white hover:bg-danger-500'
                    onPress={onOpen}
                  >
                    Cancel Apply
                  </Button>
                )}
                {event?.canceledAt && (
                  <p className='opacity-60 italic text-sm'>
                    Canceled at {formatEventDate(event?.canceledAt)}
                  </p>
                )}

                <ConfirmDialog
                  content={
                    <p>
                      Are you sure you want to cancel your application for event
                      <span className='text-danger-500 underline'>
                        {event?.name}
                      </span>
                      ?
                    </p>
                  }
                  isOpen={isOpen}
                  onOpenChange={onOpenChange}
                  onConfirm={() => {
                    cancelEventApplication({
                      applicationId: event?.applicationId,
                    });
                    router.refresh();
                  }}
                  confirmLabel='Cancel'
                  isLoading={isCanceling}
                />
              </div>
            )}
        </div>
      )}
    </div>
  );
}

export default EventCard;
