'use client';

import Logo from '@/src/component/common/Logo';
// import { Image } from '@nextui-org/react';
import { useEffect } from 'react';

export default function NotFound() {
  useEffect(() => {
    setTimeout(() => {
      window.location.href = '/home';
    }, 2000);
  }, []);

  return (
    <main className='grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8'>
      <div className='text-center'>
        <Logo />
        <h1 className='text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl'>
          Không tìm thấy trang
        </h1>
        <div className='mt-10 flex items-center justify-center gap-x-6'>
          <a
            href='/home'
            className='rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
          >
            Quay lại trang chủ
          </a>
          <a
            href='#'
            className='text-sm font-semibold text-gray-900'
          >
            Liên hệ chúng tôi <span aria-hidden='true'>&rarr;</span>
          </a>
        </div>
      </div>
    </main>
  );
}
