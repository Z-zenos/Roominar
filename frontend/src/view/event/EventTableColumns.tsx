'use client';

import { Button } from '@/src/component/common/Button/ShardButton';
import { DataTableColumnHeader } from '@/src/component/common/DataTable/DataTableColumnHeader';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/src/component/common/DropdownMenu';
import type { ListingOrganizationEventsItem } from '@/src/lib/api/generated';
import type { DataTableRowAction } from '@/src/types/DataTable';
import { formatTableDataDate, getStatusIcon } from '@/src/utils/app.util';
import { Checkbox } from '@nextui-org/react';
import type { ColumnDef } from '@tanstack/react-table';
import { Ellipsis } from 'lucide-react';
import * as React from 'react';
import { Image } from '@nextui-org/react';

interface GetColumnsProps {
  setRowAction: React.Dispatch<
    React.SetStateAction<DataTableRowAction<ListingOrganizationEventsItem> | null>
  >;
}

export function getColumns({
  setRowAction,
}: GetColumnsProps): ColumnDef<ListingOrganizationEventsItem>[] {
  return [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            // table?.getIsAllPageRowsSelected() ||
            // (table?.getIsSomePageRowsSelected() && 'indeterminate')
            true
          }
          onChange={(value) => {
            return true;
            // return table?.toggleAllPageRowsSelected(!!value)
          }}
          aria-label='Select all'
          radius='sm'
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onChange={(value) => row.toggleSelected(!!value)}
          aria-label='Select row'
          radius='sm'
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title='Name'
        />
      ),
      cell: ({ row }) => {
        return (
          <div className='flex items-center justify-start gap-2'>
            <Image
              src={
                row.original.coverImageUrl ??
                'https://cdn-icons-png.flaticon.com/128/3175/3175209.png'
              }
              width={160}
              height={120}
              alt='event cover image'
              className='min-w-[160px]'
            />
            <span className='max-w-[31.25rem] font-medium'>
              {row.getValue('name')}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title='Status'
        />
      ),
      cell: ({ row }) => {
        const status = row.getValue('status');

        if (!status) return null;

        const Icon = getStatusIcon(status);

        return (
          <div className='flex w-[6.25rem] items-center'>
            <Icon
              className='mr-2 size-4 text-muted-foreground'
              aria-hidden='true'
            />
            <span>{status as any}</span>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return Array.isArray(value) && value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: 'applyState',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title='Archived'
        />
      ),
      cell: ({ row }) => (
        <span>
          {row.original.appliedNumber ?? 0} / {row.original.applicationNumber}{' '}
        </span>
      ),
    },
    {
      accessorKey: 'startAt',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title='Start At'
        />
      ),
      cell: ({ row }) => formatTableDataDate(row.getValue('startAt') as Date),
    },
    {
      id: 'actions',
      cell: function Cell({ row }) {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                aria-label='Open menu'
                variant='ghost'
                className='flex size-8 p-0 data-[state=open]:bg-muted'
              >
                <Ellipsis
                  className='size-4'
                  aria-hidden='true'
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align='end'
              className='w-40'
            >
              <DropdownMenuItem
                onSelect={() => setRowAction({ row, type: 'update' })}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Labels</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup
                    value={row.original.slug}
                    // onValueChange={(value) => {
                    //   startUpdateTransition(() => {
                    //     toast.promise(
                    //       updateTask({
                    //         id: row.original.id,
                    //         label: value as Task['label'],
                    //       }),
                    //       {
                    //         loading: 'Updating...',
                    //         success: 'Label updated',
                    //         error: (err) => getErrorMessage(err),
                    //       },
                    //     );
                    //   });
                    // }}
                  >
                    {/* {tasks.label.enumValues.map((label) => (
                      <DropdownMenuRadioItem
                        key={label}
                        value={label}
                        className='capitalize'
                        disabled={isUpdatePending}
                      >
                        {label}
                      </DropdownMenuRadioItem>
                    ))} */}
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => setRowAction({ row, type: 'delete' })}
              >
                Delete
                <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      size: 40,
    },
  ];
}
