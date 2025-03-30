import type { SWRMutationConfiguration } from 'swr/mutation';
import useSWRMutation from 'swr/mutation';
import useApi from '../lib/api/useApi';
import type {
  TicketsApiCancelTicketsRequest,
  TicketsApiCreateTicketRequest,
} from '../lib/api/generated';
import { useQuery } from '@tanstack/react-query';

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

export const useListingMyTicketsQuery = () => {
  const api = useApi();
  return useQuery({
    queryKey: ['listing-my-tickets'],
    queryFn: async () => await api.tickets.listingMyTickets(),
  });
};

export const useCancelTicketsMutation = <T>(
  options?: SWRMutationConfiguration<number, T>,
) => {
  const api = useApi();
  const key = 'cancel-ticket';
  return useSWRMutation<number, T, typeof key, TicketsApiCancelTicketsRequest>(
    key,
    async (_: string, { arg }) => await api.tickets.cancelTickets(arg),
    options,
  );
};
