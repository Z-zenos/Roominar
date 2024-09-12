'use client';

import { ProgressCard } from './ProgressCard';
import { Dropzone } from './Dropzone';
import type { HTMLAttributes } from 'react';
import { useEffect } from 'react';
import clsx from 'clsx';
import { MdInfoOutline } from 'react-icons/md';
import { useUpload } from '@/src/hook/useUploadImage';
import { RiDragMove2Fill } from 'react-icons/ri';
import { TbHandClick } from 'react-icons/tb';
import { styles } from '@/src/constant/styles.constant';
import { Avatar } from '@nextui-org/react';

export interface ImageUploaderProps extends HTMLAttributes<HTMLDivElement> {
  maxFiles?: number;
  maxSize?: number;
  name?: string;
  formats?: string[];
  onGetImageUrl?(url: string): void;
}

const ImageUploader = ({
  maxFiles = 1,
  maxSize = 5120000,
  className,
  name,
  formats = ['.png', '.jpeg', '.jpg'],
  onGetImageUrl,
}: ImageUploaderProps) => {
  const u = useUpload(formats, maxFiles, maxSize);

  useEffect(() => {
    if (u.image) onGetImageUrl && onGetImageUrl(u.image.secure_url);
  }, [u.image, onGetImageUrl]);

  return (
    <div>
      {!u.isFetching && (
        <div
          {...u.getRootProps({ className: 'dropzone' })}
          className={clsx('bg-white rounded-xl mx-auto', className)}
        >
          <div className='relative w-full h-full flex gap-6 py-3 px-1 justify-start items-center'>
            {u.image ? (
              <Avatar
                isBordered
                className='transition-transform w-[100px] h-[100px]'
                color='primary'
                name={name}
                src={u?.image?.secure_url}
              />
            ) : (
              <Dropzone
                isActive={u.isDragActive}
                onInputProps={u.getInputProps}
                htmlFor={name}
                onClick={() => u.inputRef.current?.click()}
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
      )}

      {u.isFetching && <ProgressCard progressStatus={u.progressStatus} />}
    </div>
  );
};

export default ImageUploader;
