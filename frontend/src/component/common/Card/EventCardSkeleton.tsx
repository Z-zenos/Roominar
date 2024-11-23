'use client';

import clsx from 'clsx';
import { FaTags } from 'react-icons/fa';
import { Skeleton } from '@nextui-org/react';
import { styles } from '@/src/constants/styles.constant';

interface EventCardSkeletonProps {
  className?: string;
  direction?: 'horizontal' | 'vertical';
  variant?: 'simple' | 'complex';
}

function EventCardSkeleton({
  className,
  direction = 'vertical',
  variant = 'complex',
}: EventCardSkeletonProps) {
  return (
    <div
      className={clsx(
        'bg-white rounded-lg py-3 shadow-[rgba(60,_64,_67,_0.15)_0px_1px_1px_0px,_rgba(60,_64,_67,_0.15)_0px_2px_4px_2px] cursor-pointer active:shadow-none transition-all',
        direction === 'vertical'
          ? 'min-w-[300px] w-[300px] 600px:max-w-[400px] max-w-[300px] border-t border-t-gray-300'
          : 'border border-gray-200 items-start px-3 w-full',
        className,
      )}
    >
      <div
        className={clsx(
          'flex gap-4 justify-start ',
          direction === 'vertical'
            ? 'flex-col'
            : 'flex-row justify-between items-start flex-wrap ',
          variant === 'complex' && 'pb-3 border-b border-b-slate-300',
        )}
      >
        <div
          className={clsx(
            direction === 'vertical' ? '' : 'w-[50%]',
            'flex gap-2 flex-col',
          )}
        >
          <div className='flex gap-3 items-center px-3'>
            <Skeleton className={clsx('rounded-full w-8 h-8 ')} />
            <div>
              <Skeleton className={clsx('rounded-sm w-[150px] h-4 mb-1')} />
              <Skeleton className={clsx('rounded-sm w-[100px] h-3 ')} />
            </div>
          </div>

          <div className='px-3'>
            <Skeleton className={clsx('rounded-md w-full h-6')} />
            <Skeleton className={clsx('rounded-md w-[100px] h-4 my-1')} />
            <Skeleton className={clsx('rounded-md w-[150px] h-4 my-2')} />

            {direction === 'vertical' && (
              <div className={clsx(styles.between, 'mt-1')}>
                <Skeleton className={clsx('rounded-md w-[80px] h-7 ')} />
                <Skeleton className={clsx('rounded-md w-[80px] h-7 ')} />
              </div>
            )}
            {direction === 'horizontal' && (
              <div className='flex flex-col justify-start gap-y-2 mt-3'>
                <div className={clsx(styles.flexStart, 'gap-2 flex-wrap')}>
                  <Skeleton className={clsx('rounded-md w-[150px] h-7 ')} />
                  <Skeleton className={clsx('rounded-md w-[80px] h-7 ')} />
                  <Skeleton className={clsx('rounded-md w-[80px] h-7 ')} />
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
          <Skeleton className={clsx('w-full h-[200px]')} />

          <div
            className={clsx(
              'flex items-center gap-3 px-3',
              direction === 'horizontal'
                ? 'justify-center flex-col'
                : 'justify-start flex-row mt-3',
            )}
          >
            <Skeleton className={clsx('rounded-xl w-[40px] h-[40px]')} />
            <Skeleton className={clsx('rounded-xl w-[40px] h-[40px]')} />
            <Skeleton className={clsx('rounded-xl w-[40px] h-[40px]')} />
            <Skeleton className={clsx('rounded-xl w-[40px] h-[40px]')} />
          </div>
        </div>
      </div>

      {variant === 'complex' && (
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
          <Skeleton className={clsx('rounded-md w-[40px] h-[16px]')} />
        </div>
      )}
    </div>
  );
}

export default EventCardSkeleton;
