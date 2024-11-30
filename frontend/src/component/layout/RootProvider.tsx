'use client';

import ErrorBoundary from '@/src/component/layout/ErrorBoundary';
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
import { RecoilRoot } from 'recoil';

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
          onError: (error, query) => {
            console.log('queryCache: ', error);
            const err = parseErrorMessage(error?.message);
            toast.error(`${+err.httpCode}: ${err?.body?.message}`);
          },
        }),
        mutationCache: new MutationCache({
          onError: (error, _, __, mutation) => {
            console.log('mutationCache: ', error);

            const err = parseErrorMessage(error?.message);
            toast.error(`${+err.httpCode}: ${err?.body?.message}`);
          },
          onSuccess(data, _, __, mutation) {},
        }),
      }),
    [],
  );

  return (
    <ErrorBoundary>
      <SessionProvider session={session}>
        <RecoilRoot>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </RecoilRoot>
      </SessionProvider>
    </ErrorBoundary>
  );
}
