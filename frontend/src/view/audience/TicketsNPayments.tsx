'use client';

import {
  useGetTicketStatusCountsQuery,
  useListingMyTicketsQuery,
} from '@/src/api/ticket.api';
import MyTicketCard from '@/src/component/common/Card/MyTicketCard';
import DotLoader from '@/src/component/common/Loader/DotLoader';
import { Form, FormInput } from '@/src/component/form/Form';
import useWindowDimensions from '@/src/hooks/useWindowDimension';
import type { TicketsApiListingMyTicketsRequest } from '@/src/lib/api/generated';
import { TransactionStatusCode } from '@/src/lib/api/generated';
import { searchQuery } from '@/src/utils/app.util';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { IoSearchOutline } from 'react-icons/io5';
import debounce from 'lodash.debounce';
import clsx from 'clsx';
import { styles } from '@/src/constants/styles.constant';
import { BaseTabs, TabsList, TabsTrigger } from '@/src/component/common/Tabs';
import ReactPaginate from 'react-paginate';
import Nodata from '@/src/component/common/Nodata';
import queryString from 'query-string';

function TicketsNPayment() {
  const { width } = useWindowDimensions();
  const searchParams = useSearchParams();
  const router = useRouter();
  const {
    data: myTicketsData,
    isLoading: isListingMyTicketsLoading,
    isFetching: isListingMyTicketsFetching,
    refetch: refetchListingMyTickets,
  } = useListingMyTicketsQuery({
    ...queryString.parse(searchParams.toString(), { arrayFormat: 'bracket' }),
  });
  const { data: statusCounts, refetch: refetchStatusCounts } =
    useGetTicketStatusCountsQuery();

  const [page, setPage] = useState<number>(myTicketsData?.page || 1);

  const form = useForm<TicketsApiListingMyTicketsRequest>({
    mode: 'all',
    defaultValues: {
      keyword: searchParams.get('keyword') || '',
      status:
        (searchParams.get('status') as TransactionStatusCode) ||
        TransactionStatusCode.Success,
    },
  });

  function handleSearch(data: TicketsApiListingMyTicketsRequest = {}) {
    const filters: TicketsApiListingMyTicketsRequest = {
      ...form.getValues(),
      ...data,
    };

    searchQuery(router, filters, searchParams, []);
  }

  return (
    <Form {...form}>
      <form
        className='px-5 w-full mt-3'
        onSubmit={form.handleSubmit(handleSearch)}
      >
        <div className={clsx(styles.between, 'flex-wrap gap-6')}>
          <div className={clsx(styles.flexStart, 'gap-2')}>
            <FormInput
              name='keyword'
              leftIcon={<IoSearchOutline size={20} />}
              placeholder='Find ticket name...'
              className='w-full 600px:min-w-[320px] min-w-full'
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
              {Object.keys(TransactionStatusCode).map((tab) => (
                <TabsTrigger
                  value={TransactionStatusCode[tab]}
                  key={`met-${tab}`}
                  onClick={() => {
                    form.setValue('status', TransactionStatusCode[tab]);
                    handleSearch({ status: TransactionStatusCode[tab] });
                  }}
                  className={clsx(
                    form.getValues('status') === TransactionStatusCode[tab] &&
                      '!bg-primary font-bold !text-white',
                  )}
                >
                  {tab}
                  {statusCounts &&
                    ' [' + statusCounts[TransactionStatusCode[tab]] + '] '}
                </TabsTrigger>
              ))}
            </TabsList>
          </BaseTabs>
        </div>

        <div className={clsx('border-t border-t-gray-300 py-[5%] mt-2')}>
          {!myTicketsData &&
            (isListingMyTicketsLoading || isListingMyTicketsFetching) && (
              <div className='mx-auto'>
                <DotLoader />
              </div>
            )}

          <div className='flex 1200px:jusify-start justify-center flex-wrap gap-4 p-5'>
            {myTicketsData &&
              myTicketsData.data?.length > 0 &&
              myTicketsData.data?.map((ticket) => {
                return (
                  <MyTicketCard
                    key={ticket.id}
                    ticket={ticket}
                    direction={
                      width > 1200 || width < 600 ? 'vertical' : 'horizontal'
                    }
                    onCancel={(state) => {
                      if (state) {
                        refetchListingMyTickets();
                        refetchStatusCounts();
                      }
                    }}
                  />
                );
              })}
          </div>

          {myTicketsData && !myTicketsData.data.length && <Nodata />}
        </div>

        {myTicketsData && myTicketsData.total > myTicketsData.perPage && (
          <ReactPaginate
            breakLabel='...'
            nextLabel={width > 800 ? 'next >' : '>'}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onPageChange={({ selected }: any) => setPage(selected + 1)}
            pageRangeDisplayed={5}
            pageCount={
              Math.ceil(myTicketsData.total / myTicketsData.perPage) || 0
            }
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

export default TicketsNPayment;
