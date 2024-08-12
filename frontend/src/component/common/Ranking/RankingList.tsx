import clsx from 'clsx';
import { FaCaretRight } from 'react-icons/fa';
import { MdKeyboardDoubleArrowRight } from 'react-icons/md';

export interface Rank {
  rank: number;
  title: string;
}

interface RankingListProps {
  title: string;
  className?: string;
  data?: Rank[];
}

function RankingList({ title, className, data }: RankingListProps) {
  return (
    <div className={clsx('w-full border-b border-b-gray-300 pb-4', className)}>
      <h3 className='text-md border-b border-b-gray-500 pb-1 text-dark-main font-semibold inline-flex justify-start items-center gap-1 cursor-pointer mb-2'>
        {title} <MdKeyboardDoubleArrowRight size={16} />
      </h3>
      <ul className='flex flex-col justify-start gap-2 w-full'>
        {data?.length &&
          data.map((v) => (
            <div
              key={`rank-${v.title}`}
              className='flex justify-end items-center gap-3 cursor-pointer hover:bg-gray-100'
            >
              <p
                className={clsx(
                  'text-nm px-2 line-clamp-1',
                  v.rank === 1 && 'bg-success-sub text-success-main',
                  v.rank === 2 && 'bg-info-sub text-info-main',
                  v.rank === 3 && 'bg-warning-sub text-warning-main',
                )}
              >
                {v.title}
              </p>
              <p
                className={clsx(
                  'rounded-full text-ss px-[10px] py-1 bg-default-sub',
                  v.rank === 1 && 'bg-success-sub text-success-main',
                  v.rank === 2 && 'bg-info-sub text-info-main',
                  v.rank === 3 && 'bg-warning-sub text-warning-main',
                )}
              >
                {v.rank}
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
