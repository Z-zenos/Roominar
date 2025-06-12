'use client';

import * as React from 'react';
import type { ChartConfig } from './Chart';
import {
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
} from './Chart';
import { Card, CardContent, CardHeader, CardTitle } from '../Card/Card';
import { LabelList, Pie, PieChart } from 'recharts';
import {
  TicketTypeCode,
  type OrganizationsApiGetTicketStatsRequest,
} from '@/src/lib/api/generated';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useGetTicketStatsQuery } from '@/src/api/organization.api';
import queryString from 'query-string';
import { Form, FormCustomLabel, FormSelect } from '../../form/Form';
import { optionify } from '@/src/utils/app.util';
import { useListingEventOptionsQuery } from '@/src/api/event.api';
import Nodata from '../Nodata';
import ElementLoader from '../Loader/ElementLoader';
import useFormatMoney from '@/src/hooks/useFormatMoney';

const TICKET_STATS_STORAGE_KEY = 'ticketStats';

export function TicketStatsChart() {
  const formatMoney = useFormatMoney();

  const [filters, setFilters] = useState<OrganizationsApiGetTicketStatsRequest>(
    {},
  );

  const {
    data: ticketStats,
    refetch,
    isLoading,
  } = useGetTicketStatsQuery({
    ...queryString.parse(
      queryString.stringify(filters, { arrayFormat: 'bracket' }),
      { arrayFormat: 'bracket' },
    ),
  });

  const { data: eventOptions } = useListingEventOptionsQuery();

  useEffect(() => {
    const storedFilters = localStorage.getItem(TICKET_STATS_STORAGE_KEY);
    if (storedFilters) {
      setFilters(JSON.parse(storedFilters));
    }
  }, []);

  const chartData = [
    {
      type: 'sold',
      total: ticketStats?.totalSoldTickets,
      percentage: ticketStats?.soldPercentage,
      fill: '#ff5c00',
      label: 'Đã bán',
    },
    {
      type: 'remain',
      total: ticketStats?.totalRemainingTickets,
      percentage: ticketStats?.remainingPercentage,
      fill: '#fcb400',
      label: 'Còn lại',
    },
    // {
    //   type: 'reserved',
    //   total: ticketStats.totalReservedTickets,
    //   percentage: ticketStats.reservedPercentage,
    //   fill: '#4CAF50',
    // },
  ];
  const chartConfig = {
    percentage: {
      label: 'Tổng cộng',
    },
    sold: {
      label: 'Đã bán',
      color: '#FFC107',
    },
    remaining: {
      label: 'Còn lại',
      color: '#fcb400',
    },
    reserved: {
      label: 'Đặt trước',
      color: '#ff5c00',
    },
  } as ChartConfig;

  const form = useForm<OrganizationsApiGetTicketStatsRequest>({
    mode: 'all',
    defaultValues: {
      ticketStatus: undefined,
      ticketType: undefined,
      startDate: undefined,
      endDate: undefined,
      eventId: filters.eventId ?? 0,
    },
  });

  useEffect(() => {
    const subscription = form.watch((value) => {
      localStorage.setItem(TICKET_STATS_STORAGE_KEY, JSON.stringify(value));
      setFilters(value);
      refetch();
    });
    return () => subscription.unsubscribe();
  }, [form, form.watch, refetch]);

  return (
    <Card className='my-2'>
      <Form {...form}>
        <form className='flex flex-col'>
          <CardHeader className='items-center pb-0'>
            {ticketStats && (
              <CardTitle className='font-medium'>
                Thống kê vé ({ticketStats.totalTickets}) - Doanh thu:{' '}
                {formatMoney(ticketStats.totalRevenue)}
              </CardTitle>
            )}
          </CardHeader>
          {ticketStats && ticketStats.totalTickets > 0 && (
            <div className='grid grid-cols-6'>
              <CardContent className='col-span-4 pb-0'>
                <ChartContainer
                  config={chartConfig}
                  className='aspect-square max-h-[280px] pb-3 [&_.recharts-pie-label-text]:fill-foreground'
                >
                  <PieChart
                    margin={{
                      left: 20,
                      right: 20,
                    }}
                    // className='[&_.recharts-legend-wrapper]:!w-full'
                  >
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          className='min-w-[150px]'
                          hideLabel
                        />
                      }
                    />
                    <Pie
                      data={chartData}
                      dataKey='percentage'
                      nameKey='type'
                      label={(item) => `${item.total}`}
                    >
                      <LabelList
                        dataKey='type'
                        className='fill-background font-semibold'
                        stroke='none'
                        fontSize={12}
                        formatter={(value: keyof typeof chartConfig) =>
                          chartConfig[value]?.label
                        }
                      />
                    </Pie>
                    <ChartLegend
                      payload={chartData.map((item) => ({
                        id: item.type,
                        type: 'circle',
                        value: `${item.label} (${item.percentage}%)`,
                        color: item.fill,
                      }))}
                      content={(props) => (
                        <ul className='grid grid-cols-2 justify-center items-center gap-1'>
                          {props.payload.map((item) => (
                            <li
                              key={item.id}
                              className='flex justify-center col-span-1 gap-2 items-center'
                            >
                              <span
                                className='w-3 h-3 rounded-full inline-block min-w-3'
                                style={{ backgroundColor: item.color }}
                              />
                              <span className='inline-block'>{item.value}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    />
                  </PieChart>
                </ChartContainer>
              </CardContent>

              <div className='col-span-2 pt-6'>
                <FormCustomLabel
                  htmlFor='ticketType'
                  custom={
                    <div>
                      <h3 className='text-sm mt-4 mb-2'>Loại vé: </h3>
                    </div>
                  }
                />
                <FormSelect
                  control={form.control}
                  name='ticketType'
                  options={optionify(TicketTypeCode)}
                  i18nPath='code.ticket.type'
                  className='max-w-[130px]'
                  label=''
                />

                <FormCustomLabel
                  htmlFor='eventId'
                  custom={
                    <div>
                      <h3 className='text-sm mt-4 mb-2'>Tên sự kiện: </h3>
                    </div>
                  }
                />
                <FormSelect
                  control={form.control}
                  name='eventId'
                  options={
                    eventOptions?.data?.map((option) => ({
                      label: option.name,
                      value: option.id + '',
                    })) || []
                  }
                  className='max-w-[130px] mb-4'
                />
              </div>
            </div>
          )}
          {isLoading && <ElementLoader title='Đang phân tích vé...' />}
          {!isLoading && ticketStats?.totalTickets === 0 && <Nodata />}
        </form>
      </Form>
    </Card>
  );
}
