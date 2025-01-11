'use client';

import clsx from 'clsx';
import type { ReactNode } from 'react';
import toast from 'react-hot-toast';

interface AttendeeDetailInfoRowProps {
  title: ReactNode;
  content: ReactNode;
}

export default function AttendeeDetailInfoRow({
  title,
  content,
}: AttendeeDetailInfoRowProps) {
  return (
    <div className='py-1 px-2 my-1 grid grid-cols-2 odd:bg-gray-100'>
      <p>{title}</p>
      <p
        onClick={() => {
          if (content.toString().length === 0) return;
          navigator.clipboard.writeText(content.toString());
          toast.success('Copied');
        }}
        className={clsx(
          content?.toString().length > 0 && 'hover:cursor-pointer',
        )}
      >
        {content}
      </p>
    </div>
  );
}
