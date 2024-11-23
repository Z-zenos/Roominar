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
import { styles } from '@/src/constants/styles.constant';
import {
  IndustryCode,
  type EventsApiSearchEventsRequest,
} from '@/src/lib/api/generated';
import { useListingTagsQuery } from '@/src/api/tag.api';
import { optionify } from '@/src/utils/app.util';

interface SearchFilterProps {
  className?: string;
  control: Control<EventsApiSearchEventsRequest>;
  onValueChange: (data: EventsApiSearchEventsRequest) => void;
}

function SearchFilter({
  className,
  control,
  onValueChange,
}: SearchFilterProps) {
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
          options={optionify(IndustryCode).slice(
            0,
            showMoreIndustryCodes ? optionify(IndustryCode).length : 7,
          )}
          i18nPath='code.industry'
          direction='vertical'
          onValueChange={onValueChange}
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
          onValueChange={onValueChange}
          data={tagData}
        />
      </FilterBox>

      <FilterBox title='Price'>
        <FormCheckBox
          name='isFree'
          control={control}
          onValueChange={onValueChange}
          label='isFree'
        />
        <FormCheckBox
          name='isPaid'
          control={control}
          onValueChange={onValueChange}
          label='isPaid'
        />
      </FilterBox>
      <FilterBox title='State'>
        <FormCheckBox
          name='isOnline'
          control={control}
          onValueChange={onValueChange}
          label='isOnline'
        />
        <FormCheckBox
          name='isOffline'
          control={control}
          onValueChange={onValueChange}
          label='isOffline'
        />
      </FilterBox>
      <FilterBox title='Timeline'>
        <FormCheckBox
          name='today'
          control={control}
          onValueChange={onValueChange}
          label='today'
        />
        <FormCheckBox
          name='isApplyOngoing'
          control={control}
          onValueChange={onValueChange}
          label='isApplyOngoing'
        />
        <FormCheckBox
          name='isApplyEnded'
          control={control}
          onValueChange={onValueChange}
          label='isApplyEnded'
        />
        <Label className='mt-3'>Start date</Label>
        <FormDateRangePicker
          name='start_at_range'
          control={control}
          className='w-full'
          onValueChange={onValueChange}
        />
      </FilterBox>
    </div>
  );
}

export default SearchFilter;
