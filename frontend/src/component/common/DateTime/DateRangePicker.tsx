'use client';

import * as React from 'react';

import { IoArrowDownOutline, IoArrowForward } from 'react-icons/io5';
import type { HTMLAttributes } from 'react';
import type { DateRange, SelectRangeEventHandler } from 'react-day-picker';
import { Popover, PopoverContent, PopoverTrigger } from '../Popover';
import Button from '../Button/Button';
import { Calendar } from './Calendar';
import useWindowDimensions from '@/src/hooks/useWindowDimension';
import { cn } from '@/src/utils/app.util';
import clsx from 'clsx';
import { TimePickerInput } from './TimePicker';
import { BsClock } from 'react-icons/bs';
import dayjs from '@/src/utils/dayjs';

export interface DateRangePickerProps extends HTMLAttributes<HTMLDivElement> {
  daterange?: DateRange;
  onDateRangeChange?: SelectRangeEventHandler;
  onDateRangeSelect?: () => void;
}

export function DateRangePicker({
  daterange,
  className,
  onDateRangeChange,
  onDateRangeSelect,
}: DateRangePickerProps) {
  const { width } = useWindowDimensions();
  const fromHourRef = React.useRef<HTMLInputElement>(null);
  const fromMinuteRef = React.useRef<HTMLInputElement>(null);
  const toHourRef = React.useRef<HTMLInputElement>(null);
  const toMinuteRef = React.useRef<HTMLInputElement>(null);
  const [fromTime, setFromTime] = React.useState<Date | undefined>(
    daterange?.from,
  );
  const [toTime, setToTime] = React.useState<Date | undefined>(daterange?.to);

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id='daterange'
            outline={true}
            className={cn(
              'justify-start text-left font-normal',
              !daterange && 'text-muted-foreground',
            )}
          >
            {daterange?.from ? (
              daterange.to ? (
                <span className='flex 1000px:flex-row flex-col 1000px:text-sm text-xs'>
                  <span className='block'>
                    {dayjs(daterange.from).format('HH:mm DD/MM/YYYY')}
                  </span>
                  {width < 1000 ? (
                    <IoArrowDownOutline className='inline w-3 h-3 mx-auto' />
                  ) : (
                    <IoArrowForward className='inline mx-2 w-5 h-5' />
                  )}

                  <span className='block'>
                    {dayjs(daterange.to).format('HH:mm DD/MM/YYYY')}
                  </span>
                </span>
              ) : (
                dayjs(daterange.from).format('HH:mm DD/MM/YYYY')
              )
            ) : (
              <span>Chọn ngày</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className='w-auto p-0'
          align='start'
        >
          <Calendar
            initialFocus
            mode='range'
            defaultMonth={daterange?.from}
            selected={daterange}
            onSelect={onDateRangeChange}
            numberOfMonths={2}
          />

          <div className='flex items-center justify-center gap-2 ml-3 mb-3'>
            From:
            <TimePickerInput
              picker='hours'
              date={fromTime}
              setDate={(date) => {
                setFromTime(date);
                const updatedFrom = dayjs(daterange.from)
                  .hour(dayjs(date).hour())
                  .minute(dayjs(date).minute())
                  .second(dayjs(date).second())
                  .millisecond(dayjs(date).millisecond())
                  .toDate();

                onDateRangeChange(
                  { ...daterange, from: updatedFrom },
                  undefined,
                  undefined,
                  undefined,
                );
              }}
              ref={fromHourRef}
              onRightFocus={() => fromMinuteRef.current?.focus()}
            />
            <TimePickerInput
              picker='minutes'
              date={fromTime}
              setDate={(date) => {
                setFromTime(date);
                const updatedFrom = dayjs(daterange.from)
                  .hour(dayjs(date).hour())
                  .minute(dayjs(date).minute())
                  .second(dayjs(date).second())
                  .millisecond(dayjs(date).millisecond())
                  .toDate();

                onDateRangeChange(
                  { ...daterange, from: updatedFrom },
                  undefined,
                  undefined,
                  undefined,
                );
              }}
              ref={fromMinuteRef}
              onLeftFocus={() => fromHourRef.current?.focus()}
              onRightFocus={() => toHourRef.current?.focus()}
            />
            To:
            <TimePickerInput
              picker='hours'
              date={toTime}
              setDate={(date) => {
                setToTime(date);
                const updatedTo = dayjs(daterange.to)
                  .hour(dayjs(date).hour())
                  .minute(dayjs(date).minute())
                  .second(dayjs(date).second())
                  .millisecond(dayjs(date).millisecond())
                  .toDate();

                onDateRangeChange(
                  { ...daterange, to: updatedTo },
                  undefined,
                  undefined,
                  undefined,
                );
              }}
              ref={toHourRef}
              onRightFocus={() => toMinuteRef.current?.focus()}
            />
            <TimePickerInput
              picker='minutes'
              date={toTime}
              setDate={(date) => {
                setToTime(date);
                const updatedTo = dayjs(daterange.to)
                  .hour(dayjs(date).hour())
                  .minute(dayjs(date).minute())
                  .second(dayjs(date).second())
                  .millisecond(dayjs(date).millisecond())
                  .toDate();

                onDateRangeChange(
                  { ...daterange, to: updatedTo },
                  undefined,
                  undefined,
                  undefined,
                );
              }}
              ref={toMinuteRef}
              onLeftFocus={() => toHourRef.current?.focus()}
            />
            <div className='flex h-10 items-center'>
              <BsClock className='ml-2 h-4 w-4' />
            </div>
          </div>

          {onDateRangeSelect && (
            <Button
              className={clsx(
                'text-sm font-semibold !text-dark-main 450px:mb-3 mb-1 bg-white border border-dark-main mx-auto',
              )}
              onClick={() => {
                onDateRangeSelect();
              }}
            >
              OK
            </Button>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
