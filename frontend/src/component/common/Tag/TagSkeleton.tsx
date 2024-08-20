'use client';

import { Skeleton } from '@nextui-org/react';
import clsx from 'clsx';

export default function TagSkeleton() {
  return (
    <Skeleton className={clsx('rounded-md w-[100px] h-9')}>
      <div className='h-9 bg-secondary'></div>
    </Skeleton>
  );
}
