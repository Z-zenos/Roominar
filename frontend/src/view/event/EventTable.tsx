'use client';

import { DataTable } from '@/src/component/common/DataTable/DataTable';
import { DataTableAdvancedToolbar } from '@/src/component/common/DataTable/DataTableAdvancedToolbar';
import { DataTableToolbar } from '@/src/component/common/DataTable/DataTableToolbar';
import type {
  DataTableAdvancedFilterField,
  DataTableFilterField,
  DataTableRowAction,
} from '@/src/types/DataTable';
import {
  getPriorityIcon,
  getStatusIcon,
  toSentenceCase,
} from '@/src/utils/app.util';
import * as React from 'react';
import { getColumns } from './EventTableColumns';
import { EventStatusCode } from '@/src/lib/api/generated';
import { useDataTable } from '@/src/hooks/useDataTable';
import { useListingOrganizationEventsQuery } from '@/src/api/event.api';

export function EventTable() {
  const [{ data, pageCount }, statusCounts, priorityCounts] = [
    { data: [], pageCount: 0 },
    undefined,
    undefined,
  ];

  const { data: organizationEventsData } = useListingOrganizationEventsQuery();

  const [rowAction, setRowAction] =
    React.useState<DataTableRowAction<any> | null>(null);

  const columns = React.useMemo(
    () => getColumns({ setRowAction }),
    [setRowAction],
  );

  /**
   * This component can render either a faceted filter or a search filter based on the `options` prop.
   *
   * @prop options - An array of objects, each representing a filter option. If provided, a faceted filter is rendered. If not, a search filter is rendered.
   *
   * Each `option` object has the following properties:
   * @prop {string} label - The label for the filter option.
   * @prop {string} value - The value for the filter option.
   * @prop {React.ReactNode} [icon] - An optional icon to display next to the label.
   * @prop {boolean} [withCount] - An optional boolean to display the count of the filter option.
   */
  const filterFields: DataTableFilterField<any>[] = [
    {
      id: 'name',
      label: 'Name',
      placeholder: 'Filter names...',
    },
    {
      id: 'status',
      label: 'Status',
      options: Object.keys(EventStatusCode).map((status) => ({
        label: toSentenceCase(status),
        value: status,
        icon: getStatusIcon(status),
        count: statusCounts ? statusCounts[status] : 0,
      })),
    },
    // {
    //   id: 'priority',
    //   label: 'Priority',
    //   options: tasks.priority.enumValues.map((priority) => ({
    //     label: toSentenceCase(priority),
    //     value: priority,
    //     icon: getPriorityIcon(priority),
    //     count: priorityCounts[priority],
    //   })),
    // },
  ];

  /**
   * Advanced filter fields for the data table.
   * These fields provide more complex filtering options compared to the regular filterFields.
   *
   * Key differences from regular filterFields:
   * 1. More field types: Includes 'text', 'multi-select', 'date', and 'boolean'.
   * 2. Enhanced flexibility: Allows for more precise and varied filtering options.
   * 3. Used with DataTableAdvancedToolbar: Enables a more sophisticated filtering UI.
   * 4. Date and boolean types: Adds support for filtering by date ranges and boolean values.
   */
  const advancedFilterFields: DataTableAdvancedFilterField<any>[] = [
    {
      id: 'name',
      label: 'Name',
      type: 'text',
    },
    {
      id: 'status',
      label: 'Status',
      type: 'multi-select',
      options: Object.keys(EventStatusCode).map((status) => ({
        label: toSentenceCase(status),
        value: status,
        icon: getStatusIcon(status),
        count: statusCounts ? statusCounts[status] : 0,
      })),
    },
    // {
    //   id: 'priority',
    //   label: 'Priority',
    //   type: 'multi-select',
    //   options: tasks.priority.enumValues.map((priority) => ({
    //     label: toSentenceCase(priority),
    //     value: priority,
    //     icon: getPriorityIcon(priority),
    //     count: priorityCounts[priority],
    //   })),
    // },
    {
      id: 'createdAt',
      label: 'Created at',
      type: 'date',
    },
  ];

  const enableAdvancedTable = false;
  // const enableFloatingBar = true;

  const { table } = useDataTable({
    data: organizationEventsData?.data ?? [],
    columns,
    pageCount: organizationEventsData?.perPage,
    filterFields,
    enableAdvancedFilter: enableAdvancedTable,
    initialState: {
      sorting: [{ id: 'createdAt', desc: true }],
      columnPinning: { right: ['actions'] },
    },
    getRowId: (originalRow, index) => `${originalRow.id}-${index}`,
    shallow: false,
    clearOnDefault: true,
  });

  return (
    <>
      <DataTable
        table={table}
        // floatingBar={
        //   enableFloatingBar ? <TasksTableFloatingBar table={table} /> : null
        // }
      >
        {enableAdvancedTable ? (
          <DataTableAdvancedToolbar
            table={table}
            filterFields={advancedFilterFields}
            shallow={false}
          >
            {/* <TasksTableToolbarActions table={table} /> */}
          </DataTableAdvancedToolbar>
        ) : (
          <DataTableToolbar
            table={table}
            filterFields={filterFields}
          >
            {/* <TasksTableToolbarActions table={table} /> */}
          </DataTableToolbar>
        )}
      </DataTable>
      {/* <UpdateTaskSheet
        open={rowAction?.type === 'update'}
        onOpenChange={() => setRowAction(null)}
        task={rowAction?.row.original ?? null}
      />
      <DeleteTasksDialog
        open={rowAction?.type === 'delete'}
        onOpenChange={() => setRowAction(null)}
        tasks={rowAction?.row.original ? [rowAction?.row.original] : []}
        showTrigger={false}
        onSuccess={() => rowAction?.row.toggleSelected(false)}
      /> */}
    </>
  );
}
