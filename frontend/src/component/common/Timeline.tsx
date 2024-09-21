'use client';

import { formatEventDate } from '@/src/view/search/util/app.util';
import { SlNote } from 'react-icons/sl';
import { RiFileCloseLine } from 'react-icons/ri';
import { PiShootingStarThin } from 'react-icons/pi';
import { CiLogout } from 'react-icons/ci';
import clsx from 'clsx';

interface TimelineProps {
  applicationStartAt?: Date;
  applicationEndAt?: Date;
  startAt?: Date;
  endAt?: Date;
  className?: string;
}

function Timeline({
  applicationStartAt,
  applicationEndAt,
  startAt,
  endAt,
  className,
}: TimelineProps) {
  return (
    <div className={clsx('w-full max-w-6xl mx-auto bg-emerald-50', className)}>
      <div className='w-full py-6'>
        <div className='flex'>
          <div className='w-1/4'>
            <div className='relative mb-2'>
              <div className='w-10 h-10 mx-auto bg-green-500 rounded-full text-lg text-white flex items-center'>
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
                  <div className='w-full bg-green-300 py-1 rounded'></div>
                </div>
              </div>

              <div className='w-10 h-10 mx-auto bg-green-500 rounded-full text-lg text-white flex items-center'>
                <span className='text-center text-white w-full'>
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
                  <div className='w-[33%] bg-green-300 py-1 rounded'></div>
                </div>
              </div>

              <div className='w-10 h-10 mx-auto bg-white border-2 border-gray-200 rounded-full text-lg text-white flex items-center'>
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
                  <div className='w-0 bg-green-300 py-1 rounded'></div>
                </div>
              </div>

              <div className='w-10 h-10 mx-auto bg-white border-2 border-gray-200 rounded-full text-lg text-white flex items-center'>
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
