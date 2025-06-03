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
        <TableCaption>An analyzing list of event tickets.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[250px]'>Ticket Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Sold</TableHead>
            <TableHead className='text-right'>Canceled</TableHead>
            <TableHead>Available</TableHead>
            <TableHead>Net Revenue</TableHead>
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
        {/* <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>
                Total
              </TableCell>
              <TableCell className='text-right'>
                $2,500.00
              </TableCell>
            </TableRow>
          </TableFooter> */}
      </Table>
    </div>
  );
}

export default EventTicketsTable;
