'use client';

import ErrorBoundary from '@/src/component/layout/ErrorBoundary';
import { NotificationProvider } from '@/src/contexts/NotificationContext';
import { parseErrorMessage } from '@/src/utils/app.util';
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import type { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { useMemo } from 'react';
import toast from 'react-hot-toast';

export interface IRootProviderProps {
  session?: Session | null;
  children: React.ReactNode;
}

export default function RootProvider({
  children,
  session,
}: IRootProviderProps) {
  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: false,
          },
          mutations: {
            retry: false,
          },
        },
        queryCache: new QueryCache({
          onError: (error) => {
            const err = parseErrorMessage(error?.message);
            toast.error(`${+err.httpCode}: ${err?.body?.message}`);
          },
        }),
        mutationCache: new MutationCache({
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          onError: (error, _, __) => {
            const err = parseErrorMessage(error?.message);
            toast.error(`${+err.httpCode}: ${err?.body?.message}`);
          },
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          onSuccess(_, __) {},
        }),
      }),
    [],
  );

  return (
    <ErrorBoundary>
      <SessionProvider session={session}>
        <NotificationProvider>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </NotificationProvider>
      </SessionProvider>
    </ErrorBoundary>
  );
}
