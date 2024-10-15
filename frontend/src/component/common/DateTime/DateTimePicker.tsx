'use client';

import { useRef, type HTMLAttributes } from 'react';
import { cn } from '@/src/util/app.util';
import { DatePicker } from '@nextui-org/react';
import { styles } from '@/src/constant/styles.constant';
import { TimePickerInput } from './TimePicker';
import { Label } from '@radix-ui/react-label';
import { BsClock } from 'react-icons/bs';

export interface DateTimePickerProps extends HTMLAttributes<HTMLDivElement> {
  onDateTimeChange?: (date: Date | undefined) => void;
  date?: Date | undefined;
}

export function DateTimePicker({
  className,
  onDateTimeChange,
  date,
}: DateTimePickerProps) {
  const minuteRef = useRef<HTMLInputElement>(null);
  const hourRef = useRef<HTMLInputElement>(null);
  const secondRef = useRef<HTMLInputElement>(null);
  return (
    <div className={cn(styles.flexStart, 'gap-3', className)}>
      <DatePicker
        className='min-w-[250px]'
        radius='sm'
        aria-label='date input'
        onChange={(val) =>
          onDateTimeChange(new Date(val.year, val.month, val.day))
        }
      />
      <div className='flex items-end gap-2 -mt-5'>
        <div className='grid gap-1 text-center'>
          <Label
            htmlFor='hours'
            className='text-xs'
          >
            Hours
          </Label>
          <TimePickerInput
            picker='hours'
            date={date}
            setDate={onDateTimeChange}
            ref={hourRef}
            onRightFocus={() => minuteRef.current?.focus()}
          />
        </div>
        <span className='text-md font-bold mb-2'>:</span>
        <div className='grid gap-1 text-center'>
          <Label
            htmlFor='minutes'
            className='text-xs'
          >
            Minutes
          </Label>
          <TimePickerInput
            picker='minutes'
            date={date}
            setDate={onDateTimeChange}
            ref={minuteRef}
            onLeftFocus={() => hourRef.current?.focus()}
            onRightFocus={() => secondRef.current?.focus()}
          />
        </div>
        <div className='flex h-10 items-center'>
          <BsClock className='ml-2 h-4 w-4' />
        </div>
      </div>
    </div>
  );
}
