import type { SWRMutationConfiguration } from 'swr/mutation';
import type { TransactionsApiCreateApplicationTransactionRequest } from '../lib/api/generated';
import useSWRMutation from 'swr/mutation';
import useApi from '../lib/api/useApi';

export const useCreateApplicationTransactionMutation = <T>(
  options?: SWRMutationConfiguration<void, T>,
) => {
  const api = useApi();
  const key = 'create-application-transaction';
  return useSWRMutation<
    void,
    T,
    typeof key,
    TransactionsApiCreateApplicationTransactionRequest
  >(
    key,
    async (_: string, { arg }) =>
      await api.transactions.createApplicationTransaction(arg),
    options,
  );
};
