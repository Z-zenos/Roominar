'use client';

import clsx from 'clsx';
import type { HTMLAttributes, ReactNode } from 'react';

interface ChipProps extends HTMLAttributes<HTMLDivElement> {
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  content?: string;
  type?: 'default' | 'info' | 'error' | 'success' | 'warning';
  children?: ReactNode;
}

function Chip({
  className,
  content,
  leftIcon,
  rightIcon,
  type = 'default',
  children,
}: ChipProps) {
  return (
    <div
      className={clsx(
        `rounded-md px-2 py-1 text-ss colorset-${type}`,
        (leftIcon || rightIcon) && 'flex gap-[5px] items-center justify-center',
        className,
      )}
    >
      {leftIcon}
      {content}
      {children}
      {rightIcon}
    </div>
  );
}

export default Chip;
