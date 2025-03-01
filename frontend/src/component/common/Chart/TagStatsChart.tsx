'use client';

import * as React from 'react';
import { Label, Pie, PieChart } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from './Chart';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../Card/Card';
import type { TagStatsItem } from '@/src/lib/api/generated';
import { randomHexColor } from '@/src/utils/app.util';

interface TagStatsChartProps {
  data: TagStatsItem[];
}

export function TagStatsChart({ data }: TagStatsChartProps) {
  const totalTags = React.useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.usageCount, 0);
  }, []);

  const chartConfig = Object.assign(
    {},
    {
      tags: {
        label: 'Tags',
      },
    },
    ...data.map((item) => ({
      [item.name]: {
        label: item.name,
        color: randomHexColor(),
      },
    })),
  );

  const chartData = data.map((item) => ({
    name: item.name,
    usage_count: item.usageCount,
    fill: chartConfig[item.name]?.color,
  }));

  return (
    <Card className='flex flex-col shadow-md'>
      <CardHeader className='items-center pb-0'>
        <CardTitle>Tag Stats</CardTitle>
        <CardDescription>Tag - Industry - Job Category</CardDescription>
      </CardHeader>
      <CardContent className='flex-1 pb-0'>
        <ChartContainer
          config={chartConfig}
          className='mx-auto aspect-square max-h-[250px]'
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey='usage_count'
              nameKey='name'
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor='middle'
                        dominantBaseline='middle'
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className='fill-foreground text-3xl font-bold'
                        >
                          {totalTags.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className='fill-muted-foreground'
                        >
                          Tags
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col gap-2 text-sm'>
        <div className='leading-none text-muted-foreground'>
          Showing total tags for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
