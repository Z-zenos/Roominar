'use client';

import { useAnalyzeEventCheckInsQuery } from '@/src/api/organization.api';
import type { ChartConfig } from '@/src/component/common/Chart/Chart';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/src/component/common/Chart/Chart';
import Nodata from '@/src/component/common/Nodata';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import './Ticket.css';
import clsx from 'clsx';
import { styles } from '@/src/constants/styles.constant';
import { Dot } from 'lucide-react';
import { CircularProgress } from '@nextui-org/react';

interface AnalyzeEventCheckInProps {
  slug: string;
}

function AnalyzeEventCheckIn({ slug }: AnalyzeEventCheckInProps) {
  const { data } = useAnalyzeEventCheckInsQuery({
    slug: slug,
  });

  const chartConfig = {
    count: {
      label: 'Số vé check-in',
      color: 'rgb(0, 111, 238)',
    },
  } satisfies ChartConfig;

  return (
    data && (
      <div className='grid grid-cols-2 gap-4 p-4'>
        <div className='col-span-2 shadow-md p-5 pb-8 rounded-md bg-white'>
          <div>
            <p className='text-md font-semibold'>Thống kê check-in</p>

            {data && data.checkInByMinute?.length > 0 ? (
              <div>
                <ChartContainer config={chartConfig}>
                  <AreaChart
                    accessibilityLayer
                    data={data.checkInByMinute.map((item) => ({
                      minute: `${new Date(item.minute).getHours().toString().padStart(2, '0')}:${new Date(
                        item.minute,
                      )
                        .getMinutes()
                        .toString()
                        .padStart(2, '0')}`,
                      count: item.count,
                    }))}
                    margin={{
                      left: 40,
                      right: 40,
                      top: 10,
                    }}
                  >
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey='minute'
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent indicator='line' />}
                    />
                    <Area
                      dataKey='count'
                      type='natural'
                      fill='rgb(0, 111, 238)'
                      fillOpacity={0.4}
                      stroke='rgb(0, 111, 238)'
                    />
                  </AreaChart>
                </ChartContainer>

                <div>
                  <p className='text-sm text-gray-500 mt-3 text-center'>
                    Biểu đồ thể hiện số lượng vé check-in theo từng phút.
                  </p>
                </div>

                <div
                  className={clsx(
                    styles.between,
                    'border rounded-md shadow-sm p-5 my-4',
                  )}
                >
                  <div>
                    <p>Đã check-in:</p>
                    <p className={styles.flexStart}>
                      <Dot className='text-green-500 w-10 h-10 inline-block' />{' '}
                      <span className='text-green-500 font-semibold text-md'>
                        {data.totalCheckIns}
                      </span>{' '}
                      vé /{' '}
                      <span className='text-purple-500 font-semibold text-md'>
                        {data.totalSoldTickets}
                      </span>{' '}
                      vé đã bán
                    </p>
                  </div>
                  <div>
                    <CircularProgress
                      color='success'
                      label='Tỉ lệ check-in'
                      showValueLabel={true}
                      size='lg'
                      value={data.checkInRate}
                      classNames={{
                        label: 'text-sm',
                        svg: 'w-20 h-20 drop-shadow-md',
                        value: 'text-md font-semibold text-green-500',
                      }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <Nodata />
            )}
          </div>
        </div>
      </div>
    )
  );
}

export default AnalyzeEventCheckIn;
