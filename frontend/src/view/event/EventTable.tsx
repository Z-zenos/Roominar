'use client';

import { DataTable } from '@/src/component/common/DataTable/DataTable';
import { DataTableToolbar } from '@/src/component/common/DataTable/DataTableToolbar';
import type {
  DataTableFilterField,
  DataTableRowAction,
} from '@/src/types/DataTable';
import { optionify } from '@/src/utils/app.util';
import * as React from 'react';
import { getColumns } from './EventTableColumns';
import { EventStatusCode, EventTimeStatusCode } from '@/src/lib/api/generated';
import { useDataTable } from '@/src/hooks/useDataTable';
import { useListingOrganizationEventsQuery } from '@/src/api/event.api';
import { useSearchParams } from 'next/navigation';
import queryString from 'query-string';

export function EventTable() {
  const searchParams = useSearchParams();
  const { data: organizationEventsData } = useListingOrganizationEventsQuery({
    ...queryString.parse(searchParams.toString(), { arrayFormat: 'bracket' }),
  });

  const [rowAction, setRowAction] =
    React.useState<DataTableRowAction<any> | null>(null);

  const columns = React.useMemo(
    () => getColumns({ setRowAction }),
    [setRowAction],
  );

  const filterFields: DataTableFilterField<any>[] = [
    {
      id: 'keyword',
      label: 'Name',
      placeholder: 'Filter names...',
    },
    {
      id: 'event_status[]',
      label: 'Status',
      options: optionify(EventStatusCode),
    },

    {
      id: 'time_status[]',
      label: 'Timeline Status',
      options: optionify(EventTimeStatusCode),
    },
  ];

  const { table } = useDataTable({
    data: organizationEventsData?.data ?? [],
    columns,
    pageCount: organizationEventsData
      ? Math.ceil(organizationEventsData.total / organizationEventsData.perPage)
      : 0,
    filterFields,
    enableAdvancedFilter: false,
    initialState: {
      sorting: [{ id: 'startAt', desc: true }],
      columnPinning: { right: ['actions'] },
      columnVisibility: {
        'time_status[]': false,
      },
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
        <DataTableToolbar
          table={table}
          filterFields={filterFields}
        >
          {/* <TasksTableToolbarActions table={table} /> */}
        </DataTableToolbar>
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
