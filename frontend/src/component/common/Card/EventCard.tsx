'use client';

import clsx from 'clsx';
import Chip from '../Chip';
import { MdOutlineAccessTime, MdOutlineOnlinePrediction } from 'react-icons/md';
import { FaTags, FaUserFriends } from 'react-icons/fa';
import { Image, Link } from '@nextui-org/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { styles } from '@/src/constants/styles.constant';
import type {
  MyEventItem,
  SearchEventsItem,
  TagItem,
} from '@/src/lib/api/generated';
import { formatEventDate } from '@/src/utils/app.util';
import { useSession } from 'next-auth/react';
import Ticket from './Ticket';
import useWindowDimensions from '@/src/hooks/useWindowDimension';
import { useTranslations } from 'next-intl';
import { FaBookmark, FaRegEye } from 'react-icons/fa6';
import { IoTicketOutline } from 'react-icons/io5';
import useFormatMoney from '@/src/hooks/useFormatMoney';

interface EventCardProps {
  className?: string;
  direction?: 'horizontal' | 'vertical';
  variant?: 'compact' | 'standard' | 'detailed';
  event: SearchEventsItem | MyEventItem;
  style?: React.CSSProperties;
  trendingOrderNumber?: number;
}

function EventCard({
  className,
  direction = 'vertical',
  variant = 'detailed',
  event,
  style,
  trendingOrderNumber,
}: EventCardProps) {
  const t = useTranslations('code');
  const formatMoney = useFormatMoney();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession();
  const { width } = useWindowDimensions();

  return (
    <div
      className={clsx(
        '450px:rounded-lg 450px:shadow-[rgba(60,_64,_67,_0.15)_0px_1px_1px_0px,_rgba(60,_64,_67,_0.15)_0px_2px_4px_2px] active:shadow-none transition-all',
        direction === 'vertical'
          ? '450px:min-w-[300px] w-[300px] 600px:max-w-[400px] 450px:max-w-[300px] max-w-[400px] min-w-full border-t-gray-300 450px:border-t'
          : 'border border-gray-200 items-start px-3',
        variant === 'compact' ? 'py-0 bg-transparent' : 'py-3 bg-white',
        className,
      )}
      style={style}
    >
      <div
        className={clsx(
          'flex justify-start cursor-pointer ',
          direction === 'vertical'
            ? 'flex-col'
            : 'flex-row justify-between items-start flex-wrap ',
          variant === 'detailed' && 'pb-3',
          variant !== 'compact' && 'gap-4',
        )}
        onClick={() => router.push(`/events/${event.slug}`)}
      >
        <div
          className={clsx(
            direction === 'vertical' ? '' : 'w-[50%]',
            'flex gap-2 flex-col',
          )}
        >
          {variant != 'compact' && (
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
                <p className='font-semibold text-sm'>
                  {event.organizationName}
                </p>
              </div>
            </div>
          )}

          {variant != 'compact' && (
            <div className='px-3'>
              <h3 className='font-medium text-nm text-primary line-clamp-2 h-12'>
                {event.name}
              </h3>
              <p
                className={clsx(
                  styles.flexStart,
                  'text-sm font-medium text-green-500',
                )}
              >
                <IoTicketOutline className='w-6 h-6' />
                {event.minTicketPrice > 0
                  ? `Chỉ từ ${formatMoney(event.minTicketPrice)}`
                  : 'Miễn phí'}
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
                    content={`${event['soldTicketsNumber'] || 0} / ${event?.totalTicketNumber}`}
                    leftIcon={<FaUserFriends className='text-sm' />}
                    type='info'
                  />
                  {event.meetingToolCode && (
                    <Chip
                      content={event.meetingToolCode}
                      leftIcon={
                        <MdOutlineOnlinePrediction className='text-sm' />
                      }
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
                      variant === 'standard' && 'h-16',
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
                      content={`${event['soldTicketsNumber'] || 0} / ${event?.totalTicketNumber}`}
                      leftIcon={<FaUserFriends className='text-sm' />}
                      type='info'
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div
          className={clsx(
            direction === 'vertical'
              ? ''
              : 'w-[45%] flex justify-end items-start h-full',
          )}
        >
          {variant === 'compact' && (
            <h1 className='text-nm font-bold text-gray-900 leading-tight relative'>
              <span className='bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500 line-clamp-1'>
                {event.name}
              </span>
            </h1>
          )}
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
                variant === 'compact' && 'rounded-md',
                width <= 450 && 'rounded-md',
              )}
            />
          </div>
          {variant != 'compact' && (
            <div
              className={clsx(
                'gap-2 px-3 relative',
                direction === 'horizontal'
                  ? 'hidden'
                  : 'flex items-center justify-between flex-row mt-3',
              )}
            >
              <div className={clsx(styles.flexStart, 'gap-2')}>
                <span
                  className={clsx(styles.flexStart, 'text-sm text-green-500')}
                >
                  <FaRegEye />
                  20
                </span>
                <span
                  className={clsx(styles.flexStart, 'text-sm text-primary')}
                >
                  <FaBookmark />
                  300
                </span>
              </div>
              {trendingOrderNumber && (
                <div className='absolute right-4 text-[100px] z-40 -bottom-10 font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent italic'>
                  {trendingOrderNumber}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {variant === 'detailed' && event.tags.length > 0 && (
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
                key={`event-${event.id}-card-tag-${tag.id}`}
                className={clsx(
                  'text-sm font-light text-gray-700 hover:text-primary',
                  searchParams.getAll('tags[]').includes(tag.id + '') &&
                    'text-primary font-semibold',
                )}
              >
                #{t(`tag.${tag.name}`)}
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
                {/* {!isCanceled && !event?.canceledAt && (
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
                )} */}
              </div>
            )}
        </div>
      )}
    </div>
  );
}

export default EventCard;
