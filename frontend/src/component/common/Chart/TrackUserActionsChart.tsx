'use client';

import { TrendingUp } from 'lucide-react';
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts';

import {
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
} from './Chart';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../Card/Card';
import {
  TrackingTimeRangeCode,
  UserActionTypeCode,
  type TrackUserActionsItem,
} from '@/src/lib/api/generated';
import { optionify, randomHexColor } from '@/src/utils/app.util';
import clsx from 'clsx';
import { styles } from '@/src/constants/styles.constant';
import { Form, FormCombobox, FormSelect } from '../../form/Form';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';

interface TrackUserActionsChartProps {
  data: TrackUserActionsItem[];
}

export function TrackUserActionsChart({ data }: TrackUserActionsChartProps) {
  const t = useTranslations('code');
  const form = useForm<{ action: string[]; time_period: string }>({
    mode: 'all',
    defaultValues: {
      action: [
        UserActionTypeCode.Bookmark,
        UserActionTypeCode.ApplyEvent,
        UserActionTypeCode.PurchaseTicket,
      ],
      time_period: TrackingTimeRangeCode.Last7Days,
    },
  });

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
      <Form {...form}>
        <form>
          <CardHeader className={clsx(styles.between)}>
            <CardTitle>Tracking User Actions</CardTitle>
            <div className={clsx(styles.center, 'gap-3')}>
              <FormCombobox
                control={form.control}
                name='action'
                options={optionify(UserActionTypeCode)}
                multiple
                i18nPath='code.userAction'
              />
              <FormSelect
                control={form.control}
                name='time_period'
                options={optionify(TrackingTimeRangeCode)}
                i18nPath='code.trackingTimeRange'
              />
            </div>
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
                  // tickFormatter={(value) => value.slice(0, 2)}
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
                    name={t(`userAction.${uatc}`)}
                  />
                ))}
                <ChartLegend />
              </LineChart>
            </ChartContainer>
          </CardContent>
          <CardFooter>
            <div className='flex w-full items-start gap-2 text-sm'>
              <div className='grid gap-2'>
                <div className='flex items-center gap-2 font-medium leading-none'>
                  Trending up by 5.2% this month{' '}
                  <TrendingUp className='h-4 w-4' />
                </div>
                <div className='flex items-center gap-2 leading-none text-muted-foreground'>
                  Showing total visitors for the last 6 months
                </div>
              </div>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
