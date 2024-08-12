import clsx from 'clsx';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { type LegacyRef, forwardRef } from 'react';
import { cva } from 'class-variance-authority';
import Spinner from '../Loader/Spinner';

export const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  title?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  className?: string;
  children?: ReactNode;
  isLoading?: boolean;
  outline?: boolean;
  border?: boolean;
  paint?: string;
}

function CustomButton(
  {
    title,
    leftIcon,
    rightIcon,
    className,
    children,
    isLoading,
    outline = false,
    border = true,
    paint,
    ...props
  }: ButtonProps,
  ref: LegacyRef<HTMLButtonElement>,
) {
  return (
    <button
      className={clsx(
        'px-6 py-2 rounded-md font-bold transition-all duration-200 flex items-center justify-center flex-wrap gap-2 border-2 active:shadow-none hover:shadow-[rgba(6,_24,_44,_0.4)_0px_0px_0px_2px,_rgba(6,_24,_44,_0.65)_0px_4px_6px_-1px,_rgba(255,_255,_255,_0.08)_0px_1px_0px_inset]',
        props.disabled && '!bg-gray-main disabled:pointer-events-none',
        outline && 'transparent text-primary border-primary hover:bg-gray-100 dark:hover:text-dark-main',
        !border && 'border-none hover:border-none hover:shadow-none',
        paint ?? 'bg-primary border-transparent text-white hover:bg-white hover:text-primary hover:border-primary',
        className,
      )}
      ref={ref}
      {...props}
    >
      {isLoading && <Spinner />}
      {leftIcon}
      {title}
      {children}
      {rightIcon}
    </button>
  );
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(CustomButton);

export default Button;
