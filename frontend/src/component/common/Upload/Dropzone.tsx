'use client';

import c from 'clsx';
import PhotoIcon from '@/public/icons/photos.svg';

import type { FC } from 'react';
import type { DropzoneInputProps } from 'react-dropzone';
import { Avatar } from '@nextui-org/react';

type DropzoneProps = {
  htmlFor?: string;
  isActive?: boolean;
  onInputProps: <T extends DropzoneInputProps>(props?: T) => T;
  onClick: () => void;
  defaultImageUrl?: string;
  className?: string;
};

export const Dropzone: FC<DropzoneProps> = ({
  isActive = false,
  onInputProps,
  htmlFor,
  onClick,
  defaultImageUrl,
  className,
}) => {
  return (
    <label
      htmlFor={htmlFor}
      onClick={onClick}
      className={c(
        'block w-[100px] min-w-[100px] group relative transition-all border-dashed rounded-full cursor-pointer',
        isActive
          ? 'border-pink-300 bg-pink-50'
          : 'border-gray-600 bg-slate-50 hover:border-blue-main',
        defaultImageUrl ? '' : 'overflow-hidden p-8 border-2',
        'flex justify-center items-center',
        className,
      )}
    >
      <input {...onInputProps()} />
      {defaultImageUrl ? (
        <Avatar
          isBordered
          className='transition-transform w-[100px] h-[100px]'
          color='primary'
          name={htmlFor}
          src={defaultImageUrl}
        />
      ) : (
        <PhotoIcon className='fill-gray-600 w-[30%] h-[30%] min-h-8 min-w-8 group-hover:fill-blue-main' />
      )}
    </label>
  );
};
