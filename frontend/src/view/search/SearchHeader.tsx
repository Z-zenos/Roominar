'use client';

import clsx from 'clsx';
import { IoSearchOutline } from 'react-icons/io5';
import { GrPowerReset } from 'react-icons/gr';

import type { UseFormReturn } from 'react-hook-form';
import { Button } from '@nextui-org/button';
import Text from '../../component/common/Typography/Text';
import { HiOutlineAdjustmentsHorizontal } from 'react-icons/hi2';
import { FormCombobox, FormInput, FormSelect } from '@/src/component/form/Form';
import {
  EventSortByCode,
  JobTypeCode,
  type EventsApiSearchEventsRequest,
} from '@/src/lib/api/generated';
import { useRouter } from 'next/navigation';
import debounce from 'lodash.debounce';
import { optionify } from '@/src/util/app.util';

interface SearchHeaderProps {
  total?: number;
  onValueChange: (data: any) => void;
  form: UseFormReturn<EventsApiSearchEventsRequest, any, undefined>;
  isFetching?: boolean;
}

function SearchHeader({
  total,
  form,
  onValueChange,
  isFetching,
}: SearchHeaderProps) {
  const { control, getValues, reset } = form;
  const filters: { [key: string]: any } = getValues();
  const router = useRouter();

  return (
    <div className='pb-4 border-b border-b-gray-200 800px:px-0 400px:px-5'>
      <div className='flex justify-between items-center flex-wrap gap-1'>
        <div className='flex items-center justify-start gap-4 flex-wrap'>
          <Button
            className={clsx('gap-2 text-[17px] font-semibold text-white')}
            type='submit'
            color='primary'
            radius='sm'
            size='md'
            startContent={<HiOutlineAdjustmentsHorizontal size={25} />}
            isLoading={isFetching}
          >
            {isFetching ? 'Searching...' : 'Search'}
          </Button>
          <Button
            className={clsx(
              'text-[17px] !px-3 !bg-orange-100 !text-orange-500 !hover:text-orange-500 !hover:border-orange-500 !hover:shadow-orange-100',
            )}
            radius='sm'
            size='md'
            onClick={() => {
              reset({
                jobTypeCodes: [],
                industryCodes: [],
                tags: [],
                cityCodes: [],
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                start_at_range: {
                  from: null,
                  to: null,
                },
              });
              router.push('/search');
            }}
            startContent={<GrPowerReset />}
          >
            Reset
          </Button>
          <div className='600px:min-w-[300px] min-w-full'>
            <FormInput
              name='keyword'
              leftIcon={<IoSearchOutline size={20} />}
              placeholder='Find web(sem)inar events you like...'
              className='w-full'
              control={control}
              onKeyDown={debounce(
                () => onValueChange({ keyword: form.getValues('keyword') }),
                1000,
              )}
            />
          </div>
          <FormCombobox
            options={optionify(JobTypeCode)}
            i18nPath='code.jobType'
            name='jobTypeCodes'
            control={control}
            onValueChange={onValueChange}
            title='job type'
          />
        </div>
        <div className='flex items-center justify-start gap-4 400px:mt-3'>
          <Text
            content='Sort by:'
            className='font-light text-gray-500'
          />
          <FormSelect
            options={optionify(EventSortByCode)}
            i18nPath='code.sortBy.search'
            control={control}
            onValueChange={onValueChange}
            defaultValue={getValues('sortBy')}
            name='sortBy'
          />
        </div>
      </div>

      <div className='flex justify-between items-center mt-4 flex-wrap gap-2'>
        <div className='flex justify-end items-center gap-4'>
          <Text
            content='Suggestion: '
            className='font-light'
          />
          {/* <div className='flex justify-start gap-2'>
            {['english', 'hat', 'TOEIC', 'JLPT'].map((sgt) => (
              <Text
                key={sgt}
                className={clsx('text-primary font-semibold cursor-pointer')}
                content={sgt}
                onClick={() => {
                  setValue('name', sgt);
                  onValueChange({ name: sgt });
                }}
              />
            ))}
          </div> */}
        </div>
        <div className='flex justify-end items-center gap-2'>
          <Text
            content={total}
            className='text-primary font-semibold'
          />
          <Text
            content='results'
            className='font-light text-gray-500'
          />
          {filters['keyword'] && (
            <>
              <Text
                content='find for'
                className='font-light text-gray-500'
              />
              <Text
                content={`"${getValues('keyword')}"`}
                className='text-gradient'
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchHeader;
