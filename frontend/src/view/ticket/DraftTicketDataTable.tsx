'use client';

import { IoMdAddCircleOutline } from 'react-icons/io';
import { BsThreeDots } from 'react-icons/bs';
import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react';
import type { TicketItem } from '@/src/lib/api/generated';
import { TicketStatusCode } from '@/src/lib/api/generated';
import type { ChipProps } from '@nextui-org/react';
import { SheetTrigger } from '@/src/component/common/Sheet';
import { useListingTicketsOfEventQuery } from '@/src/api/event.api';

const statusColorMap: Record<string, ChipProps['color']> = {
  [TicketStatusCode.Available]: 'success',
  [TicketStatusCode.SoldOut]: 'danger',
  [TicketStatusCode.Canceled]: 'warning',
};

const TICKET_TABLE_COLUMNS = [
  { name: 'NAME', uid: 'name' },
  { name: 'PRICE', uid: 'price' },
  { name: 'QUANTITY', uid: 'quantity' },
  { name: 'STATUS', uid: 'status' },
  { name: 'TYPE', uid: 'type' },
  { name: 'ACTIONS', uid: 'actions' },
];

interface DraftTicketDataTableProps {
  eventId?: number;
  onAddTicketClick: () => void;
}

export default function DraftTicketDataTable({
  eventId,
  onAddTicketClick,
}: DraftTicketDataTableProps) {
  const {
    data: tickets,
    isFetching: isFetchingListingTicketsOfEvent,
    refetch: refetchListingTicketsOfEvent,
  } = useListingTicketsOfEventQuery({ eventId });

  const renderCell = (ticket: TicketItem, columnKey: string) => {
    const cellValue = columnKey !== 'actions' ? ticket[columnKey] : null;

    switch (columnKey) {
      case 'name':
        return (
          <div>
            <p className='text-nm font-semibold'>{ticket.name}</p>
            <p className='text-xs text-gray-600 font-ligth max-w-[200px] truncate'>
              {ticket.description}
            </p>
          </div>
        );
      case 'price':
        return <p>{cellValue ? cellValue : 'Free'}</p>;

      case 'quantity':
        return <p>{cellValue}</p>;
      case 'status':
        return (
          <Chip
            className='capitalize'
            color={statusColorMap[ticket.status]}
            size='sm'
            variant='flat'
          >
            {cellValue}
          </Chip>
        );

      case 'type':
        return <p>{cellValue}</p>;

      case 'actions':
        return (
          <div className='relative flex justify-end items-center gap-2'>
            <Dropdown>
              <DropdownTrigger>
                <Button
                  isIconOnly
                  size='sm'
                  variant='light'
                >
                  <BsThreeDots className='text-default-300' />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem>
                  <SheetTrigger onClick={onAddTicketClick}>Edit</SheetTrigger>
                </DropdownItem>
                <DropdownItem>Delete</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return cellValue;
    }
  };

  return (
    <Table
      aria-label='Example table with custom cells, pagination and sorting'
      isHeaderSticky
      classNames={{
        wrapper: 'max-h-[382px]',
      }}
      bottomContent={
        <div className='flex justify-end'>
          {/* === RIGHT SIDE BAR === */}
          <SheetTrigger
            onClick={onAddTicketClick}
            className='flex justify-center items-center gap-3 px-4 py-1 rounded-sm border-primary-300 hover:bg-primary hover:text-white hover:border-primary border transition-all text-sm'
          >
            Add ticket
            <IoMdAddCircleOutline className='text-inline w-5 h-5' />
          </SheetTrigger>
        </div>
      }
      removeWrapper
    >
      <TableHeader columns={TICKET_TABLE_COLUMNS}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.name === 'actions' ? 'center' : 'start'}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        emptyContent={'Not setup ticket yet'}
        items={tickets ?? []}
      >
        {(item) => (
          <TableRow key={item.price}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey as string)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
