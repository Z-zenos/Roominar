import { useQuery } from '@tanstack/react-query';
import { useRef } from 'react';
import {
  TransactionStatusCode,
  type TransactionsApiGetTransactionStatusCountsRequest,
  type TransactionsApiListingMyTransactionsRequest,
} from '../lib/api/generated';
import useApi from '../lib/api/useApi';
import { toCamelCase } from '../utils/app.util';
import { useSearchParams } from 'next/navigation';

export const useListingMyTransactionsQuery = (
  params?: TransactionsApiListingMyTransactionsRequest,
) => {
  params = toCamelCase(params);
  const api = useApi();
  const refetchCountRef = useRef(0);

  const query = useQuery({
    queryKey: ['listing-my-transactions', params],
    queryFn: async () => await api.transactions.listingMyTransactions(params),
    staleTime: 1000 * 60 * 5,
    refetchInterval: (data) => {
      const status = data?.state.data?.data[0]?.status;

      if (
        status === TransactionStatusCode.Success ||
        refetchCountRef.current >= 3 ||
        !params?.transactionId
      ) {
        return false;
      }

      refetchCountRef.current += 1;
      return 1000 * 5;
    },
  });

  return query;
};

export const useGetTransactionStatusCountsQuery = (
  params?: TransactionsApiGetTransactionStatusCountsRequest,
) => {
  const searchParams = useSearchParams();
  const transactionId = searchParams.get('transaction_id');
  const api = useApi();
  const refetchCountRef = useRef(0);

  const query = useQuery({
    queryKey: ['get-transaction-status-counts', params],
    queryFn: async () =>
      await api.transactions.getTransactionStatusCounts(params),
    refetchInterval: () => {
      if (!transactionId || refetchCountRef.current >= 3) {
        return false;
      }

      refetchCountRef.current += 1;
      return 1000 * 5;
    },
  });

  return query;
};
