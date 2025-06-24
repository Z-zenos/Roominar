'use client';

import { formatEventDate } from '@/src/utils/app.util';
import { SlNote } from 'react-icons/sl';
import { RiFileCloseLine } from 'react-icons/ri';
import { PiShootingStarThin } from 'react-icons/pi';
import { CiLogout } from 'react-icons/ci';
import clsx from 'clsx';
import { useMemo } from 'react';

interface HorizontalTimelineProps {
  applicationStartAt?: Date;
  applicationEndAt?: Date;
  startAt?: Date;
  endAt?: Date;
  className?: string;
}

function getTodayProgressBetweenTwoDates(
  startDate: Date,
  endDate: Date,
): number {
  const today = new Date() > endDate ? endDate : new Date();

  return Math.max(
    Math.ceil(
      ((today.getTime() - startDate.getTime()) /
        (endDate.getTime() - startDate.getTime())) *
        100,
    ),
    0,
  );
}

function HorizontalTimeline({
  applicationStartAt,
  applicationEndAt,
  startAt,
  endAt,
  className,
}: HorizontalTimelineProps) {
  const progress = useMemo(() => {
    return [
      getTodayProgressBetweenTwoDates(applicationStartAt, applicationEndAt),
      getTodayProgressBetweenTwoDates(applicationEndAt, startAt),
      getTodayProgressBetweenTwoDates(startAt, endAt),
    ];
  }, [applicationStartAt, applicationEndAt, startAt, endAt]);

  return (
    <div className={clsx('w-full max-w-6xl mx-auto', className)}>
      <div className='w-full py-6'>
        <div className='flex'>
          <div className='w-1/4'>
            <div className='relative mb-2'>
              <div
                className={clsx(
                  'w-10 h-10 mx-auto rounded-full text-lg flex items-center',
                  progress[0] > 0
                    ? 'bg-green-500'
                    : 'bg-white border border-gray-200',
                )}
              >
                <span className='text-center w-full'>
                  <SlNote
                    size={20}
                    className={clsx(
                      'w-full',
                      progress[0] > 0 ? 'fill-white' : 'fill-black',
                    )}
                  />
                </span>
              </div>
            </div>

            <div className='text-xs text-center md:text-base'>
              <p>Thời gian mở đăng ký</p>
              <p className='mt-1 font-semibold 450px:text-sm text-xs'>
                {formatEventDate(applicationStartAt)}
              </p>
            </div>
          </div>

          <div className='w-1/4'>
            <div className='relative mb-2'>
              <div
                className='absolute flex align-center items-center align-middle content-center'
                style={{
                  width: 'calc(100% - 2.5rem - 1rem)',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <div className='w-full bg-gray-200 rounded items-center align-middle align-center flex-1'>
                  <div
                    className={`bg-green-300 py-1 rounded`}
                    style={{ width: `${progress[0]}%` }}
                  ></div>
                </div>
              </div>

              <div
                className={clsx(
                  'w-10 h-10 mx-auto rounded-full text-lg flex items-center',
                  progress[0] >= 100
                    ? 'bg-green-500'
                    : 'bg-white border border-gray-200',
                )}
              >
                <span className='text-center w-full'>
                  <RiFileCloseLine
                    size={20}
                    className={clsx(
                      'w-full',
                      progress[0] >= 100 ? 'fill-white' : 'fill-gray-600',
                    )}
                  />
                </span>
              </div>
            </div>

            <div className='text-xs text-center md:text-base'>
              <p>Thời gian kết thúc đăng ký</p>
              <p className='mt-1 font-semibold 450px:text-sm text-xs'>
                {formatEventDate(applicationEndAt)}
              </p>
            </div>
          </div>

          <div className='w-1/4'>
            <div className='relative mb-2'>
              <div
                className='absolute flex align-center items-center align-middle content-center'
                style={{
                  width: 'calc(100% - 2.5rem - 1rem)',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <div className='w-full bg-gray-200 rounded items-center align-middle align-center flex-1'>
                  <div
                    className={`bg-green-300 py-1 rounded`}
                    style={{ width: `${progress[1]}%` }}
                  ></div>
                </div>
              </div>

              <div
                className={clsx(
                  'w-10 h-10 mx-auto rounded-full text-lg flex items-center',
                  progress[1] >= 100
                    ? 'bg-green-500'
                    : 'bg-white border border-gray-200',
                )}
              >
                <span className='text-center w-full'>
                  <PiShootingStarThin
                    size={20}
                    className={clsx(
                      'w-full',
                      progress[1] >= 100 ? 'fill-white' : 'fill-gray-600',
                    )}
                  />
                </span>
              </div>
            </div>

            <div className='text-xs text-center md:text-base'>
              <p>Sự kiện bắt đầu vào lúc</p>
              <p className='mt-1 font-semibold 450px:text-sm text-xs'>
                {formatEventDate(startAt)}
              </p>
            </div>
          </div>

          <div className='w-1/4'>
            <div className='relative mb-2'>
              <div
                className='absolute flex align-center items-center align-middle content-center'
                style={{
                  width: 'calc(100% - 2.5rem - 1rem)',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <div className='w-full bg-gray-200 rounded items-center align-middle align-center flex-1'>
                  <div
                    className={`bg-green-300 py-1 rounded`}
                    style={{ width: `${progress[2]}%` }}
                  ></div>
                </div>
              </div>

              <div
                className={clsx(
                  'w-10 h-10 mx-auto rounded-full text-lg flex items-center',
                  progress[2] >= 100
                    ? 'bg-green-500 '
                    : 'bg-white border border-gray-200',
                )}
              >
                <span className='text-center w-full'>
                  <CiLogout
                    size={20}
                    className={clsx(
                      'w-full',
                      progress[2] >= 100 ? 'fill-white' : 'fill-gray-600',
                    )}
                  />
                </span>
              </div>
            </div>

            <div className='text-xs text-center md:text-base'>
              <p>Sự kiện sẽ kết thúc lúc</p>
              <p className='mt-1 font-semibold 450px:text-sm text-xs'>
                {formatEventDate(endAt)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HorizontalTimeline;
