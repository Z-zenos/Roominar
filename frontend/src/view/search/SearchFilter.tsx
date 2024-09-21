'use client';

import clsx from 'clsx';
import FilterBox from './FilterBox';
import type { Control } from 'react-hook-form';
import { useState } from 'react';
import { Link } from '@nextui-org/link';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa6';
import { Label } from '../../component/common/Label';
import {
  FormCheckBox,
  FormCheckBoxList,
  FormDateRangePicker,
  FormTagsInput,
} from '@/src/component/form/Form';
import { styles } from '@/src/constant/styles.constant';
import {
  IndustryCode,
  type EventsApiSearchEventsRequest,
} from '@/src/lib/api/generated';
import { parseCode } from '@/src/util/app.util';
import { useListingTagsQuery } from '@/src/api/tag.api';

interface SearchFilterProps {
  className?: string;
  control: Control<EventsApiSearchEventsRequest>;
  onSearch: (data: EventsApiSearchEventsRequest) => void;
}

function SearchFilter({ className, control, onSearch }: SearchFilterProps) {
  const [showMoreIndustryCodes, setShowMoreIndustryCodes] =
    useState<boolean>(false);
  const { data: tagData } = useListingTagsQuery();

  return (
    <div
      className={clsx(
        'border border-gray-300 rounded-sm 1000px:block 600px:grid 600px:grid-cols-2 600px:gap-2 400px:grid-cols-1 1000px:max-w-[300px] min-w-[250px]',
        className,
      )}
    >
      <FilterBox title='Industry'>
        <FormCheckBoxList
          name='industryCodes'
          control={control}
          data={Object.keys(IndustryCode)
            .slice(
              0,
              showMoreIndustryCodes ? Object.keys(IndustryCode).length : 7,
            )
            .map((ic: string) => ({
              value: IndustryCode[ic],
              label: parseCode(IndustryCode[ic]),
            }))}
          onSearch={onSearch}
        />
        <Link
          className={
            (styles.flexStart, 'font-light text-sm gap-2 cursor-pointer')
          }
          underline='hover'
          onClick={() => setShowMoreIndustryCodes(!showMoreIndustryCodes)}
        >
          Show {showMoreIndustryCodes ? 'less' : 'more'}
          {showMoreIndustryCodes ? <FaChevronUp /> : <FaChevronDown />}
        </Link>
      </FilterBox>
      <FilterBox title='Tags'>
        <FormTagsInput
          title='tags'
          name='tags'
          control={control}
          onSearch={onSearch}
          data={tagData}
        />
      </FilterBox>

      <FilterBox title='Price'>
        <FormCheckBox
          name='isFree'
          control={control}
          onSearch={onSearch}
          title='Free'
        />
        <FormCheckBox
          name='isPaid'
          control={control}
          onSearch={onSearch}
          title='Paid'
        />
      </FilterBox>
      <FilterBox title='State'>
        <FormCheckBox
          name='isOnline'
          control={control}
          onSearch={onSearch}
          title='Online'
        />
        <FormCheckBox
          name='isOffline'
          control={control}
          onSearch={onSearch}
          title='Offline'
        />
      </FilterBox>
      <FilterBox title='Timeline'>
        <FormCheckBox
          name='today'
          control={control}
          onSearch={onSearch}
          title='Today'
        />
        <FormCheckBox
          name='isApplyOngoing'
          control={control}
          onSearch={onSearch}
          title='Opening Application'
        />
        <FormCheckBox
          name='isApplyEnded'
          control={control}
          onSearch={onSearch}
          title='Closed Application'
        />
        <Label className='mt-3'>Start date</Label>
        <FormDateRangePicker
          name='start_at_range'
          control={control}
          className='w-full'
          onSearch={onSearch}
        />
      </FilterBox>
    </div>
  );
}

export default SearchFilter;
