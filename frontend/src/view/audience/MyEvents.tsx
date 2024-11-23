'use client';

import { useListingMyEventsQuery } from '@/src/api/user.api';
import EventCard from '@/src/component/common/Card/EventCard';
import DotLoader from '@/src/component/common/Loader/DotLoader';
import Nodata from '@/src/component/common/Nodata';
import { BaseTabs, TabsList, TabsTrigger } from '@/src/component/common/Tabs';
import { Form, FormInput } from '@/src/component/form/Form';
import { styles } from '@/src/constants/styles.constant';
import useWindowDimensions from '@/src/hooks/useWindowDimension';
import type {
  MyEventItem,
  UsersApiListingMyEventsRequest,
} from '@/src/lib/api/generated';
import { MyEventStatusCode } from '@/src/lib/api/generated';
import { searchQuery } from '@/src/utils/app.util';
import clsx from 'clsx';
import { useRouter, useSearchParams } from 'next/navigation';
import queryString from 'query-string';
import { useForm } from 'react-hook-form';
import { IoSearchOutline } from 'react-icons/io5';
import debounce from 'lodash.debounce';
import ReactPaginate from 'react-paginate';
import { useState } from 'react';

function MyEvents() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data, isLoading, isFetching } = useListingMyEventsQuery({
    ...queryString.parse(searchParams.toString(), { arrayFormat: 'bracket' }),
  });

  const [page, setPage] = useState<number>(data?.page || 1);
  const { width } = useWindowDimensions();

  const form = useForm<UsersApiListingMyEventsRequest>({
    mode: 'all',
    defaultValues: {
      keyword: searchParams.get('keyword') || '',
      status:
        (searchParams.get('status') as MyEventStatusCode) ||
        MyEventStatusCode.All,
    },
  });

  function handleSearch(data: UsersApiListingMyEventsRequest = {}) {
    const filters: UsersApiListingMyEventsRequest = {
      ...form.getValues(),
      ...data,
    };

    searchQuery(router, filters, searchParams, []);
  }

  return (
    <Form {...form}>
      <form
        className='1400px:px-[5%] px-0 w-full'
        onSubmit={form.handleSubmit(handleSearch)}
      >
        <div className={clsx(styles.between, 'flex-wrap gap-6')}>
          <div className='600px:min-w-[320px] min-w-full'>
            <FormInput
              name='keyword'
              leftIcon={<IoSearchOutline size={20} />}
              placeholder='Find web(sem)inar events you like...'
              className='w-full'
              control={form.control}
              onKeyDown={debounce(
                () => handleSearch({ keyword: form.getValues('keyword') }),
                1000,
              )}
            />
          </div>
          <BaseTabs
            defaultValue={form.getValues('status')}
            className={clsx('w-full mx-auto')}
          >
            <TabsList
              className={clsx(
                'grid grid-flow-col auto-cols-auto',
                width > 1200 && 'grid-cols-8',
              )}
            >
              {Object.keys(MyEventStatusCode).map((tab) => (
                <TabsTrigger
                  value={MyEventStatusCode[tab]}
                  key={`met-${tab}`}
                  onClick={() => {
                    form.setValue('status', MyEventStatusCode[tab]);
                    handleSearch({ status: MyEventStatusCode[tab] });
                  }}
                  className={clsx(
                    form.getValues('status') === MyEventStatusCode[tab] &&
                      '!bg-primary font-bold !text-white',
                  )}
                >
                  {tab}
                  {data &&
                    form.getValues('status') === MyEventStatusCode[tab] &&
                    ' [' + data.total + '] '}
                </TabsTrigger>
              ))}
            </TabsList>
          </BaseTabs>
        </div>

        <div className={clsx('border-t border-t-gray-300 py-[5%] mt-2')}>
          {!data && (isLoading || isFetching) && (
            <div className='mx-auto'>
              <DotLoader />
            </div>
          )}
          {data &&
            data.data?.length > 0 &&
            data?.data?.map((event: MyEventItem) => (
              <EventCard
                direction={width < 600 ? 'vertical' : 'horizontal'}
                className='w-full mb-4 mx-auto'
                event={event}
                key={event.id}
                variant='complex'
              />
            ))}

          {data && !data.data.length && <Nodata />}
        </div>

        {data && data.total > data.perPage && (
          <ReactPaginate
            breakLabel='...'
            nextLabel={width > 800 ? 'next >' : '>'}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onPageChange={({ selected }: any) => setPage(selected + 1)}
            pageRangeDisplayed={5}
            pageCount={Math.ceil(data.total / data.perPage) || 0}
            previousLabel={width > 600 ? '< previous' : '<'}
            renderOnZeroPageCount={null}
            forcePage={page >= 1 ? page - 1 : 0}
            className='mx-auto flex lg:gap-4 gap-1 mt-4 w-full items-center justify-center'
            pageClassName='lg:py-2 lg:px-4 py-1 px-2'
            nextClassName='lg:py-2 lg:px-4 py-1 px-2'
            previousClassName='lg:py-2 lg:px-4 py-1 px-2'
            disabledClassName='text-gray-400'
            activeClassName='bg-primary text-white rounded-md'
          />
        )}
      </form>
    </Form>
  );
}

export default MyEvents;
