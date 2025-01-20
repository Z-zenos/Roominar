'use client';

import { Dropzone } from './Dropzone';
import type { HTMLAttributes } from 'react';
import { useEffect } from 'react';
import clsx from 'clsx';
import { useUpload } from '@/src/hooks/useUploadImage';
import { TbArrowsExchange } from 'react-icons/tb';
import { styles } from '@/src/constants/styles.constant';
import { Avatar, Button, CircularProgress } from '@nextui-org/react';
import { GoTrash } from 'react-icons/go';

export interface GalleryUploaderProps extends HTMLAttributes<HTMLDivElement> {
  maxFiles?: number;
  maxSize?: number;
  name?: string;
  formats?: string[];
  onGetImageUrl?(url: string): void;
  defaultImageUrl?: string;
}

const GalleryUploader = ({
  maxFiles = 5,
  maxSize = 5120000,
  className,
  name,
  formats = ['.png', '.jpeg', '.jpg'],
  onGetImageUrl,
  defaultImageUrl,
}: GalleryUploaderProps) => {
  const u = useUpload(formats, maxFiles, maxSize);

  useEffect(() => {
    if (u.image) onGetImageUrl && onGetImageUrl(u.image.secure_url);
  }, [u.image, onGetImageUrl]);

  return (
    <div className={clsx('bg-white rounded-xl mx-auto', className)}>
      <div className='relative w-fit h-full py-3 px-1 justify-start items-center group'>
        {!u.isFetching && u.image && (
          <Avatar
            isBordered
            className='transition-transform w-[200px] h-[200px]'
            color='primary'
            name={name}
            src={u?.image?.secure_url}
            radius='md'
          />
        )}
        {!u.isFetching && !u.image && (
          <div {...u.getRootProps({ className: 'dropzone' })}>
            <Dropzone
              isActive={u.isDragActive}
              onInputProps={u.getInputProps}
              htmlFor={name}
              onClick={() => u.inputRef.current?.click()}
              defaultImageUrl={defaultImageUrl}
              className='w-[200px] h-[160px] !border-gray-400 rounded-lg'
            />
          </div>
        )}
        {u.isFetching && (
          <CircularProgress
            aria-label='Loading...'
            size='lg'
            value={u.progressStatus || 50}
            color='warning'
            showValueLabel={true}
            classNames={{
              svg: 'w-[100px] h-[100px] border border-gray-300 rounded-full  bg-slate-50',
              indicator: 'stroke-white',
              track: 'stroke-primary',
              value: 'text-sm font-light',
            }}
            strokeWidth={2}
          />
        )}

        <div
          className={clsx(
            styles.flexStart,
            'gap-2 mt-2 action-btn hidden transition-all group-hover:flex',
          )}
        >
          <Button
            className={clsx('font-light border border-gray-600 text-gray-600')}
            variant='bordered'
            isIconOnly
            size='sm'
            type='submit'
            startContent={<TbArrowsExchange size={16} />}
          />
          <Button
            className={clsx('font-light border text-red-500 border-red-500 ')}
            variant='bordered'
            isIconOnly
            size='sm'
            startContent={<GoTrash size={16} />}
          />
        </div>

        <input
          ref={u.inputRef}
          type='file'
          id={name}
          name={name}
          accept={formats?.map((f) => `image/${f}`).join(', ')}
          hidden
          onChange={u.onFileChange}
        />
      </div>
    </div>
  );
};

export default GalleryUploader;
