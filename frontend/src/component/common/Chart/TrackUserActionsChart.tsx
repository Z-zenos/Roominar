'use client';

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
} from '@/src/lib/api/generated';
import { optionify, randomHexColor } from '@/src/utils/app.util';
import clsx from 'clsx';
import { styles } from '@/src/constants/styles.constant';
import { Form, FormCombobox, FormSelect } from '../../form/Form';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import dayjs from 'dayjs';
import queryString from 'query-string';
import { useEffect, useState } from 'react';
import { Skeleton } from '@nextui-org/react';
import { useTrackUserActionsQuery } from '@/src/api/organization.api';

const USER_ACTION_STORAGE_KEY = 'userActions';

const userActionColors = {
  VIEW: '#3498db', // Xanh dương
  BOOKMARK: '#f1c40f', // Vàng
  SHARE: '#9b59b6', // Tím
  COMMENT: '#16a085', // Xanh ngọc
  FOLLOW: '#e67e22', // Cam đậm
  RATE: '#f39c12', // Cam sáng
  CHECK_IN: '#2980b9', // Xanh nước biển
  CHECK_OUT: '#d35400', // Cam đất
  PURCHASE_TICKET: '#27ae60', // Xanh lá
  CANCEL_TICKET: '#e74c3c', // Đỏ
  SEARCH: '#8e44ad', // Tím đậm
  DOWNLOAD: '#7f8c8d', // Xám
  UPGRADE_PLAN: '#c0392b', // Đỏ sẫm
  WATCH_VIDEO: '#8e44ad', // Tím đậm
  SUBMIT_SURVEY: '#3498db', // Xanh dương
  ADD_TO_CALENDAR: '#2ecc71', // Xanh lá sáng (giống Google Calendar)
  INVITE_FRIEND: '#ff6b81', // Hồng đỏ (mang tính thân thiện, rủ rê)
};

export function TrackUserActionsChart() {
  const t = useTranslations('code');
  const [filters, setFilters] =
    useState<OrganizationsApiTrackUserActionsRequest>({});

  const { data: trackUserActions, refetch } = useTrackUserActionsQuery({
    ...queryString.parse(
      queryString.stringify(filters, { arrayFormat: 'bracket' }),
      { arrayFormat: 'bracket' },
    ),
  });

  useEffect(() => {
    const storedFilters = localStorage.getItem(USER_ACTION_STORAGE_KEY);
    if (storedFilters) {
      setFilters(JSON.parse(storedFilters));
    }
  }, []);

  const form = useForm<OrganizationsApiTrackUserActionsRequest>({
    mode: 'all',
    defaultValues: {
      actionTypes: filters.actionTypes ?? [
        UserActionTypeCode.Bookmark,
        UserActionTypeCode.ApplyEvent,
        UserActionTypeCode.PurchaseTicket,
      ],
      timeRange: filters.timeRange ?? TrackingTimeRangeCode.Last7Days,
    },
  });

  useEffect(() => {
    const subscription = form.watch((value) => {
      localStorage.setItem(USER_ACTION_STORAGE_KEY, JSON.stringify(value));
      setFilters(value);
      refetch();
    });
    return () => subscription.unsubscribe();
  }, [form, form.watch, refetch]);

  const chartConfig = Object.assign(
    {},
    ...Object.values(UserActionTypeCode).map((uatc) => ({
      [uatc]: {
        label: uatc,
        color: userActionColors[uatc] ?? randomHexColor(),
      },
    })),
  );

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
              />
              <FormSelect
                control={form.control}
                name='timeRange'
                options={optionify(TrackingTimeRangeCode)}
                i18nPath='code.trackingTimeRange'
              />
            </div>
          </CardHeader>
          {trackUserActions && trackUserActions.data.length > 0 ? (
            <CardContent>
              <ChartContainer config={chartConfig}>
                <LineChart
                  accessibilityLayer
                  data={trackUserActions.data}
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
                    filters.actionTypes ?? [
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
          ) : (
            <Skeleton className='h-[200px] mx-20 my-6 rounded-md' />
          )}
          <CardFooter>
            {/* <div className='flex w-full items-start gap-2 text-sm'>
              <div className='grid gap-2'>
                <div className='flex items-center gap-2 font-medium leading-none'>
                  Trending up by 5.2% this month{' '}
                  <TrendingUp className='h-4 w-4' />
                </div>
                <div className='flex items-center gap-2 leading-none text-muted-foreground'>
                  Showing total visitors for the last 6 months
                </div>
              </div>
            </div> */}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
