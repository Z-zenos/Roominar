'use client';

import type { DataTableAdvancedFilterField } from '@/src/types/DataTable';
import { cn } from '@/src/utils/app.util';
import * as React from 'react';
import { DataTableViewOptions } from './DataTableViewOptions';
import type { Table } from '@tanstack/react-table';

interface DataTableAdvancedToolbarProps<TData>
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The table instance returned from useDataTable hook with pagination, sorting, filtering, etc.
   * @type Table<TData>
   */
  table: Table<TData>;

  /**
   * An array of filter field configurations for the data table.
   * @type DataTableAdvancedFilterField<TData>[]
   * @example
   * const filterFields = [
   *   {
   *     id: 'name',
   *     label: 'Name',
   *     type: 'text',
   *     placeholder: 'Filter by name...'
   *   },
   *   {
   *     id: 'status',
   *     label: 'Status',
   *     type: 'select',
   *     options: [
   *       { label: 'Active', value: 'active', count: 10 },
   *       { label: 'Inactive', value: 'inactive', count: 5 }
   *     ]
   *   }
   * ]
   */
  filterFields: DataTableAdvancedFilterField<TData>[];

  /**
   * Debounce time (ms) for filter updates to enhance performance during rapid input.
   * @default 300
   */
  debounceMs?: number;

  /**
   * Shallow mode keeps query states client-side, avoiding server calls.
   * Setting to `false` triggers a network request with the updated querystring.
   * @default true
   */
  shallow?: boolean;
}

export function DataTableAdvancedToolbar<TData>({
  table,
  children,
  className,
  ...props
}: DataTableAdvancedToolbarProps<TData>) {
  return (
    <div
      className={cn(
        'flex w-full items-center justify-between gap-2 overflow-auto p-1',
        className,
      )}
      {...props}
    >
      <div className='flex items-center gap-2'>Left Funct</div>
      <div className='flex items-center gap-2'>
        {children}
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
