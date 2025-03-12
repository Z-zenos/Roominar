'use client';

import { styles } from '@/src/constants/styles.constant';
import { Image, Link } from '@nextui-org/react';
import clsx from 'clsx';

export default function Page() {
  return (
    <div className={clsx(styles.center, 'flex-col pt-20')}>
      <h2 className='text-lg font-semibold'>
        How do you want to build your event?
      </h2>
      <div className={clsx(styles.center, 'text-center gap-5 mt-6')}>
        <Link
          className={clsx(
            styles.center,
            'flex-col p-6 rounded-lg border border-slate-300 hover:border-primary transition-all max-w-[400px] cursor-pointer',
          )}
          href='#'
        >
          <Image
            src='/images/smartphone.png'
            alt='event handmade'
            width={60}
            height={60}
            className='aspect-square p-1 bg-gray-100'
          />
          <p className='text-nm text-black font-semibold my-2'>
            Start from scratch
          </p>
          <p className='text-sm text-gray-700 font-light'>
            Add all your event details, create new tickets, and set up recurring
            events
          </p>
        </Link>

        <Link
          className={clsx(
            styles.center,
            'flex-col p-6 rounded-lg border border-slate-300 hover:border-primary transition-all max-w-[400px] cursor-pointer',
          )}
          href='/organization/events/create/auto'
        >
          <Image
            src='/images/technology.png'
            alt='event handmade'
            width={60}
            height={60}
            className='aspect-square p-1 bg-gray-100'
          />
          <p className='text-nm text-black font-semibold my-2'>
            Create your event faster with AI
          </p>
          <p className='text-sm text-gray-700 font-light'>
            Provide some your event information to generate an event
            that&lsquo;s ready to publish almost instantly
          </p>
        </Link>
      </div>
    </div>
  );
}
