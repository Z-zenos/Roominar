'use client';

import { type HTMLAttributes } from 'react';
import { cn } from '@/src/util/app.util';
import { DatePicker, TimeInput } from '@nextui-org/react';
import { styles } from '@/src/constant/styles.constant';

export interface DateTimePickerProps extends HTMLAttributes<HTMLDivElement> {}

export function DateTimePicker({ className }: DateTimePickerProps) {
  return (
    <div className={cn(styles.flexStart, 'gap-3', className)}>
      <DatePicker
        className='min-w-[250px]'
        radius='sm'
      />
      <TimeInput
        label={null}
        radius='sm'
        classNames={{
          input: 'px-10',
        }}
      />
    </div>
  );
}
