'use client';

import { Dropzone } from './Dropzone';
import type { HTMLAttributes } from 'react';
import { useEffect } from 'react';
import clsx from 'clsx';
import { CircularProgress, Image } from '@nextui-org/react';
import { useUploadMultipleFiles } from '@/src/hooks/useUploadMultipleFiles';

interface MultipleFilesUploaderProps extends HTMLAttributes<HTMLDivElement> {
  maxFiles?: number;
  maxSize?: number;
  name?: string;
  formats?: string[];
  onGetImageUrls?(urls: string[]): void;
  defaultImageUrl?: string;
}

const MultipleFilesUploader = ({
  maxFiles = 6,
  maxSize = 5120000,
  className,
  name,
  formats = ['.png', '.jpeg', '.jpg'],
  onGetImageUrls,
  defaultImageUrl,
}: MultipleFilesUploaderProps) => {
  const u = useUploadMultipleFiles(formats, maxFiles, maxSize);

  useEffect(() => {
    if (onGetImageUrls) {
      const urls = u.images.map((img) => img.secure_url);
      onGetImageUrls(urls);
    }
  }, [u.images, onGetImageUrls]);

  return (
    <div className={clsx('bg-white rounded-xl mx-auto mt-4', className)}>
      <div className='grid grid-cols-3 gap-4'>
        {u.images.map((image, index) => (
          <div
            key={index}
            className='relative'
          >
            <Image
              src={image.secure_url}
              className='w-[300px] h-[200px]'
              radius='md'
              alt='image preview'
            />
            {u.progressStatus[index] < 100 && (
              <CircularProgress
                value={u.progressStatus[index] || 0}
                size='lg'
                color='warning'
              />
            )}
          </div>
        ))}
        {u.isUploading && (
          <CircularProgress
            aria-label='Uploading...'
            value={
              u.progressStatus.reduce((a, b) => a + b, 0) /
              u.progressStatus.length
            }
          />
        )}
        {!u.isUploading && u.images.length < maxFiles && (
          <div
            {...u.getRootProps({
              className: 'rounded flex items-center justify-center',
            })}
          >
            <div {...u.getRootProps({ className: 'dropzone' })}>
              <Dropzone
                isActive={u.isDragActive}
                onInputProps={u.getInputProps}
                htmlFor={name}
                onClick={() => u.inputRef.current?.click()}
                defaultImageUrl={defaultImageUrl}
                className='w-[300px] h-[200px] !border-gray-400 rounded-lg'
              />
            </div>
            <input
              ref={u.inputRef}
              type='file'
              hidden
              multiple
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MultipleFilesUploader;
