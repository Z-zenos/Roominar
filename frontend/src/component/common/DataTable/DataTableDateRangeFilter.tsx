import type { Column } from '@tanstack/react-table';
import { CalendarIcon } from 'lucide-react';

import { Popover, PopoverContent, PopoverTrigger } from '../Popover';
import type { ButtonProps } from '../Button/ShardButton';
import { Button } from '../Button/ShardButton';

import { cn, toSnakeCase } from '@/src/utils/app.util';
import type { Option } from '@/src/types/DataTable';
import { parseAsString, useQueryStates } from 'nuqs';
import { useMemo } from 'react';
import { Calendar } from '../DateTime/Calendar';
import type { DateRange } from 'react-day-picker';
import dayjs from 'dayjs';

function parseDate(dateString: string | null) {
  if (!dateString) return undefined;
  const parsedDate = new Date(dateString);
  return isNaN(parsedDate.getTime()) ? undefined : parsedDate;
}

interface DataTableDateRangeFilterProps<TData, TValue>
  extends React.ComponentPropsWithoutRef<typeof PopoverContent> {
  column?: Column<TData, TValue>;
  title?: string;
  options: Option[];
  /**
   * The selected date range.
   * @default undefined
   * @type DateRange
   * @example { from: new Date(), to: new Date() }
   */
  defaultDateRange?: DateRange;

  /**
   * The placeholder text of the calendar trigger button.
   * @default "Pick a date"
   * @type string | undefined
   */
  placeholder?: string;

  /**
   * The variant of the calendar trigger button.
   * @default "outline"
   * @type "default" | "outline" | "secondary" | "ghost"
   */
  triggerVariant?: Exclude<ButtonProps['variant'], 'destructive' | 'link'>;

  /**
   * The size of the calendar trigger button.
   * @default "default"
   * @type "default" | "sm" | "lg"
   */
  triggerSize?: Exclude<ButtonProps['size'], 'icon'>;

  /**
   * The class name of the calendar trigger button.
   * @default undefined
   * @type string
   */
  triggerClassName?: string;

  /**
   * Controls whether query states are updated client-side only (default: true).
   * Setting to `false` triggers a network request to update the querystring.
   * @default true
   */
  shallow?: boolean;
}

export function DataTableDateRangeFilter<TData, TValue>({
  column,
  title,
  options,
  defaultDateRange,
  placeholder = 'Pick a date',
  triggerVariant = 'outline',
  triggerSize = 'default',
  triggerClassName,
  shallow = true,
  className,
  ...props
}: DataTableDateRangeFilterProps<TData, TValue>) {
  const { fromName, toName } = useMemo(() => {
    return {
      fromName: toSnakeCase(`${column.id}From`),
      toName: toSnakeCase(`${column.id}To`),
    };
  }, [column.id]);

  const date = column?.getFilterValue();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={triggerVariant}
          size={triggerSize}
          className={cn(
            'w-full justify-start gap-2 truncate text-left font-normal',
            !date && 'text-muted-foreground',
            triggerClassName,
          )}
        >
          <CalendarIcon className='size-4' />
          {date && date[fromName] ? (
            date[toName] ? (
              <>
                {dayjs(date[fromName]).format('YYYY-MM-DD')} -{' '}
                {dayjs(date[toName]).format('YYYY-MM-DD')}
              </>
            ) : (
              dayjs(date[fromName]).format('YYYY-MM-DD')
            )
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn('w-auto p-0', className)}
        {...props}
      >
        <Calendar
          initialFocus
          mode='range'
          defaultMonth={date ? date[fromName] : new Date()}
          selected={{
            from: date ? date[fromName] : undefined,
            to: date ? date[toName] : undefined,
          }}
          onSelect={(newDateRange) => {
            column?.setFilterValue({
              [fromName]: newDateRange?.from
                ? dayjs(defaultDateRange?.from).format('YYYY-MM-DD')
                : '',
              [toName]: newDateRange?.to
                ? dayjs(defaultDateRange?.to).format('YYYY-MM-DD')
                : '',
            });
          }}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
}
