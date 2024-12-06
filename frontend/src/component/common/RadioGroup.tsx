'use client';

import * as React from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { cn } from '@/src/utils/app.util';
import { FaCircle } from 'react-icons/fa6';
import type { RadioProps } from '@nextui-org/react';
import { useRadio, VisuallyHidden } from '@nextui-org/react';

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn('grid gap-2', className)}
      {...props}
      ref={ref}
    />
  );
});

RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        'aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className='flex items-center justify-center'>
        <FaCircle className='h-2 w-2 fill-current text-current' />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
});

RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

const TicketTypeRadio = (props: RadioProps) => {
  console.log(props);
  const {
    Component,
    children,
    description,
    getBaseProps,
    getWrapperProps,
    getInputProps,
    getLabelProps,
    getLabelWrapperProps,
    getControlProps,
  } = useRadio(props);

  return (
    <Component
      {...getBaseProps()}
      className={cn(
        'group inline-flex items-center justify-between hover:bg-content2 flex-row-reverse',
        'cursor-pointer border-1 border-gray-300 rounded-lg gap-4 px-4 py-2',
        'data-[selected=true]:border-primary',
      )}
    >
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>
      <span {...getWrapperProps()}>
        <span {...getControlProps()} />
      </span>
      <div {...getLabelWrapperProps()}>
        {children && <span {...getLabelProps()}>{children}</span>}
        {description && (
          <span className='text-small text-foreground opacity-70'>
            {description}
          </span>
        )}
      </div>
    </Component>
  );
};

TicketTypeRadio.displayName = 'TicketTypeRadio';

export { RadioGroup, RadioGroupItem, TicketTypeRadio };
