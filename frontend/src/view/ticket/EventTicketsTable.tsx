import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/src/component/common/Table';
import type { AnalyzeEventTicketsOverviewTickets } from '@/src/lib/api/generated';

interface EventTicketsTableProps {
  tickets: any[];
}

function EventTicketsTable({ tickets }: EventTicketsTableProps) {
  return (
    <div>
      <Table>
        <TableCaption>Thống kê các loại vé trong sự kiện</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[250px]'>Loại</TableHead>
            <TableHead>Giá</TableHead>
            <TableHead>Đã bán</TableHead>
            <TableHead className='text-right'>Đã huỷ</TableHead>
            <TableHead>Còn lại</TableHead>
            <TableHead>Doanh thu thực tế</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map((th: AnalyzeEventTicketsOverviewTickets) => (
            <TableRow
              key={th.id}
              className='text-center'
            >
              <TableCell className='font-semibold text-sm text-left'>
                ({th.type}) - {th.name}
              </TableCell>
              <TableCell>{th.price}</TableCell>
              <TableCell>{th.soldQuantity}</TableCell>
              <TableCell>{th.canceledQuantity}</TableCell>
              <TableCell>{th.availableQuantity}</TableCell>

              <TableCell>{th.netRevenue}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default EventTicketsTable;
