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
import { optionify } from '@/src/utils/app.util';
import { Button } from '@nextui-org/react';
import useWindowDimensions from '@/src/hooks/useWindowDimension';
import { HiOutlineAdjustmentsHorizontal } from 'react-icons/hi2';

interface SearchFilterProps {
  className?: string;
  control: Control<EventsApiSearchEventsRequest>;
  onValueChange: (data: EventsApiSearchEventsRequest) => void;
  isFetching?: boolean;
}

function SearchFilter({
  className,
  control,
  onValueChange,
  isFetching,
}: SearchFilterProps) {
  const [showMoreIndustryCodes, setShowMoreIndustryCodes] =
    useState<boolean>(false);
  const { width } = useWindowDimensions();

  return (
    <div
      className={clsx(
        'border border-gray-300 rounded-sm 1000px:block 600px:grid 600px:grid-cols-2 600px:gap-2 450px:grid-cols-1 1000px:max-w-[300px] min-w-[250px]',
        className,
      )}
    >
      <FilterBox title='Lĩnh vực'>
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
          {showMoreIndustryCodes ? 'Ít hơn' : 'Nhiều hơn'}
          {showMoreIndustryCodes ? <FaChevronUp /> : <FaChevronDown />}
        </Link>
      </FilterBox>
      <FilterBox title='Tags'>
        <FormTagsInput
          title='tags'
          name='tags'
          control={control}
          onValueChange={onValueChange}
        />
      </FilterBox>

      <FilterBox title='Giá'>
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
      <FilterBox title='Thời gian'>
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
        <Label className='mt-3'>Ngày bắt đầu</Label>
        <FormDateRangePicker
          name='startAtRange'
          control={control}
          className='w-full'
          onValueChange={onValueChange}
          showTimePicker={false}
        />
      </FilterBox>

      {width <= 450 && (
        <div className='flex justify-center my-2'>
          <Button
            className={clsx(
              'gap-2 450px:text-nm text-sm font-semibold text-white',
            )}
            type='submit'
            color='primary'
            radius='sm'
            size='md'
            startContent={
              <HiOutlineAdjustmentsHorizontal size={width > 450 ? 25 : 20} />
            }
            isLoading={isFetching}
          >
            {isFetching ? 'Searching...' : 'Search'}
          </Button>
        </div>
      )}
    </div>
  );
}

export default SearchFilter;
