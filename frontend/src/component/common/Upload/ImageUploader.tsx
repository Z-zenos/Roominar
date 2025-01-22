'use client';

import { Dropzone } from './Dropzone';
import type { HTMLAttributes } from 'react';
import { useEffect } from 'react';
import clsx from 'clsx';
import { MdInfoOutline } from 'react-icons/md';
import { useUpload } from '@/src/hooks/useUploadImage';
import { RiDragMove2Fill } from 'react-icons/ri';
import { TbHandClick } from 'react-icons/tb';
import { styles } from '@/src/constants/styles.constant';
import { Avatar, Button, CircularProgress } from '@nextui-org/react';
import { Label } from '../Label';
import { GoTrash } from 'react-icons/go';

export interface ImageUploaderProps extends HTMLAttributes<HTMLDivElement> {
  maxFiles?: number;
  maxSize?: number;
  name?: string;
  formats?: string[];
  onGetImageUrl?(url: string): void;
  defaultImageUrl?: string;
  variant?: 'avatar' | 'cover';
}

const ImageUploader = ({
  maxFiles = 1,
  maxSize = 5120000,
  className,
  name,
  formats = ['.png', '.jpeg', '.jpg'],
  onGetImageUrl,
  defaultImageUrl,
  variant = 'avatar',
}: ImageUploaderProps) => {
  const u = useUpload(formats, maxFiles, maxSize);

  useEffect(() => {
    if (u.image) onGetImageUrl && onGetImageUrl(u.image.secure_url);
  }, [u.image, onGetImageUrl]);

  return (
    <div className={clsx('bg-white rounded-xl mx-auto', className)}>
      <div className='relative w-full h-full flex gap-6 py-3 px-1 justify-start items-center'>
        {!u.isFetching && u.image && (
          <Avatar
            isBordered
            className={clsx(
              'transition-transform',
              variant === 'avatar'
                ? 'w-[100px] h-[100px]'
                : 'w-[700px] h-[350px]',
            )}
            color='primary'
            name={name}
            src={u?.image?.secure_url}
            radius={variant === 'cover' ? 'lg' : 'full'}
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
              className={clsx(
                variant === 'cover' &&
                  'w-[700px] h-[350px] !border-gray-400 rounded-lg',
              )}
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

        <div>
          <p className='gap-3 text-sm mb-2 ml-2 text-gray-500 self-start font-light flex justify-start items-center'>
            <MdInfoOutline size={20} />
            File format: {formats?.join(', ')}
          </p>
          <p className='gap-3 text-sm ml-2 text-gray-500 self-start font-light'>
            <span className={clsx(styles.flexStart, 'inline-flex mr-2')}>
              <RiDragMove2Fill size={20} />
              Drag & Drop
            </span>
            <span className={clsx(styles.flexStart, 'inline-flex ml-2')}>
              <TbHandClick size={20} />
              Click to Upload
            </span>
          </p>
          <div className={clsx(styles.flexStart, 'gap-2 mt-2')}>
            <Button
              className={clsx(
                'font-light border border-gray-600 text-gray-600',
              )}
              variant='bordered'
              type='submit'
              color='primary'
              radius='sm'
              size='sm'
              as={Label}
              htmlFor={name}
            >
              Change
            </Button>
            <Button
              className={clsx('font-light border text-red-500 border-red-500 ')}
              variant='bordered'
              isIconOnly
              size='sm'
              startContent={<GoTrash size={16} />}
              onClick={() => u.deleteImage(u.image!.public_id)}
              type='button'
            />
          </div>
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

export default ImageUploader;
