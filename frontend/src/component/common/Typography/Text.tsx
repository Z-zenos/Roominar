'use client';

import clsx from 'clsx';
import type { DOMAttributes } from 'react';

interface TextProps extends DOMAttributes<HTMLDivElement> {
  content?: string | number;
  display?: string;
  className?: string;
}

export default function Text({ content, display = 'block', className, children, ...props }: TextProps) {
  return (
    <div className={clsx('text-dark-main dark:text-white font-[500] font-Poppins', display, className)} {...props}>
      {content}
      {children}
    </div>
  );
}
