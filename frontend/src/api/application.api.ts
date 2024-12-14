import type {
  ApplicationsApiCancelApplicationRequest,
  ApplicationsApiCreateApplicationCheckoutSessionRequest,
  CreateApplicationCheckoutSessionResponse,
} from '../lib/api/generated';
import useApi from '../lib/api/useApi';
import type { SWRMutationConfiguration } from 'swr/mutation';
import useSWRMutation from 'swr/mutation';

export const useCancelEventApplicationMutation = <T>(
  options?: SWRMutationConfiguration<void, T>,
) => {
  const api = useApi();
  const key = 'cancel-event-application';
  return useSWRMutation<
    void,
    T,
    typeof key,
    ApplicationsApiCancelApplicationRequest
  >(
    key,
    async (_: string, { arg }) => await api.applications.cancelApplication(arg),
    options,
  );
};

export const useCreateApplicationCheckoutSessionMutation = <T>(
  options?: SWRMutationConfiguration<
    CreateApplicationCheckoutSessionResponse,
    T
  >,
) => {
  const api = useApi();
  const key = `create-application-checkout-session`;
  return useSWRMutation<
    CreateApplicationCheckoutSessionResponse,
    T,
    typeof key,
    ApplicationsApiCreateApplicationCheckoutSessionRequest
  >(
    key,
    async (_: string, { arg }) =>
      await api.applications.createApplicationCheckoutSession(arg),
    options,
  );
};
