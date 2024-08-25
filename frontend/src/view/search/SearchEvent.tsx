'use client';

import clsx from 'clsx';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { Fragment, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import Drawer from '../../component/common/Drawer';
import SearchHeader from './SearchHeader';
import SearchFilter from './SearchFilter';
import SearchResults from './SearchResults';
import useWindowDimensions from '@/src/hook/useWindowDimension';
import { styles } from '@/src/constant/styles.constant';
import { Form } from '@/src/component/form/Form';
import { searchQuery } from '@/src/util/app.util';
import { useSearchEventsQuery } from '@/src/api/event.api';
import queryString from 'query-string';
import DotLoader from '@/src/component/common/Loader/DotLoader';
import type { EventsApiSearchEventsRequest, EventSortByCode, IndustryCode, JobTypeCode } from '@/src/lib/api/generated';
import dayjs from 'dayjs';

function SearchEvent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data, isLoading } = useSearchEventsQuery({
    ...queryString.parse(searchParams.toString()),
  });

  const [page, setPage] = useState<number>(data?.page || 1);
  const { width } = useWindowDimensions();
  const FilterContainer = useMemo(() => (width > 1000 ? Fragment : Drawer), [width]);

  const filterContainerProps = useMemo(
    () =>
      width > 800
        ? {}
        : {
            title: 'Filter Box',
            description: 'Select something you like search',
          },
    [width],
  );

  const form = useForm<EventsApiSearchEventsRequest>({
    mode: 'all',
    defaultValues: {
      keyword: searchParams.get('keyword') || '',
      isOnline: Boolean(searchParams.get('is_online')) ?? undefined,
      isOffline: Boolean(searchParams.get('is_offline')) ?? undefined,
      isApplyOngoing: Boolean(searchParams.get('is_apply_ongoing')) ?? undefined,
      isApplyEnded: Boolean(searchParams.get('is_apply_ended')) ?? undefined,
      jobTypeCodes: (searchParams.getAll('job_type_codes') as JobTypeCode[]) || undefined,
      industryCodes: (searchParams.getAll('industry_codes') as IndustryCode[]) || undefined,
      cityCodes: searchParams.getAll('city_codes') || undefined,
      tags: (searchParams.getAll('tags') as unknown as number[]) || undefined,
      startStartAt: searchParams.get('start_start_at') ? dayjs(searchParams.get('start_start_at')).toDate() : null,
      endStartAt: searchParams.get('end_start_at') ? dayjs(searchParams.get('end_start_at')).toDate() : null,
      sortBy: (searchParams.get('sort_by') as EventSortByCode) ?? undefined,
    },
  });

  function handleSearch(data: any = {}) {
    console.log('data: ', data);
    if (form.getValues()['start_at_range']) {
      const start_at_range = form.getValues()['start_at_range'];
      data.start_start_at = dayjs(start_at_range.from).format('YYYY-MM-DD');
      data.end_start_at = dayjs(start_at_range.to).format('YYYY-MM-DD');
    }
    const filters: EventsApiSearchEventsRequest = {
      ...form.getValues(),
      ...data,
    };

    const exclude_queries = ['start_at_range'];

    searchQuery(router, filters, searchParams, exclude_queries);
  }

  return (
    <Form {...form}>
      <form className={clsx(styles.section, 'mt-8')} onSubmit={form.handleSubmit(handleSearch)}>
        <SearchHeader total={data?.total} form={form} onSearch={handleSearch} />
        <div className='py-10 flex 1000px:flex-row 1000px:justify-between 1000px:items-start flex-col items-center justify-center gap-3'>
          {!data && isLoading ? (
            <div className='mx-auto'>
              <DotLoader />
            </div>
          ) : (
            <>
              <FilterContainer {...filterContainerProps}>
                <SearchFilter
                  className='xl:w-1/5 lg:w-1/4 1000px:w-1/4 w-full h-fit'
                  control={form.control}
                  onSearch={handleSearch}
                />
              </FilterContainer>
              <SearchResults
                events={data?.data}
                total={data?.total}
                perPage={data?.perPage}
                isLoading={isLoading}
                onPageChange={setPage}
                page={page}
                className='flex 800px:justify-start justify-center flex-wrap lg:w-4/5 w-full h-fit gap-7 1000px:px-5 px-0'
              />
            </>
          )}
        </div>
      </form>
    </Form>
  );
}

export default SearchEvent;
