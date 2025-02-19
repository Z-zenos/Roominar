import clsx from 'clsx';
import type { ReactNode } from 'react';

interface BadgeProps {
  title?: string | number;
  icon?: ReactNode;
  iconColor?: string;
  className?: string;
  onClick?(): void;
}

export default function Badge({
  title,
  icon: Icon,
  iconColor = 'text-dark-main',
  className,
  onClick,
}: BadgeProps) {
  return (
    <div
      className={clsx(
        ' text-dark-main dark:bg-white flex items-center justify-between rounded-lg max-w-[200px] shadow-md',
        'bg-[#dcfffb] text-[#0a9484] border-none font-medium px-2 py-1 text-xs',
        className,
      )}
      onClick={onClick}
    >
      {Icon && <span className={clsx('font-bold', iconColor)}>{Icon}</span>}
      <span className={clsx('')}>{title}</span>
    </div>
  );
}
