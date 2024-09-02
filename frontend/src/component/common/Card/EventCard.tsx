'use client';

import clsx from 'clsx';
import Chip from '../Chip';
import { MdOutlineAccessTime, MdOutlineOnlinePrediction } from 'react-icons/md';
import { Button } from '@nextui-org/button';
import { IoBookmarkOutline } from 'react-icons/io5';
import { FaRegShareSquare, FaTags, FaUserFriends } from 'react-icons/fa';
import { BsThreeDots } from 'react-icons/bs';
import { Image, Link } from '@nextui-org/react';
import { SlNote } from 'react-icons/sl';
import { useRouter, useSearchParams } from 'next/navigation';
import { styles } from '@/src/constant/styles.constant';
import type { SearchEventsItem, TagItem } from '@/src/lib/api/generated';
import { formatEventDate } from '@/src/util/app.util';
import dayjs from 'dayjs';

interface EventCardProps {
  className?: string;
  direction?: 'horizontal' | 'vertical';
  variant?: 'simple' | 'complex';
  event: SearchEventsItem;
}

function EventCard({
  className,
  direction = 'vertical',
  variant = 'complex',
  event,
}: EventCardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <div
      className={clsx(
        'bg-white rounded-lg py-3 shadow-[rgba(60,_64,_67,_0.15)_0px_1px_1px_0px,_rgba(60,_64,_67,_0.15)_0px_2px_4px_2px] cursor-pointer active:shadow-none transition-all',
        direction === 'vertical'
          ? 'min-w-[300px] w-[300px] 600px:max-w-[400px] max-w-[300px] border-t border-t-gray-300'
          : 'border border-gray-200 items-start px-3',
        className,
      )}
      onClick={() => router.push(`/events/${event.slug}`)}
    >
      <div
        className={clsx(
          'flex gap-4 justify-start ',
          direction === 'vertical'
            ? 'flex-col'
            : 'flex-row justify-between items-start flex-wrap ',
          variant === 'complex' && 'pb-3',
        )}
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
                Published on {dayjs(event.publicAt).format('MMM DD, YYYY')}
              </p>
            </div>
          </div>

          <div className='px-3'>
            <h3 className='font-medium text-nm text-primary line-clamp-2'>
              {event.name}
            </h3>
            <p className='text-sm font-light line-clamp-1 text-gray-700'>
              {event.organizeAddress}
            </p>
            <span className='flex items-center text-ss gap-1 my-2'>
              <MdOutlineAccessTime className='text-nm' />{' '}
              {formatEventDate(event.startAt)}{' '}
              {direction === 'horizontal' &&
                '〜' + formatEventDate(event.endAt)}
            </span>
            {direction === 'vertical' && (
              <div className={clsx(styles.between)}>
                <Chip
                  content={event.applicationNumber + ''}
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
                <div className={clsx(styles.flexStart, 'gap-2 flex-wrap')}>
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
                    content={event.applicationNumber + ''}
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
          <Image
            src={
              event.coverImageUrl ??
              'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVoYkFRN0wzDRnM7OwHq7yINArQLe5UJKV9A&s'
            }
            alt='event image'
            width={400}
            height={200}
            className={clsx(
              'w-full h-full',
              direction === 'horizontal' ? 'rounded-md' : 'rounded-none',
            )}
          />
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
            >
              <SlNote size={16} />
            </Button>
            <Button
              isIconOnly
              color='primary'
              variant='flat'
            >
              <IoBookmarkOutline size={16} />
            </Button>
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
        <div
          className={clsx(
            styles.flexStart,
            'flex-wrap gap-x-2 mt-2 pt-2 border-t border-t-slate-300',
            direction === 'vertical' && 'px-3',
          )}
        >
          <FaTags
            className='text-orange-500 '
            size={16}
          />
          {event.tags.map((tag: TagItem, i: number) => (
            <Link
              href={`?${searchParams.toString() ? searchParams.toString() + '&' : ''}tags=${tag.id}`}
              underline='hover'
              key={`event-card-tag-${tag.id}`}
              className={clsx(
                'text-sm font-light text-gray-700 hover:text-primary',
                searchParams.getAll('tags').includes(tag.id + '') &&
                  'text-primary font-semibold',
              )}
            >
              #{tag.name}
              {i === event.tags.length - 1 ? '' : ', '}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default EventCard;
