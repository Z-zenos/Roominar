import type { SWRMutationConfiguration } from 'swr/mutation';
import useSWRMutation from 'swr/mutation';
import useApi from '../lib/api/useApi';
import type {
  EventsApiListingEventPurchasedTicketsRequest,
  TicketItem,
  TicketsApiCancelTicketsRequest,
  TicketsApiCreateTicketRequest,
  TicketsApiDeleteTicketRequest,
  TicketsApiGetDraftTicketRequest,
  TicketsApiUpdateTicketRequest,
} from '../lib/api/generated';
import { useQuery } from '@tanstack/react-query';
import { toCamelCase } from '../utils/app.util';

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

export const useUpdateTicketMutation = <T>(
  options?: SWRMutationConfiguration<TicketItem, T>,
) => {
  const api = useApi();
  const key = 'update-ticket';
  return useSWRMutation<
    TicketItem,
    T,
    typeof key,
    TicketsApiUpdateTicketRequest
  >(
    key,
    async (_: string, { arg }) => await api.tickets.updateTicket(arg),
    options,
  );
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

export const useGetDraftTicketQuery = (
  params?: TicketsApiGetDraftTicketRequest,
) => {
  const api = useApi();
  return useQuery({
    queryKey: ['get-draft-ticket', params.ticketId],
    queryFn: async () => await api.tickets.getDraftTicket(params),
  });
};

export const useDeleteTicketMutation = <T>(
  options?: SWRMutationConfiguration<void, T>,
) => {
  const api = useApi();
  const key = 'delete-ticket';
  return useSWRMutation<void, T, typeof key, TicketsApiDeleteTicketRequest>(
    key,
    async (_: string, { arg }) => await api.tickets.deleteTicket(arg),
    options,
  );
};

export const useListingEventPurchasedTicketsQuery = (
  params?: EventsApiListingEventPurchasedTicketsRequest,
) => {
  params = toCamelCase(params);
  const api = useApi();
  return useQuery({
    queryKey: ['listing-event-purchased-tickets', params],
    queryFn: async () => await api.events.listingEventPurchasedTickets(params),
  });
};
