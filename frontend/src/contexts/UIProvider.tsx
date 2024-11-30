'use client';

import * as React from 'react';
import { NextUIProvider } from '@nextui-org/system';
import { useRouter } from 'next/navigation';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ThemeProviderProps } from 'next-themes/dist/types';
import { getCookie } from 'cookies-next';
import { TooltipProvider } from '../component/common/Tooltip';

export interface UIProviderProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

export function UIProvider({ children, themeProps }: UIProviderProps) {
  const router = useRouter();

  return (
    <NextUIProvider
      locale={
        getCookie('NEXT_LOCALE') === 'en' || !getCookie('NEXT_LOCALE')
          ? 'en-US'
          : 'vi'
      }
      navigate={router.push}
    >
      <NextThemesProvider {...themeProps}>
        <TooltipProvider>{children}</TooltipProvider>
      </NextThemesProvider>
    </NextUIProvider>
  );
}
