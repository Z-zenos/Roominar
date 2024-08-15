'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { Fragment, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { addDays, format } from 'date-fns';
import Drawer from '../../component/common/Drawer';
import SearchHeader from './SearchHeader';
import SearchFilter from './SearchFilter';
import SearchResults from './SearchResults';
import useWindowDimensions from '@/src/hook/useWindowDimension';
import { searchCourseFormSchema, type SearchCourseFormSchema } from '@/src/schemas/course/SearchCourseFormSchema';
import { styles } from '@/src/constant/styles.constant';
import { Form } from '@/src/component/form/Form';
import { searchQuery } from '@/src/util/app.util';
import { useListingEventQuery } from '@/src/api/event.api';
import queryString from 'query-string';
import DotLoader from '@/src/component/common/Loader/DotLoader';

function SearchEvent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data, isLoading } = useListingEventQuery({
    ...queryString.parse(searchParams.toString()),
  });

  console.log(data);

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

  const form = useForm<SearchCourseFormSchema>({
    mode: 'all',
    defaultValues: {
      name: searchParams.get('name') || '',
      averageRatings: undefined,
      level: searchParams.getAll('level') || undefined,
      price:
        !searchParams.get('price[gte]') && !searchParams.get('price[lte]')
          ? undefined
          : [+(searchParams.get('price[gte]') as string) || 1, +(searchParams.get('price[lte]') as string) || 1000],
      isFree: searchParams.get('price') ? true : false,
      registerDateRange:
        !searchParams.get('registerStartDate[gte]') && searchParams.get('registerStartDate[gte]')
          ? {
              from: new Date(searchParams.get('registerStartDate[gte]') as string) || new Date(),
              to: new Date(searchParams.get('registerStartDate[lte]') as string) || addDays(new Date(), 30),
            }
          : undefined,
    },
    resolver: zodResolver(searchCourseFormSchema),
  });

  function handleSearch(data: any) {
    const searchObj = {
      ...form.getValues(),
      ...data,
    };

    const filters = {
      name: searchObj?.name,
      'averageRatings[gte]': searchObj.averageRatings,
      level: searchObj?.level?.length ? searchObj.level : undefined,
      'price[gte]': searchObj.price ? searchObj.price[0] : undefined,
      'price[lte]': searchObj.price ? searchObj.price[1] : undefined,
      price: searchObj.isFree ? 0 : undefined,
      'registerStartDate[gte]': searchObj.registerDateRange?.from
        ? format(searchObj.registerDateRange.from, 'yyyy-MM-dd')
        : undefined,
      'registerStartDate[lte]': searchObj.registerDateRange?.to
        ? format(searchObj.registerDateRange?.to, 'yyyy-MM-dd')
        : undefined,
    };

    searchQuery(router, filters, searchParams);
  }

  return (
    <Form {...form}>
      <form className={clsx(styles.section, 'mt-8')} onSubmit={form.handleSubmit(handleSearch)}>
        <SearchHeader total={12} form={form} onSearch={handleSearch} />
        <div className='py-10 flex 1000px:flex-row 1000px:justify-between 1000px:items-start flex-col items-center justify-center gap-3'>
          {!data && isLoading ? (
            <DotLoader />
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
