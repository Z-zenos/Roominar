'use client';

import * as React from 'react';
import type { Table } from '@tanstack/react-table';
import { X } from 'lucide-react';
import type { DataTableFilterField } from '@/src/types/DataTable';
import { cn } from '@/src/utils/app.util';
import TextInput from '../Input/TextInput';
import { DataTableFacetedFilter } from './DataTableFacetedFilter';
import { Button } from '../Button/ShardButton';
import { DataTableDateRangeFilter } from './DataTableDateRangeFilter';

interface DataTableToolbarProps<TData>
  extends React.HTMLAttributes<HTMLDivElement> {
  table: Table<TData>;
  /**
   * An array of filter field configurations for the data table.
   * When options are provided, a faceted filter is rendered.
   * Otherwise, a search filter is rendered.
   *
   * @example
   * const filterFields = [
   *   {
   *     id: 'name',
   *     label: 'Name',
   *     placeholder: 'Filter by name...'
   *   },
   *   {
   *     id: 'status',
   *     label: 'Status',
   *     options: [
   *       { label: 'Active', value: 'active', icon: ActiveIcon, count: 10 },
   *       { label: 'Inactive', value: 'inactive', icon: InactiveIcon, count: 5 }
   *     ]
   *   }
   * ]
   */
  filterFields?: DataTableFilterField<TData>[];
}

export function DataTableToolbar<TData>({
  table,
  filterFields = [],
  children,
  className,
  ...props
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  // // Memoize computation of filterTextFields and filterMultiSelectFields
  const { filterTextFields, filterMultiSelectFields, filterDateRangeFields } =
    React.useMemo(() => {
      return {
        filterTextFields: filterFields.filter((field) => field.type === 'text'),
        filterMultiSelectFields: filterFields.filter(
          (field) => field.type === 'multiSelect',
        ),
        filterDateRangeFields: filterFields.filter(
          (field) => field.type === 'dateRange',
        ),
      };
    }, [filterFields]);

  return (
    <div
      className={cn(
        'flex w-full items-center justify-between gap-2 overflow-auto p-1',
        className,
      )}
      {...props}
    >
      <div className='flex flex-1 items-center gap-2'>
        {filterTextFields.length > 0 &&
          filterTextFields.map(
            (column) =>
              table.getColumn(column.id ? String(column.id) : '') && (
                <TextInput
                  key={String(column.id)}
                  placeholder={column.placeholder}
                  value={
                    (table
                      .getColumn(String(column.id))
                      ?.getFilterValue() as string) ?? ''
                  }
                  onChange={(event) =>
                    table
                      .getColumn(String(column.id))
                      ?.setFilterValue(event.target.value)
                  }
                  className='h-8 w-40 lg:w-64'
                />
              ),
          )}
        {filterMultiSelectFields.length > 0 &&
          filterMultiSelectFields.map(
            (column) =>
              table.getColumn(column.id ? String(column.id) : '') && (
                <DataTableFacetedFilter
                  key={String(column.id)}
                  column={table.getColumn(column.id ? String(column.id) : '')}
                  title={column.label}
                  options={column.options ?? []}
                />
              ),
          )}

        {filterDateRangeFields.length > 0 &&
          filterDateRangeFields.map(
            (column) =>
              table.getColumn(column.id ? String(column.id) : '') && (
                <DataTableDateRangeFilter
                  key={String(column.id)}
                  column={table.getColumn(column.id ? String(column.id) : '')}
                  title={column.label}
                  options={column.options ?? []}
                  triggerClassName='ml-auto w-56 sm:w-60'
                  align='end'
                  shallow={false}
                />
              ),
          )}

        {isFiltered && (
          <Button
            aria-label='Reset filters'
            variant='ghost'
            className='h-8 px-2 lg:px-3'
            onClick={() => table.resetColumnFilters()}
          >
            Reset
            <X
              className='ml-2 size-4'
              aria-hidden='true'
            />
          </Button>
        )}
      </div>
      <div className='flex items-center gap-2'>{children}</div>
    </div>
  );
}
