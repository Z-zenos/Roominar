import type {
  ApplicationsApiCancelApplicationRequest,
  ApplicationsApiCreateApplicationCheckoutSessionRequest,
  ApplicationsApiCreateApplicationRequest,
  CreateApplicationCheckoutSessionResponse,
} from '../lib/api/generated';
import useApi from '../lib/api/useApi';
import type { SWRMutationConfiguration } from 'swr/mutation';
import useSWRMutation from 'swr/mutation';

export const useApplyEventMutation = <T>(
  options?: SWRMutationConfiguration<number, T>,
) => {
  const api = useApi();
  const key = `/api/v1/applications`;
  return useSWRMutation<
    number,
    T,
    typeof key,
    ApplicationsApiCreateApplicationRequest
  >(
    key,
    async (_: string, { arg }) => await api.applications.createApplication(arg),
    options,
  );
};

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
