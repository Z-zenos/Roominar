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
import type { GetTicketStatsResponse } from '@/src/lib/api/generated';
import { getCookie } from 'cookies-next';
import { useState } from 'react';

interface TicketStatsChartProps {
  data: GetTicketStatsResponse;
}

export function TicketStatsChart({ data }: TicketStatsChartProps) {
  const [isEnglish] = useState<boolean>(
    getCookie('NEXT_LOCALE') === 'en' || !getCookie('NEXT_LOCALE'),
  );
  const chartData = [
    {
      type: 'sold',
      total: data.totalSoldTickets,
      percentage: data.soldPercentage,
      fill: '#ff5c00',
    },
    {
      type: 'remaining',
      total: data.totalRemainingTickets,
      percentage: data.remainingPercentage,
      fill: '#246cff',
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
      color: '#246cff',
    },
    reserved: {
      label: 'Reserved',
      color: '#ff5c00',
    },
  } as ChartConfig;

  return (
    <Card className='flex flex-col'>
      <CardHeader className='items-center pb-0'>
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
      </CardHeader>
      <CardContent className='flex-1 pb-0'>
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
    </Card>
  );
}
