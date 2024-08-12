'use client';

import type { ReactNode } from 'react';
import type { Control } from 'react-hook-form';
import { RadioGroup, RadioGroupItem } from '../../component/common/RadioGroup';
import type { SearchCourseFormSchema } from '@/src/schemas/course/SearchCourseFormSchema';
import { FormControl, FormField, FormItem, FormLabel } from '@/src/component/form/Form';

interface FilterRadioBoxProps {
  name: 'averageRatings' | 'name';
  values: string[];
  labels: ReactNode[] | string[];
  control: Control<SearchCourseFormSchema>;
  onSearch: (data: SearchCourseFormSchema) => void;
}

export function FilterRadioBox({
  name,
  values,
  control,
  labels,
  // onSearch,
}: FilterRadioBoxProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className='space-y-3'>
          <FormControl>
            <RadioGroup
              onValueChange={(value) => {
                field.onChange(value);
                // onSearch({ averageRatings: value });
              }}
              defaultValue={field.value}
              className='flex flex-col space-y-1'
            >
              {values &&
                values.length > 0 &&
                values.map((value, i) => (
                  <FormItem key={value} className='flex items-center space-x-3 space-y-0'>
                    <FormControl>
                      <RadioGroupItem value={value} />
                    </FormControl>
                    <FormLabel className='font-normal'>{labels[i]}</FormLabel>
                  </FormItem>
                ))}
            </RadioGroup>
          </FormControl>
        </FormItem>
      )}
    />
  );
}
