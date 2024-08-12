'use client';

import Head from '@/src/component/common/Head';
import { Tabs } from '@/src/component/common/Tabs';
import SearchEvent from '@/src/view/search/SearchEvent';
import Text from '@/src/component/common/Typography/Text';
import type { FC } from 'react';

interface Props {}

const Page: FC<Props> = () => {
  return (
    <>
      <Head
        title='Roominar'
        description='Roominar help you to search all concerned event you like'
        keywords='Filter,search,event,seminar,webinar'
      />
      <Tabs
        defaultValue='events'
        tabs={[
          { value: 'events', content: <SearchEvent /> },
          {
            value: 'organizations',
            content: <Text className='py-[10%] text-center' content='Coming soon.' />,
          },
          {
            value: 'speacker',
            content: <Text className='py-[10%] text-center' content='Coming soon.' />,
          },
        ]}
        className='1600px:px-[20%] px-[15%]'
      />
    </>
  );
};

export default Page;
