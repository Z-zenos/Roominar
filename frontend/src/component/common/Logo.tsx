'use client';

import { Link, Image } from '@nextui-org/react';
import clsx from 'clsx';
import LogoImage from '@/public/logo/logo.png';

interface LogoProps {
  className?: string;
}

function Logo({ className }: LogoProps) {
  return (
    <Link
      href='/home'
      className={clsx('rounded-lg', className)}
    >
      <Image
        className='w-auto translate-y-3'
        alt='Roominar Footer Logo'
        width={200}
        src={LogoImage.src}
      />
    </Link>
  );
}

export default Logo;
