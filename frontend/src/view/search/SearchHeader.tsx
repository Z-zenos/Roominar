'use client';

import clsx from 'clsx';
import { IoSearchOutline } from 'react-icons/io5';
import { GrPowerReset } from 'react-icons/gr';

import type { UseFormReturn } from 'react-hook-form';
import { Button } from '@nextui-org/button';
import Text from '../../component/common/Typography/Text';
import { SelectInput } from '../../component/common/Input/SelectInput';
import { HiOutlineAdjustmentsHorizontal } from 'react-icons/hi2';
import type { SearchCourseFormSchema } from '@/src/schemas/course/SearchCourseFormSchema';
import { FormInput } from '@/src/component/form/Form';

interface SearchHeaderProps {
  total?: number;
  onSearch: (data: SearchCourseFormSchema) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<SearchCourseFormSchema, any, undefined>;
}

function SearchHeader({ total, onSearch, form }: SearchHeaderProps) {
  const { control, getValues, setValue, reset } = form;
  const filters: { [key: string]: any } = getValues();

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
          >
            Search
          </Button>
          <Button
            className={clsx(
              'text-[17px] !px-3 !bg-orange-100 !text-orange-500 !hover:text-orange-500 !hover:border-orange-500 !hover:shadow-orange-100',
            )}
            radius='sm'
            size='md'
            onClick={() => reset({})}
            startContent={<GrPowerReset />}
          >
            Reset
          </Button>
          <div className='600px:min-w-[300px] min-w-full'>
            <FormInput
              name='name'
              leftIcon={<IoSearchOutline size={20} />}
              placeholder='Find web(sem)inar events you like...'
              className='w-full'
              control={control}
            />
          </div>
        </div>
        <div className='flex items-center justify-start gap-4 400px:mt-3'>
          <Text content='Sort by:' className='font-light text-gray-500' />
          <SelectInput
            values={[
              'Newest',
              'Most popular',
              'Most reviews',
              'Register deadline',
              'Recommendation', // Build based by user.
            ]}
            onChange={function (): void {
              throw new Error('Function not implemented.');
            }}
            onBlur={function (): void {
              throw new Error('Function not implemented.');
            }}
            value={undefined}
            name={''}
          />
        </div>
      </div>

      <div className='flex justify-between items-center mt-4 flex-wrap gap-2'>
        <div className='flex justify-end items-center gap-4'>
          <Text content='Suggestion: ' className='font-light' />
          <div className='flex justify-start gap-2'>
            {['english', 'hat', 'TOEIC', 'JLPT'].map((sgt) => (
              <Text
                key={sgt}
                className={clsx('text-primary font-semibold cursor-pointer')}
                content={sgt}
                onClick={() => {
                  setValue('name', sgt);
                  onSearch({ name: sgt });
                }}
              />
            ))}
          </div>
        </div>
        <div className='flex justify-end items-center gap-2'>
          <Text content={total} className='text-primary font-semibold' />
          <Text content='results' className='font-light text-gray-500' />
          {filters['name'] && (
            <>
              <Text content='find for' className='font-light text-gray-500' />
              <Text content={`"${getValues('name')}"`} className='text-gradient' />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchHeader;
