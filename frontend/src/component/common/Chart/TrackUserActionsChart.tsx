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
import type { OrganizationsApiTrackUserActionsRequest } from '@/src/lib/api/generated';
import {
  TrackingTimeRangeCode,
  UserActionTypeCode,
  type TrackUserActionsItem,
} from '@/src/lib/api/generated';
import { optionify, randomHexColor, searchQuery } from '@/src/utils/app.util';
import clsx from 'clsx';
import { styles } from '@/src/constants/styles.constant';
import { Form, FormCombobox, FormSelect } from '../../form/Form';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import dayjs from 'dayjs';
import { useRouter, useSearchParams } from 'next/navigation';

interface TrackUserActionsChartProps {
  data: TrackUserActionsItem[];
}

export function TrackUserActionsChart({ data }: TrackUserActionsChartProps) {
  const t = useTranslations('code');
  const searchParams = useSearchParams();
  const router = useRouter();

  const form = useForm<OrganizationsApiTrackUserActionsRequest>({
    mode: 'all',
    defaultValues: {
      actionTypes: (searchParams.getAll(
        'action_types[]',
      ) as UserActionTypeCode[]) ?? [
        UserActionTypeCode.Bookmark,
        UserActionTypeCode.ApplyEvent,
        UserActionTypeCode.PurchaseTicket,
      ],
      timeRange:
        (searchParams.get('timeRange') as TrackingTimeRangeCode) ??
        TrackingTimeRangeCode.Last7Days,
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

  function handleTrackingUserActions() {
    const filters: OrganizationsApiTrackUserActionsRequest = {
      ...form.getValues(),
    };

    const exclude_queries = [];

    searchQuery(router, filters, searchParams, exclude_queries);
  }

  return (
    <Card className='shadow-md'>
      <Form {...form}>
        <form>
          <CardHeader className={clsx(styles.between)}>
            <CardTitle className='mb-3'>Tracking User Actions</CardTitle>
            <div className={clsx(styles.center, 'gap-3')}>
              <FormCombobox
                control={form.control}
                name='actionTypes'
                options={optionify(UserActionTypeCode)}
                multiple
                i18nPath='code.userAction'
                onValueChange={handleTrackingUserActions}
              />
              <FormSelect
                control={form.control}
                name='timeRange'
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
                  left: 20,
                  right: 20,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey='actionAt'
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  interval={0}
                  tickFormatter={(value) => dayjs(value).format('MM-DD')}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent className='min-w-[160px]' />}
                />
                {(
                  (searchParams.getAll(
                    'action_types[]',
                  ) as UserActionTypeCode[]) ?? [
                    UserActionTypeCode.Bookmark,
                    UserActionTypeCode.ApplyEvent,
                    UserActionTypeCode.PurchaseTicket,
                  ]
                ).map((uatc) => (
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
