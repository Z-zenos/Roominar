'use client';

import { useListingMyEventsQuery } from '@/src/api/user.api';
import EventCard from '@/src/component/common/Card/EventCard';
import DotLoader from '@/src/component/common/Loader/DotLoader';
import Nodata from '@/src/component/common/Nodata';
import { BaseTabs, TabsList, TabsTrigger } from '@/src/component/common/Tabs';
import { Form, FormInput } from '@/src/component/form/Form';
import { styles } from '@/src/constant/styles.constant';
import useWindowDimensions from '@/src/hook/useWindowDimension';
import type {
  MyEventItem,
  UsersApiListingMyEventsRequest,
} from '@/src/lib/api/generated';
import { MyEventStatusCode } from '@/src/lib/api/generated';
import { searchQuery } from '@/src/util/app.util';
import clsx from 'clsx';
import { useRouter, useSearchParams } from 'next/navigation';
import queryString from 'query-string';
import { useForm } from 'react-hook-form';
import { IoSearchOutline } from 'react-icons/io5';

function MyEvents() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data, isLoading, isFetching } = useListingMyEventsQuery({
    ...queryString.parse(searchParams.toString(), { arrayFormat: 'bracket' }),
  });

  // const [page, setPage] = useState<number>(data?.page || 1);
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
            />
          </div>
          <BaseTabs
            defaultValue={MyEventStatusCode.All}
            className={clsx('w-full mx-auto')}
          >
            <TabsList className='grid grid-cols-8'>
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
                direction={
                  (width < 1200 && width > 1000) || width < 800
                    ? 'vertical'
                    : 'horizontal'
                }
                className='w-full'
                event={event}
                key={event.id}
              />
            ))}

          {data && !data.data.length && <Nodata />}
        </div>
      </form>
    </Form>
  );
}

export default MyEvents;
