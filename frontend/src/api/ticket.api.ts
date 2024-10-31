import type { SWRMutationConfiguration } from 'swr/mutation';
import useSWRMutation from 'swr/mutation';
import useApi from '../lib/api/useApi';
import type { TicketsApiCreateTicketRequest } from '../lib/api/generated';

export const useCreateTicketMutation = <T>(
  options?: SWRMutationConfiguration<number, T>,
) => {
  const api = useApi();
  const key = 'create-ticket';
  return useSWRMutation<number, T, typeof key, TicketsApiCreateTicketRequest>(
    key,
    async (_: string, { arg }) => await api.tickets.createTicket(arg),
    options,
  );
};
