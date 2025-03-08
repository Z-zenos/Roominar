'use client';

import * as React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  XAxis,
  YAxis,
} from 'recharts';
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
  TagStatsCategoryCode,
  type TagStatsItem,
} from '@/src/lib/api/generated';
import { TrendingUp } from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/react';
import RankingList from '../Ranking/RankingList';

interface TagStatsChartProps {
  data: TagStatsItem[];
}

export function TagStatsChart({ data }: TagStatsChartProps) {
  const t = useTranslations('code');
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const totalTags = React.useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.usageCount, 0);
  }, [data]);

  const chartConfig = data.slice(0, 5).reduce(
    (acc, item, i) => {
      acc[item.name] = {
        label: item.name,
        color:
          ['#d8fcff', '#d8fcff', '#fcfcaa', 'bg-default-sub'][i] ||
          'bg-default-sub',
      };
      return acc;
    },
    { tags: { label: 'Tags' } },
  );

  const chartData = data.slice(0, 5).map((item) => ({
    name:
      item.category != TagStatsCategoryCode.Tag
        ? t(
            `${
              item.category === TagStatsCategoryCode.Industry
                ? 'industry'
                : 'jobType'
            }.${item.name}
            }`,
          )
        : item.name,
    usageCount: item.usageCount,
    fill: chartConfig[item.name]?.color,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tag - Industry - Job Type</CardTitle>
        <CardDescription>
          Total: {totalTags}.{' '}
          <span
            className='underline cursor-pointer text-sm text-orange-400'
            onClick={onOpen}
          >
            Show more
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout='vertical'
            margin={{
              right: 20,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey='name'
              type='category'
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
              hide
            />
            <XAxis
              dataKey='usageCount'
              type='number'
              hide
            />
            {/* <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator='line' />}
            /> */}
            <Bar
              dataKey='usageCount'
              layout='vertical'
              radius={4}
              fillOpacity={1}
            >
              <LabelList
                dataKey='name'
                position='insideLeft'
                offset={8}
                className='fill-white font-semibold'
                content={({ x, y, value, index }) => (
                  <text
                    x={(x as number) + 10}
                    y={(y as number) + 15}
                    fill={
                      index === 0
                        ? '#249055'
                        : index === 1
                          ? '#246cff'
                          : index === 2
                            ? '#fcb400'
                            : '#fff'
                    }
                    fontSize={12}
                    fontWeight='bold'
                    textAnchor='left'
                  >
                    {value}
                  </text>
                )}
              />
              <LabelList
                dataKey='usageCount'
                position='right'
                offset={8}
                className='fill-foreground'
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col items-start gap-2 text-sm'>
        <div className='flex gap-2 font-medium leading-none'>
          Trending up by 5.2% this month <TrendingUp className='h-4 w-4' />
        </div>
        <div className='leading-none text-muted-foreground'>
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement='top-center'
        size='2xl'
        className='max-h-[600px] w-fit overflow-y-scroll'
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>
                Tags - Industry - Job Type Rank
              </ModalHeader>
              <ModalBody>
                <RankingList
                  data={data.map((item) => ({
                    id: item.name,
                    name:
                      item.category != TagStatsCategoryCode.Tag
                        ? t(
                            `${
                              item.category === TagStatsCategoryCode.Industry
                                ? 'industry'
                                : 'jobType'
                            }.${item.name}`,
                          )
                        : item.name,
                    extraInfo: item.usageCount,
                  }))}
                  onClick={() => {}}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  color='danger'
                  variant='flat'
                  onPress={onClose}
                >
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </Card>
  );
}
