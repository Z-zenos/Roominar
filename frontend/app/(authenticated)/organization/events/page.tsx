import * as React from 'react';

import { EventTable } from '@/src/view/event/EventTable';
import { DataTableSkeleton } from '@/src/component/common/DataTable/DataTableSkeleton';
// import { getValidFilters } from '@/src/component/common/DataTable/config';
import type { SearchParams } from '@/src/types/DataTable';
import { Shell } from '@/src/component/common/Shell';

interface PageProps {
  searchParams: Promise<SearchParams>;
}

export default async function Page(props: PageProps) {
  // const searchParams = await props.searchParams;
  // const search = searchParamsCache.parse(searchParams);

  // const validFilters = getValidFilters(search.filters);

  return (
    <Shell className='gap-2'>
      {/* <React.Suspense fallback={<Skeleton className="h-7 w-52" />}>
          <DateRangePicker
            triggerSize="sm"
            triggerClassName="ml-auto w-56 sm:w-60"
            align="end"
            shallow={false}
          />
        </React.Suspense> */}
      <React.Suspense
        fallback={
          <DataTableSkeleton
            columnCount={6}
            searchableColumnCount={1}
            filterableColumnCount={2}
            cellWidths={['10rem', '40rem', '12rem', '12rem', '8rem', '8rem']}
            shrinkZero
          />
        }
      >
        <EventTable />
      </React.Suspense>
    </Shell>
  );
}
