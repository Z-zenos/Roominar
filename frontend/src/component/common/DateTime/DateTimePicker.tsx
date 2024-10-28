'use client';

import { useRef, type HTMLAttributes } from 'react';
import { cn } from '@/src/util/app.util';
import { DatePicker } from '@nextui-org/react';
import { styles } from '@/src/constant/styles.constant';
import { TimePickerInput } from './TimePicker';
import { BsClock } from 'react-icons/bs';
import { FormCustomLabel } from '../../form/Form';
import { parseDate } from '@internationalized/date';

export interface DateTimePickerProps extends HTMLAttributes<HTMLDivElement> {
  onDateTimeChange?: (date: Date | undefined) => void;
  date?: Date | undefined;
}

export function DateTimePicker({
  className,
  onDateTimeChange,
  date = new Date(),
}: DateTimePickerProps) {
  const minuteRef = useRef<HTMLInputElement>(null);
  const hourRef = useRef<HTMLInputElement>(null);
  return (
    <div className={cn(styles.flexStart, 'gap-3', className)}>
      <DatePicker
        className='min-w-[250px]'
        radius='sm'
        aria-label='date input'
        onChange={(val) => {
          console.log(val);
          onDateTimeChange(
            new Date(
              val.year,
              val.month - 1,
              val.day,
              date.getHours(),
              date.getMinutes(),
            ),
          );
        }}
        value={parseDate(date.toISOString().split('T')[0])}
        showMonthAndYearPickers
      />
      <div className='flex items-end gap-2 -mt-5'>
        <div className='grid gap-1 text-center'>
          <FormCustomLabel
            htmlFor='hours'
            label='hours'
          />
          <TimePickerInput
            picker='hours'
            date={date}
            setDate={onDateTimeChange}
            onRightFocus={() => minuteRef.current?.focus()}
          />
        </div>
        <span className='text-md font-bold mb-2'>:</span>
        <div className='grid gap-1 text-center'>
          <FormCustomLabel
            htmlFor='minutes'
            label='minutes'
          />
          <TimePickerInput
            picker='minutes'
            date={date}
            setDate={onDateTimeChange}
            ref={minuteRef}
            onLeftFocus={() => hourRef.current?.focus()}
          />
        </div>
        <div className='flex h-10 items-center'>
          <BsClock className='ml-2 h-4 w-4' />
        </div>
      </div>
    </div>
  );
}
