'use client';

import DotLoader from '@/src/component/common/Loader/DotLoader';
import Logo from '@/src/component/common/Logo';
import { useEffect, useState } from 'react';

export default function EventApplicationResult({ searchParams }) {
  const { session_id, status: applyStatus } = searchParams;
  const [status, setStatus] = useState(applyStatus ?? 'loading');

  useEffect(() => {
    if (session_id) {
      fetch(`/api/verify-session?session_id=${session_id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setStatus('success');
          else setStatus('failed');
        });
    }
  }, [session_id]);

  return (
    <main className='grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8'>
      <div className='text-center'>
        <Logo />
        <h1 className='mt-4'>
          {status === 'success' && (
            <span className='text-success-500 text-3xl font-bold tracking-tight'>
              Application successful! 🎉
            </span>
          )}
          {status === 'failed' && <span>Application failed! 😵</span>}
          {status === 'loading' && <DotLoader />}
        </h1>
        <div className='mt-10 flex items-center justify-center gap-x-6'>
          <a
            href='/home'
            className='rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
          >
            Go back home
          </a>
          <a
            href='#'
            className='text-sm font-semibold text-gray-900'
          >
            Contact support <span aria-hidden='true'>&rarr;</span>
          </a>
        </div>
      </div>
    </main>
  );
}
