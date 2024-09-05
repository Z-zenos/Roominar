import clsx from 'clsx';
import { FaCaretRight } from 'react-icons/fa';
import { MdKeyboardDoubleArrowRight } from 'react-icons/md';

interface RankingListProps {
  title: string;
  className?: string;
  data?: any[];
  onClick?(item: any): void;
}

function RankingList({ title, className, data, onClick }: RankingListProps) {
  return (
    <div className={clsx('w-full border-b border-b-gray-300 pb-4', className)}>
      <h3 className='text-md border-b border-b-gray-500 pb-1 text-dark-main font-semibold inline-flex justify-start items-center gap-1 cursor-pointer mb-2'>
        {title} <MdKeyboardDoubleArrowRight size={16} />
      </h3>
      <ul className='flex flex-col justify-start gap-2 w-full'>
        {data &&
          data?.length &&
          data.map((item, i) => (
            <div
              key={`rank-${item.id}`}
              className='flex justify-end items-center gap-3 cursor-pointer hover:font-semibold'
              onClick={() => onClick(item)}
            >
              <p
                className={clsx(
                  'text-sm px-2 line-clamp-1',
                  i === 0 && 'bg-success-sub text-success-main',
                  i === 1 && 'bg-info-sub text-info-main',
                  i === 2 && 'bg-warning-sub text-warning-main',
                )}
              >
                {item.name}
              </p>
              <p
                className={clsx(
                  'rounded-full text-ss px-[10px] py-1 bg-default-sub',
                  i === 0 && 'bg-success-sub text-success-main',
                  i === 1 && 'bg-info-sub text-info-main',
                  i === 2 && 'bg-warning-sub text-warning-main',
                )}
              >
                {i + 1}
              </p>
            </div>
          ))}
      </ul>
      <h4 className=' flex items-center justify-start gap-1 text-sm font-light text-primary hover:underline transition-all cursor-pointer'>
        <FaCaretRight /> See more
      </h4>
    </div>
  );
}

export default RankingList;
