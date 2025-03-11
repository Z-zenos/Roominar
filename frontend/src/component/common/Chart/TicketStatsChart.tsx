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
import { getCookie } from 'cookies-next';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useGetTicketStatsQuery } from '@/src/api/organization.api';
import { Skeleton } from '@nextui-org/react';
import queryString from 'query-string';
import { Form, FormSelect } from '../../form/Form';
import { optionify } from '@/src/utils/app.util';

const TICKET_STATS_STORAGE_KEY = 'ticketStats';

export function TicketStatsChart() {
  const [isEnglish] = useState<boolean>(
    getCookie('NEXT_LOCALE') === 'en' || !getCookie('NEXT_LOCALE'),
  );

  const [filters, setFilters] = useState<OrganizationsApiGetTicketStatsRequest>(
    {},
  );

  const { data, refetch } = useGetTicketStatsQuery({
    ...queryString.parse(
      queryString.stringify(filters, { arrayFormat: 'bracket' }),
      { arrayFormat: 'bracket' },
    ),
  });

  useEffect(() => {
    const storedFilters = localStorage.getItem(TICKET_STATS_STORAGE_KEY);
    if (storedFilters) {
      setFilters(JSON.parse(storedFilters));
    }
  }, []);

  const chartData = [
    {
      type: 'sold',
      total: data?.totalSoldTickets,
      percentage: data?.soldPercentage,
      fill: '#ff5c00',
    },
    {
      type: 'remaining',
      total: data?.totalRemainingTickets,
      percentage: data?.remainingPercentage,
      fill: '#fcb400',
    },
    // {
    //   type: 'reserved',
    //   total: data.totalReservedTickets,
    //   percentage: data.reservedPercentage,
    //   fill: '#4CAF50',
    // },
  ];
  const chartConfig = {
    percentage: {
      label: 'Total',
    },
    sold: {
      label: 'Sold',
      color: '#FFC107',
    },
    remaining: {
      label: 'Remaining',
      color: '#fcb400',
    },
    reserved: {
      label: 'Reserved',
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
    <Card>
      <Form {...form}>
        <form className='flex flex-col'>
          <CardHeader className='items-center pb-0'>
            {data ? (
              <CardTitle className='font-medium'>
                Ticket Stats ({data.totalTickets}) - Revenue:{' '}
                {new Number(data.totalRevenue).toLocaleString(
                  isEnglish ? 'en-US' : 'vi-VN',
                  {
                    style: 'currency',
                    currency: isEnglish ? 'USD' : 'VND',
                  },
                )}
              </CardTitle>
            ) : (
              <Skeleton className='h-[40px] w-full rounded-md' />
            )}
          </CardHeader>
          {data ? (
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
                        value: `${item.type} (${item.percentage}%)`,
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

              <div className='col-span-2 pt-4'>
                <FormSelect
                  control={form.control}
                  name='ticketType'
                  options={optionify(TicketTypeCode)}
                  i18nPath='code.ticket.type'
                  className='max-w-[130px]'
                />
              </div>
            </div>
          ) : (
            <Skeleton className='h-[150px] mx-6 my-6 rounded-md' />
          )}
        </form>
      </Form>
    </Card>
  );
}
