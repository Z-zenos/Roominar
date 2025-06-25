'use client';

import { IoMdAddCircleOutline } from 'react-icons/io';
import {
  Chip,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from '@nextui-org/react';
import type { TicketItem } from '@/src/lib/api/generated';
import { TicketStatusCode } from '@/src/lib/api/generated';
import type { ChipProps } from '@nextui-org/react';
import { SheetTrigger } from '@/src/component/common/Sheet';
import Spinner from '@/src/component/common/Loader/Spinner';
import { useCallback, useState } from 'react';
import { PenLineIcon, Trash2Icon } from 'lucide-react';
import ConfirmDialog from '@/src/component/common/Dialog/ConfirmDialog';
import { useDeleteTicketMutation } from '@/src/api/ticket.api';
import useFormatMoney from '@/src/hooks/useFormatMoney';
import { useTranslations } from 'next-intl';
import { handleApiError } from '@/src/utils/app.util';

const statusColorMap: Record<string, ChipProps['color']> = {
  [TicketStatusCode.Available]: 'success',
  [TicketStatusCode.SoldOut]: 'danger',
  [TicketStatusCode.Canceled]: 'warning',
};

const TICKET_TABLE_COLUMNS = [
  { name: 'Tên', uid: 'name' },
  { name: 'Giá', uid: 'price' },
  { name: 'Số lượng', uid: 'quantity' },
  { name: 'Hình thức', uid: 'status' },
  { name: 'Loại', uid: 'type' },
  { name: 'Hành động', uid: 'actions' },
];

interface DraftTicketDataTableProps {
  tickets?: TicketItem[];
  isFetchingListingTicketsOfEvent?: boolean;
  onOpenCreateTicketForm?: () => void;
  onOpenUpdateTicketForm?: (ticketId: number) => void;
  onDeleteTicket?: () => void;
}

export default function DraftTicketDataTable({
  tickets,
  isFetchingListingTicketsOfEvent,
  onOpenCreateTicketForm,
  onOpenUpdateTicketForm,
  onDeleteTicket,
}: DraftTicketDataTableProps) {
  const t = useTranslations('code');
  const formatMoney = useFormatMoney();

  const [selectedTicket, setSelectedTicket] = useState<TicketItem | null>(null);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const { trigger: deleteTicket, isMutating: isDeletingTicket } =
    useDeleteTicketMutation({
      onSuccess() {
        onDeleteTicket?.();
      },
      onError: handleApiError,
    });

  const renderCell = useCallback((ticket: TicketItem, columnKey: string) => {
    const cellValue = columnKey !== 'actions' ? ticket[columnKey] : null;

    switch (columnKey) {
      case 'name':
        return (
          <div>
            <p className='text-sm font-medium'>{ticket.name}</p>
            <p className='text-xs text-gray-600 font-ligth max-w-[200px] truncate'>
              {ticket.description}
            </p>
          </div>
        );
      case 'price':
        return <p>{cellValue ? formatMoney(cellValue) : 0}</p>;

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
            {ticket.deliveryMethod}
          </Chip>
        );

      case 'type':
        return <p>{t(`ticket.type.${cellValue}`)}</p>;

      case 'actions':
        return (
          <div className='relative flex justify-start items-center gap-2'>
            <SheetTrigger onClick={() => onOpenUpdateTicketForm?.(ticket.id)}>
              <PenLineIcon
                className='text-yellow-500'
                size={16}
              />
            </SheetTrigger>
            <Trash2Icon
              className='text-red-500 cursor-pointer'
              size={16}
              onClick={() => {
                setSelectedTicket(ticket);
                onOpen();
              }}
            />
          </div>
        );
      default:
        return cellValue;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            onClick={onOpenCreateTicketForm}
            className={`flex justify-center items-center gap-3 px-4 py-1 rounded-sm
              border-primary-300 hover:bg-primary hover:text-white hover:border-primary
              border transition-all text-sm`}
          >
            Tạo vé
            <IoMdAddCircleOutline className='text-inline w-5 h-5' />
          </SheetTrigger>
          <ConfirmDialog
            content={
              <p>
                Bạn có chắc muốn xóa vé :
                <span className='text-danger-500 underline ml-1'>
                  {selectedTicket?.name}
                </span>
                ?
              </p>
            }
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            onConfirm={() => {
              deleteTicket({
                ticketId: selectedTicket?.id ?? 0,
              });
              onDeleteTicket?.();
              onClose();
            }}
            confirmLabel='Xoá'
            isLoading={isDeletingTicket}
          />
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
        isLoading={isFetchingListingTicketsOfEvent}
        loadingContent={<Spinner />}
      >
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey as string)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
