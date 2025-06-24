import { useQuery } from '@tanstack/react-query';
import type {
  TransactionsApiGetTransactionStatusCountsRequest,
  TransactionsApiListingMyTransactionsRequest,
} from '../lib/api/generated';
import useApi from '../lib/api/useApi';
import { toCamelCase } from '../utils/app.util';

export const useListingMyTransactionsQuery = (
  params?: TransactionsApiListingMyTransactionsRequest,
) => {
  params = toCamelCase(params);
  const api = useApi();
  return useQuery({
    queryKey: ['listing-my-transactions', params],
    queryFn: async () => await api.transactions.listingMyTransactions(params),
    staleTime: 1000 * 60 * 5,
  });
};

export const useGetTransactionStatusCountsQuery = (
  params?: TransactionsApiGetTransactionStatusCountsRequest,
) => {
  const api = useApi();
  return useQuery({
    queryKey: ['get-transaction-status-counts'],
    queryFn: async () =>
      await api.transactions.getTransactionStatusCounts(params),
  });
};
