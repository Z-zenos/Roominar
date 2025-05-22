'use client';

import { useAnalyzeEventTicketsQuery } from '@/src/api/organization.api';
import type { ChartConfig } from '@/src/component/common/Chart/Chart';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/src/component/common/Chart/Chart';
import Nodata from '@/src/component/common/Nodata';
import { Tabs } from '@/src/component/common/Tabs';
import { styles } from '@/src/constants/styles.constant';
import clsx from 'clsx';
import { FaCaretUp } from 'react-icons/fa6';
import { CartesianGrid, Line, LineChart, Pie, PieChart, XAxis } from 'recharts';

interface AnalyzeEventTicketProps {
  slug: string;
}

const soldTicketsChartConfig = {
  ticketsSold: {
    label: 'Sold',
    color: '#27ae60',
  },
};

const revenueChartConfig = {
  revenueGross: {
    label: 'Revenue',
    color: '#3498db',
  },
};

const overviewChartConfig = {
  total: {
    label: 'Total',
  },
  sold: {
    label: 'Sold',
    color: '#27ae60',
  },
  available: {
    label: 'Available',
    color: '#3498db',
  },
  canceled: {
    label: 'Canceled',
    color: '#e74c3c',
  },
} as ChartConfig;

function AnalyzeEventTicket({ slug }: AnalyzeEventTicketProps) {
  const { data } = useAnalyzeEventTicketsQuery({
    slug: slug,
    granularity: 'daily',
  });

  return (
    data && (
      <div className='grid grid-cols-2 gap-4 p-4'>
        <div className='col-span-1 shadow-md p-5 rounded-md bg-white'>
          <div className={clsx(styles.between)}>
            <p className='text-lg font-semibold'>
              {data.overview.totalSoldTickets}
              <span className='ml-2'>
                <span>
                  {data.ticketGranularity.ticketTrendPercent > 0 && (
                    <FaCaretUp className='w-6 h-6 text-green-500' />
                  )}
                </span>
                <span>
                  {data.ticketGranularity.ticketTrendPercent < 0 && (
                    <FaCaretUp className='w-6 h-6 text-red-500' />
                  )}
                </span>
                <span>
                  {!data.ticketGranularity.ticketTrendPercent && '--'}
                </span>
              </span>
            </p>
            <p className='text-nm font-light'>Tickets</p>
          </div>
          {data.ticketGranularity &&
          data.ticketGranularity.ticketStatsByTime.map(
            (item) => item.ticketsSold,
          ).length > 0 ? (
            <div className='w-full'>
              <ChartContainer config={soldTicketsChartConfig}>
                <LineChart
                  accessibilityLayer
                  data={data.ticketGranularity.ticketStatsByTime.map(
                    (item) => ({
                      time: item.time,
                      ticketsSold: item.ticketsSold,
                    }),
                  )}
                  margin={{
                    left: 12,
                    right: 12,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey='time'
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Line
                    dataKey='ticketSolds'
                    type='natural'
                    stroke='var(--color-desktop)'
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ChartContainer>
            </div>
          ) : (
            <Nodata />
          )}
        </div>
        <div className='col-span-1 shadow-md p-5 rounded-md bg-white'>
          <div className={clsx(styles.between)}>
            <p className='text-lg font-semibold'>
              {data.overview.totalGrossRevenue}
              <span className='ml-2'>
                <span>
                  {data.ticketGranularity.revenueTrendPercent > 0 && (
                    <FaCaretUp className='w-6 h-6 text-green-500' />
                  )}
                </span>
                <span>
                  {data.ticketGranularity.revenueTrendPercent < 0 && (
                    <FaCaretUp className='w-6 h-6 text-red-500' />
                  )}
                </span>
                <span>
                  {!data.ticketGranularity.revenueTrendPercent && '--'}
                </span>
              </span>
            </p>
            <p className='text-nm font-light'>Revenue</p>
          </div>
          {data.ticketGranularity &&
          data.ticketGranularity.ticketStatsByTime.map(
            (item) => item.revenueGross,
          ).length > 0 ? (
            <div className='w-full'>
              <ChartContainer config={revenueChartConfig}>
                <LineChart
                  accessibilityLayer
                  data={data.ticketGranularity.ticketStatsByTime.map(
                    (item) => ({
                      time: item.time,
                      revenueGross: item.revenueGross,
                    }),
                  )}
                  margin={{
                    left: 12,
                    right: 12,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey='time'
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Line
                    dataKey='revenueGross'
                    type='natural'
                    stroke='var(--color-desktop)'
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ChartContainer>
            </div>
          ) : (
            <Nodata />
          )}
        </div>
        <div className='col-span-2 shadow-md p-5 pb-1 rounded-md bg-white'>
          <div className='grid grid-cols-2 gap-4 mb-4'>
            <div>
              <p className='text-lg font-semibold'>Best Selling</p>

              {data.overview ? (
                <div>
                  <ChartContainer
                    config={overviewChartConfig}
                    className='mx-auto aspect-square max-h-[250px]'
                  >
                    <PieChart>
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                      />
                      <Pie
                        data={[
                          {
                            type: 'sold',
                            total: data.overview.totalSoldTickets,
                          },
                          {
                            type: 'available',
                            total: data.overview.totalAvailableTickets,
                          },
                          {
                            type: 'canceled',
                            total: data.overview.totalCanceledTickets,
                          },
                        ]}
                        dataKey='total'
                        nameKey='type'
                        innerRadius={60}
                      />
                    </PieChart>
                  </ChartContainer>
                </div>
              ) : (
                <Nodata />
              )}
            </div>
            <div className='flex flex-col justify-between items-end'>
              <Tabs
                defaultValue='daily'
                tabs={[
                  { value: 'daily', content: '' },
                  { value: 'weekly', content: 'Weekly' },
                  { value: 'monthly', content: 'Monthly' },
                ]}
                className='450px:px-[10%] px-[5%]'
                tabClassName='max-w-[400px] mx-auto'
              />

              <div className={clsx(styles.flexStart, 'gap-4')}>
                <div>
                  <div className='w-10 h-3 rounded-md bg-[#27ae60]'></div>
                  <p className='text-md font-bold my-1'>
                    {data.overview.totalSoldTickets}
                  </p>
                  <p className='text-sm opacity-70 font-light'>Ticket Sold</p>
                </div>

                <div>
                  <div className='w-10 h-3 rounded-md bg-[#3498db]'></div>
                  <p className='text-md font-bold my-1'>
                    {data.overview.totalAvailableTickets}
                  </p>
                  <p className='text-sm opacity-70 font-light'>
                    Ticket Available
                  </p>
                </div>

                <div>
                  <div className='w-10 h-3 rounded-md bg-[#e74c3c]'></div>
                  <p className='text-md font-bold my-1'>
                    {data.overview.totalCanceledTickets}
                  </p>
                  <p className='text-sm opacity-70 font-light'>
                    Ticket Canceled
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
}

export default AnalyzeEventTicket;
