'use client';

import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';

import type { HTMLAttributes, ReactNode } from 'react';
import { Suspense } from 'react';
import clsx from 'clsx';
import { cn } from '@/src/utils/app.util';

const BaseTabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground',
      className,
    )}
    {...props}
  />
));

TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
      className,
    )}
    {...props}
  />
));

TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      className,
    )}
    {...props}
  />
));

TabsContent.displayName = TabsPrimitive.Content.displayName;

interface TabsProps extends HTMLAttributes<HTMLDivElement> {
  defaultValue: string;
  tabClassName?: string;
  tabs: { value: string; content?: ReactNode }[];
}

export function Tabs({
  defaultValue,
  className,
  tabs,
  tabClassName,
}: TabsProps) {
  return (
    <BaseTabs
      defaultValue={defaultValue}
      className={clsx('w-full', className)}
    >
      <TabsList
        className={clsx('grid', `grid-cols-${tabs.length}`, tabClassName)}
      >
        {tabs.map((tab) => (
          <TabsTrigger
            value={tab.value}
            key={`tt-${tab.value}`}
          >
            {tab.value}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent
          value={tab.value}
          key={`tc-${tab.value}`}
        >
          <Suspense>{tab.content}</Suspense>
        </TabsContent>
      ))}
    </BaseTabs>
  );
}

export { BaseTabs, TabsList, TabsTrigger, TabsContent };
