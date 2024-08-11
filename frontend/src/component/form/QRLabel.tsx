import type { ReactNode } from 'react';
import React from 'react';

const QRLabel = ({ label }: { label: string | ReactNode }) => {
  return (
    <div className='flex justify-center items-center gap-[10px]'>
      {label}
      <div className='bg-[#539928] rounded-[10px] px-[10px] text-white fon'>QR</div>
    </div>
  );
};

export default QRLabel;
