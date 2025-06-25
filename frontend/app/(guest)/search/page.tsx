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
        title='Vievent'
        description='Vievent help you to search all concerned event you like'
        keywords='Filter,search,event,seminar,webinar'
      />
      <Tabs
        defaultValue='Sự kiện'
        tabs={[
          { value: 'Sự kiện', content: <SearchEvent /> },
          {
            value: 'Nhà tổ chức',
            content: (
              <Text
                className='py-[10%] text-center'
                content='Coming soon.'
              />
            ),
          },
          {
            value: 'Diễn giả',
            content: (
              <Text
                className='py-[10%] text-center'
                content='Coming soon.'
              />
            ),
          },
        ]}
        className='450px:px-[10%] px-[5%]'
        tabClassName='max-w-[400px] mx-auto'
      />
    </>
  );
};

export default Page;
