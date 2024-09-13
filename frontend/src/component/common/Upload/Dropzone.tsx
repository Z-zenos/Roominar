'use client';

import c from 'clsx';
import PhotoIcon from '@/public/icons/photos.svg';

import type { FC } from 'react';
import type { DropzoneInputProps } from 'react-dropzone';

type DropzoneProps = {
  htmlFor?: string;
  isActive?: boolean;
  onInputProps: <T extends DropzoneInputProps>(props?: T) => T;
  onClick: () => void;
};

export const Dropzone: FC<DropzoneProps> = ({
  isActive = false,
  onInputProps,
  htmlFor,
  onClick,
}) => {
  return (
    <label
      htmlFor={htmlFor}
      onClick={onClick}
      className={c(
        'block w-[100px] min-w-[100px] group relative transition-all border-2 border-dashed rounded-full overflow-hidden p-8 cursor-pointer',
        isActive
          ? 'border-pink-300 bg-pink-50'
          : 'border-gray-600 bg-slate-50 hover:border-blue-main',
      )}
    >
      <input {...onInputProps()} />
      <PhotoIcon className='fill-gray-600 w-8 h-8 group-hover:fill-blue-main' />
    </label>
  );
};
