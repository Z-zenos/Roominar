'use client';

import { Card, CardContent } from '@/src/component/common/Card/Card';
import type {
  AnalyzeEventTicketsOverviewTickets,
  SalesSpeedStat,
} from '@/src/lib/api/generated';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface TicketSalesSpeedChartProps {
  data: SalesSpeedStat[];
  tickets: AnalyzeEventTicketsOverviewTickets[];
}

export default function TicketSalesSpeedChart({
  data,
  tickets,
}: TicketSalesSpeedChartProps) {
  return (
    <Card className='w-full'>
      <CardContent className='h-[300px]'>
        <h2 className='text-md font-semibold my-4'>Ticket Sales Speed</h2>
        <ResponsiveContainer
          width='100%'
          height='100%'
        >
          <BarChart
            layout='vertical'
            data={data.map((item) => ({
              ...item,
              ticketId:
                tickets.find((ticket) => ticket.id === item.ticketId)?.name ||
                'Unknown Ticket',
            }))}
            margin={{ top: 0, right: 30, left: 20, bottom: 30 }}
          >
            <XAxis
              type='number'
              className='text-xs'
            />
            <YAxis
              dataKey='ticketId'
              type='category'
              className='max-w-10 truncate [&_.recharts-cartesian-axis-ticks]:max-w-10 [&_.recharts-cartesian-axis-tick]:text-xs'
            />
            <Tooltip
              labelClassName='text-sm'
              wrapperClassName='text-xs'
            />
            <Legend className='text-sm' />
            <Bar
              dataKey='in1h'
              stackId='a'
              fill='#8884d8'
              name='In 1h'
            />
            <Bar
              dataKey='in1d'
              stackId='a'
              fill='#82ca9d'
              name='In 1d'
            />
            <Bar
              dataKey='in1w'
              stackId='a'
              fill='#ffc658'
              name='In 1w'
            />
            <Bar
              dataKey='total'
              stackId='a'
              fill='#ff7f50'
              name='Total'
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
