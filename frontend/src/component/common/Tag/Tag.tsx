'use client';

import type ITag from '@/src/types/Tag';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';

interface TagProps {
  tag: ITag;
  className?: string;
  onSelect?: (tag: ITag) => void;
  active?: boolean;
}

function Tag({ tag, className, onSelect, active = false }: TagProps) {
  const t = useTranslations('code');
  return (
    <div
      className={clsx(
        'cursor-pointer relative inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-emerald-50 hover:text-[#06B6D4] h-9  px-3 border  active:scale-90 transition-all',
        active
          ? 'bg-emerald-50 text-[#06B6D4] border-[#06B6D4]'
          : 'bg-white border-gray-300',
        className,
      )}
      onClick={() => onSelect(tag)}
    >
      {t(`tag.${tag.name}`)}
    </div>
  );
}

export default Tag;
