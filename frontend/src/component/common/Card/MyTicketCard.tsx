'use client';

import clsx from 'clsx';
import Chip from '../Chip';
import { MdAirplaneTicket, MdOutlineAccessTime } from 'react-icons/md';
import { Image } from '@nextui-org/react';
import { styles } from '@/src/constants/styles.constant';
import {
  TransactionStatusCode,
  type ListingMyTicketsItem,
} from '@/src/lib/api/generated';
import { formatEventDate } from '@/src/utils/app.util';
import dayjs from 'dayjs';
import { FaCheck } from 'react-icons/fa6';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';

interface MyTicketCardProps {
  className?: string;
  direction?: 'horizontal' | 'vertical';
  ticket: ListingMyTicketsItem;
}

function MyTicketCard({
  className,
  direction = 'vertical',
  ticket,
}: MyTicketCardProps) {
  const isVertical = useMemo(() => direction === 'vertical', [direction]);
  const router = useRouter();
  return (
    <div
      className={clsx(
        `relative rounded-lg p-3 overflow-hidden
        shadow-[rgba(60,_64,_67,_0.15)_0px_1px_1px_0px,_rgba(60,_64,_67,_0.15)_0px_2px_4px_2px]
        active:shadow-none transition-all
        `,
        isVertical
          ? 'min-w-[300px] w-[300px] 600px:max-w-[400px] max-w-[300px] border-t border-t-gray-300'
          : 'border border-gray-200 items-start px-3 w-full',
        className,
      )}
    >
      <div
        className={clsx(
          'absolute top-0 z-10',
          isVertical
            ? 'bg-transparent w-full h-full absolute left-0'
            : 'w-2/3 right-0',
        )}
      >
        <div
          className={clsx(
            'relative transition-all',
            isVertical ? ' opacity-15 hover:opacity-10' : '',
          )}
        >
          <Image
            src={ticket.eventCoverImageUrl}
            alt={ticket.name}
            className={clsx(
              'rounded-lg ',
              isVertical
                ? 'aspect-square object-cover'
                : 'aspect-video object-fill',
            )}
          />
        </div>
      </div>
      {!isVertical && (
        <div className='absolute top-0 right-0 z-20 w-2/3 h-full bg-gradient-to-r from-gray-50  to-white/10'></div>
      )}
      <div
        className={clsx(
          'flex justify-start cursor-pointer',
          isVertical
            ? 'flex-col'
            : 'flex-row justify-between items-start flex-wrap z-30 relative w-2/3',
        )}
      >
        <div className={clsx('flex gap-2 flex-col')}>
          <div
            className='flex gap-3 items-center px-3'
            onClick={() => router.push(`/events/${ticket.eventSlug}`)}
          >
            <div>
              <p className='font-semibold text-sm'>{ticket.eventName}</p>
              <p className='text-xs'>
                Applied at {dayjs(ticket.appliedAt).format('MMM DD, YYYY')}
              </p>
            </div>
          </div>

          <div className='px-3'>
            <h3 className='font-medium text-nm text-primary line-clamp-2 h-12'>
              {ticket.name}
            </h3>
            <p className='text-sm line-clamp-1 text-gray-700'>
              {ticket.description}
            </p>
            <span className='flex items-center text-ss gap-1 my-2'>
              <MdOutlineAccessTime className='text-nm' />
              {formatEventDate(ticket.eventStartAt)}
              {direction === 'horizontal' &&
                '〜' + formatEventDate(ticket.eventEndAt)}
            </span>
            <div className={clsx(styles.flexStart)}>
              <Chip
                content={ticket?.transactionStatus}
                leftIcon={<FaCheck className='text-sm' />}
                type={
                  ticket.transactionStatus == TransactionStatusCode.Success
                    ? 'success'
                    : ticket.transactionStatus == TransactionStatusCode.Pending
                      ? 'warning'
                      : 'error'
                }
                className='font-semibold text-xs'
              />
              <Chip
                content={ticket.type}
                leftIcon={<MdAirplaneTicket className='text-sm' />}
                type='info'
                className='text-xs'
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyTicketCard;
