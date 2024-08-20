import clsx from 'clsx';

interface TagProps {
  title: string;
  className?: string;
}

function Tag({ title, className }: TagProps) {
  return (
    <button
      className={clsx(
        'cursor-pointer bg-white relative inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-emerald-50 hover:text-[#06B6D4] h-9  px-3 border border-gray-300',
        className,
      )}
    >
      {title}
    </button>
  );
}

export default Tag;
