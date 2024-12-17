'use client';

import { formatEventDate } from '@/src/utils/app.util';
import { SlNote } from 'react-icons/sl';
import { RiFileCloseLine } from 'react-icons/ri';
import { PiShootingStarThin } from 'react-icons/pi';
import { CiLogout } from 'react-icons/ci';
import clsx from 'clsx';
import { useMemo } from 'react';

interface TimelineProps {
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
  const today = new Date();

  return Math.max(
    Math.ceil(
      ((today.getTime() - startDate.getTime()) /
        (endDate.getTime() - startDate.getTime())) *
        100,
    ),
    0,
  );
}

function Timeline({
  applicationStartAt,
  applicationEndAt,
  startAt,
  endAt,
  className,
}: TimelineProps) {
  const progress = useMemo(() => {
    return [
      getTodayProgressBetweenTwoDates(applicationStartAt, applicationEndAt),
      getTodayProgressBetweenTwoDates(applicationEndAt, startAt),
      getTodayProgressBetweenTwoDates(startAt, endAt),
    ];
  }, [applicationStartAt, applicationEndAt, startAt, endAt]);

  return (
    <div className={clsx('w-full max-w-6xl mx-auto bg-emerald-50', className)}>
      <div className='w-full py-6'>
        <div className='flex'>
          <div className='w-1/4'>
            <div className='relative mb-2'>
              <div
                className={clsx(
                  'w-10 h-10 mx-auto rounded-full text-lg flex items-center',
                  progress[0] > 0
                    ? 'bg-green-500 text-white'
                    : 'bg-white text-black border border-gray-200',
                )}
              >
                <span className='text-center text-white w-full'>
                  <SlNote
                    size={20}
                    className='w-full fill-current'
                  />
                </span>
              </div>
            </div>

            <div className='text-xs text-center md:text-base'>
              <p>Start apply at</p>
              <p className='mt-1 font-semibold'>
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
                    ? 'bg-green-500 text-white'
                    : 'bg-white text-black border border-gray-200',
                )}
              >
                <span className='text-center w-full'>
                  <RiFileCloseLine
                    size={20}
                    className='w-full fill-current'
                  />
                </span>
              </div>
            </div>

            <div className='text-xs text-center md:text-base'>
              <p>Finish apply at</p>
              <p className='mt-1 font-semibold'>
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
                    ? 'bg-green-500 text-white'
                    : 'bg-white text-black border border-gray-200',
                )}
              >
                <span className='text-center text-gray-600 w-full'>
                  <PiShootingStarThin
                    size={20}
                    className='w-full fill-current'
                  />
                </span>
              </div>
            </div>

            <div className='text-xs text-center md:text-base'>
              <p>Start event at</p>
              <p className='mt-1 font-semibold'>{formatEventDate(startAt)}</p>
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
                    ? 'bg-green-500 text-white'
                    : 'bg-white text-black border border-gray-200',
                )}
              >
                <span className='text-center text-gray-600 w-full'>
                  <CiLogout
                    size={20}
                    className='w-full fill-current'
                  />
                </span>
              </div>
            </div>

            <div className='text-xs text-center md:text-base'>
              <p>Finish at</p>
              <p className='mt-1 font-semibold'>{formatEventDate(endAt)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Timeline;
