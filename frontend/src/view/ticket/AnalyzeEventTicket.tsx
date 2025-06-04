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
import { FaCaretDown, FaCaretUp } from 'react-icons/fa6';
import { CartesianGrid, Line, LineChart, Pie, PieChart, XAxis } from 'recharts';

import './Ticket.css';
import EventTicketsTable from './EventTicketsTable';
import TicketSalesSpeedChart from './TicketSalesSpeedChart';
import dayjs from '@/src/utils/dayjs';

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
    color: 'rgb(0, 111, 238)',
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
            <p className='text-lg font-semibold flex justify-start items-start text-primary'>
              {data.overview.totalSoldTickets}
              <span className='ml-2 -mt-1'>
                <span className='!text-nm font-light text-green-500'>
                  {data.ticketGranularity.ticketTrendPercent > 0 && (
                    <>
                      {data.ticketGranularity.ticketTrendPercent} (%)
                      <FaCaretUp className='w-6 h-6 -mt-1 text-green-500 inline-block' />
                    </>
                  )}
                </span>
                <span className='!text-nm font-light text-red-500'>
                  {data.ticketGranularity.ticketTrendPercent < 0 && (
                    <>
                      {data.ticketGranularity.ticketTrendPercent} (%)
                      <FaCaretDown className='w-6 h-6 -mt-1 text-red-500 inline-block' />
                    </>
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
                    left: 24,
                    right: 12,
                    top: 10,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey='time'
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => dayjs(value).format('MM/DD')}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Line
                    dataKey='ticketsSold'
                    type='natural'
                    stroke='rgb(0, 111, 238)'
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
            <div>
              <p className='text-sm font-light text-primary flex justify-start items-start'>
                Gross: {data.overview.totalGrossRevenue}
                <span className='ml-2'>
                  <span className='!text-sm font-light text-green-500'>
                    {data.ticketGranularity.revenueTrendPercent > 0 && (
                      <>
                        {data.ticketGranularity.revenueTrendPercent} (%)
                        <FaCaretUp className='w-6 h-6 inline-block -mt-1 text-green-500' />
                      </>
                    )}
                  </span>
                  <span className='!text-sm font-light text-error-main'>
                    {data.ticketGranularity.revenueTrendPercent < 0 && (
                      <>
                        {data.ticketGranularity.revenueTrendPercent} (%)
                        <FaCaretDown className='w-6 h-6 inline-block -mt-1 text-red-500' />
                      </>
                    )}
                  </span>
                  <span>
                    {!data.ticketGranularity.revenueTrendPercent && '--'}
                  </span>
                </span>
              </p>
              <p className='text-sm font-light'>
                Net: {data.overview.totalGrossRevenue}
              </p>
            </div>
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
                    left: 24,
                    right: 12,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey='time'
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => dayjs(value).format('MM/DD')}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Line
                    dataKey='revenueGross'
                    type='natural'
                    stroke='rgb(0, 238, 36)'
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
              <p className='text-md font-semibold'>
                Best Selling{' '}
                <span className='text-sm font-light opacity-80'>
                  (Total {data?.overview?.totalTickets} tickets)
                </span>
              </p>

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
                            fill: '#27ae60',
                          },
                          {
                            type: 'available',
                            total: data.overview.totalAvailableTickets,
                            fill: 'rgb(0, 111, 238)',
                          },
                          {
                            type: 'canceled',
                            total: data.overview.totalCanceledTickets,
                            fill: '#e74c3c',
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
                  <p className='opacity-70 text-sm'>&nbsp;</p>
                </div>

                <div>
                  <div className='w-10 h-3 rounded-md bg-[#3498db]'></div>
                  <p className='text-md font-bold my-1'>
                    {data.overview.totalAvailableTickets}
                  </p>
                  <p className='text-sm opacity-70 font-light'>
                    Ticket Available
                  </p>
                  <p className='opacity-70 text-sm'>&nbsp;</p>
                </div>

                <div>
                  <div className='w-10 h-3 rounded-md bg-[#e74c3c]'></div>
                  <p className='text-md font-bold my-1'>
                    {data.overview.totalCanceledTickets}
                  </p>
                  <p className='text-sm opacity-70 font-light'>
                    Ticket Canceled
                  </p>
                  <p className='opacity-70 text-sm'>
                    (Cancel Rate: {data.overview.cancelRate + ' %'})
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='col-span-2 shadow-md p-5 pb-1 rounded-md bg-white'>
          {data.overview.tickets && data.overview.tickets.length && (
            <EventTicketsTable tickets={data.overview.tickets} />
          )}
        </div>

        <div className='col-span-2'>
          {data.analyzeAdvanced && (
            <TicketSalesSpeedChart
              data={data.analyzeAdvanced.salesSpeed}
              tickets={data.overview.tickets}
            />
          )}
        </div>
      </div>
    )
  );
}

export default AnalyzeEventTicket;
