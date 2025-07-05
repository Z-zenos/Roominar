'use client';

import ReactPaginate from 'react-paginate';
import EventCard from '../../component/common/Card/EventCard';
import useWindowDimensions from '@/src/hooks/useWindowDimension';
import type { SearchEventsItem } from '@/src/lib/api/generated';
import { useSearchParams } from 'next/navigation';

interface SearchResultsProps {
  className?: string;
  isLoading?: boolean;
  events: SearchEventsItem[];
  total: number;
  perPage: number;
  onPageChange: (page: number) => void;
}

function SearchResults({
  className,
  events,
  total,
  perPage,
  onPageChange,
}: SearchResultsProps) {
  const { width } = useWindowDimensions();
  const searchParams = useSearchParams();

  return (
    <div className={className}>
      {events?.length > 0 ? (
        events?.map((event: SearchEventsItem) => (
          <EventCard
            direction={
              (width < 1200 && width > 1000) || width < 800
                ? 'vertical'
                : 'horizontal'
            }
            className='w-full'
            event={event}
            key={event.id}
          />
        ))
      ) : (
        <div className='w-full h-full flex items-center justify-center'>
          <p className='text-gray-500 text-lg font-medium'>
            Không có sự kiện nào phù hợp
          </p>
        </div>
      )}

      {total > 0 && perPage > 0 && total > perPage && (
        <ReactPaginate
          breakLabel='...'
          nextLabel={width > 800 ? 'next >' : '>'}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onPageChange={({ selected }: any) => onPageChange(selected + 1)}
          pageRangeDisplayed={5}
          pageCount={Math.ceil(total / perPage) || 0}
          previousLabel={width > 800 ? '< previous' : '<'}
          renderOnZeroPageCount={null}
          forcePage={
            searchParams.get('page') ? Number(searchParams.get('page')) - 1 : 0
          }
          className='mx-auto flex lg:gap-4 gap-1 mt-4 w-full items-center justify-center'
          pageClassName='lg:py-2 lg:px-4 py-1 px-2'
          nextClassName='lg:py-2 lg:px-4 py-1 px-2'
          previousClassName='lg:py-2 lg:px-4 py-1 px-2'
          disabledClassName='text-gray-400'
          activeClassName='bg-primary text-white rounded-md'
        />
      )}
    </div>
  );
}

export default SearchResults;
