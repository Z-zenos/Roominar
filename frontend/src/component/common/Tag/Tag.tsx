'use client';

import clsx from 'clsx';

interface TagProps {
  id: number;
  title: string;
  className?: string;
  onSelect?: (id: number) => void;
  active?: boolean;
}

function Tag({ id, title, className, onSelect, active = false }: TagProps) {
  return (
    <div
      className={clsx(
        'cursor-pointer relative inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-emerald-50 hover:text-[#06B6D4] h-9  px-3 border  active:scale-90 transition-all',
        active ? 'bg-emerald-50 text-[#06B6D4] border-[#06B6D4]' : 'bg-white border-gray-300',
        className,
      )}
      onClick={() => onSelect(id)}
    >
      {title}
    </div>
  );
}

export default Tag;
