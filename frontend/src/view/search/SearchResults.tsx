'use client';

import { useRouter } from 'next/navigation';
import ReactPaginate from 'react-paginate';
import EventCard from '../../component/common/Card/EventCard';
import useWindowDimensions from '@/src/hook/useWindowDimension';

interface SearchResultsProps {
  className?: string;
  isLoading?: boolean;
  // courses: DetailCourseSchema[];
  total: number;
  perPage: number;
}

function SearchResults({
  className,
  // courses,
  total,
  perPage,
}: SearchResultsProps) {
  const { width } = useWindowDimensions();
  const router = useRouter();

  return (
    <div className={className}>
      {/* {courses?.length > 0 &&
				courses?.map((course: DetailCourseSchema) => (
					<CourseCard
						course={course}
						direction={width < 1024 && width > 800 ? 'horizontal' : 'vertical'}
						key={`${course.id}`}
					/>
				))} */}

      <EventCard
        direction={(width < 1200 && width > 1000) || width < 800 ? 'vertical' : 'horizontal'}
        className='w-full'
      />
      <EventCard
        direction={(width < 1200 && width > 1000) || width < 800 ? 'vertical' : 'horizontal'}
        className='w-full'
      />
      <EventCard
        direction={(width < 1200 && width > 1000) || width < 800 ? 'vertical' : 'horizontal'}
        className='w-full'
      />
      <EventCard
        direction={(width < 1200 && width > 1000) || width < 800 ? 'vertical' : 'horizontal'}
        className='w-full'
      />

      <ReactPaginate
        breakLabel='...'
        nextLabel={width > 800 ? 'next >' : '>'}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onPageChange={({ selected }: any) => router.push(`?page=${selected + 1}`)}
        pageRangeDisplayed={5}
        pageCount={Math.ceil(total / perPage) || 0}
        previousLabel={width > 800 ? '< previous' : '<'}
        renderOnZeroPageCount={null}
        className='mx-auto flex lg:gap-4 gap-1 mt-4 w-full items-center justify-center'
        pageClassName='lg:py-2 lg:px-4 py-1 px-2'
        nextClassName='lg:py-2 lg:px-4 py-1 px-2'
        previousClassName='lg:py-2 lg:px-4 py-1 px-2'
        disabledClassName='text-gray-400'
        activeClassName='bg-primary text-white rounded-md'
      />
    </div>
  );
}

export default SearchResults;
