'use client';

import { TrendingUp } from 'lucide-react';
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts';

import { ChartContainer, ChartTooltip, ChartTooltipContent } from './Chart';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../Card/Card';
import {
  UserActionTypeCode,
  type TrackUserActionsItem,
} from '@/src/lib/api/generated';
import { randomHexColor } from '@/src/utils/app.util';

interface TrackUserActionsChartProps {
  data: TrackUserActionsItem[];
}

export function TrackUserActionsChart({ data }: TrackUserActionsChartProps) {
  const chartConfig = Object.assign(
    {},
    ...Object.values(UserActionTypeCode).map((uatc) => ({
      [uatc]: {
        label: uatc,
        color: randomHexColor(),
      },
    })),
  );

  return (
    <Card className='shadow-md'>
      <CardHeader>
        <CardTitle>Line Chart - Multiple</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='actionAt'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
            />
            {[
              UserActionTypeCode.Bookmark,
              UserActionTypeCode.ApplyEvent,
              UserActionTypeCode.PurchaseTicket,
            ].map((uatc) => (
              <Line
                key={uatc}
                dataKey={`actions.${uatc}`}
                type='monotone'
                stroke={chartConfig[uatc].color}
                strokeWidth={2}
                dot={false}
              />
            ))}
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className='flex w-full items-start gap-2 text-sm'>
          <div className='grid gap-2'>
            <div className='flex items-center gap-2 font-medium leading-none'>
              Trending up by 5.2% this month <TrendingUp className='h-4 w-4' />
            </div>
            <div className='flex items-center gap-2 leading-none text-muted-foreground'>
              Showing total visitors for the last 6 months
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
