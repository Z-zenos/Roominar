'use client';

import { styles } from '@/src/constants/styles.constant';
import clsx from 'clsx';
import type { InputHTMLAttributes, LegacyRef, ReactNode } from 'react';
import { forwardRef } from 'react';
import type { FieldError } from 'react-hook-form';

export interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  leftIconClassName?: string;
  error?: FieldError;
}

function CustomInput(
  {
    leftIcon,
    rightIcon,
    leftIconClassName,
    className,
    error,
    ...props
  }: TextInputProps,
  ref: LegacyRef<HTMLInputElement>,
) {
  return (
    <div
      className={clsx(
        'text-input-id group-input h-11 bg-white overflow-hidden cursor-pointer shadow-[2px_2px_10px_rgba(0,_0,_0,_0.075)] border  rounded-lg relative flex justify-between pl-1 gap-1 items-center hover:shadow-[0_1px_6px_rgb(0, 111, 238)]  transition-all',
        error?.message
          ? 'border-error-main hover:border-error-main'
          : 'border-gray-main hover:border-primary',
        className,
      )}
    >
      {leftIcon && (
        <span
          className={clsx(
            'w-1/6 mx-auto dark:text-dark-main ',
            styles.center,
            leftIconClassName,
          )}
        >
          {leftIcon}
        </span>
      )}
      <input
        className={clsx(
          'w-full border-none focus:ring-0 rounded-lg h-full outline-none px-0 transition-all text-sm dark:bg-white dark:text-darma',
          (leftIcon || rightIcon) && 'w-5/6',
          leftIcon && rightIcon && 'w-2/3',
          !leftIcon && !rightIcon && 'w-full px-2',
          rightIcon && '!px-2',
        )}
        ref={ref}
        {...props}
      />
      {rightIcon && (
        <span
          className={clsx(
            'w-1/6 mx-auto min-w-[40px] h-full hover:bg-emerald-50 transition-all',
            styles.center,
          )}
        >
          {rightIcon}
        </span>
      )}
    </div>
  );
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(CustomInput);

export default TextInput;
