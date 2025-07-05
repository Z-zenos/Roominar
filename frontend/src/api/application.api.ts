import type {
  ApplicationsApiCreateApplicationCheckoutSessionRequest,
  ApplicationsApiCreateFreeApplicationRequest,
  CreateApplicationCheckoutSessionResponse,
} from '../lib/api/generated';
import useApi from '../lib/api/useApi';
import type { SWRMutationConfiguration } from 'swr/mutation';
import useSWRMutation from 'swr/mutation';

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

export const useCreateFreeApplicationMutation = <T>(
  options?: SWRMutationConfiguration<string, T>,
) => {
  const api = useApi();
  const key = 'create-free-application';
  return useSWRMutation<
    string,
    T,
    typeof key,
    ApplicationsApiCreateFreeApplicationRequest
  >(
    key,
    async (_: string, { arg }) =>
      await api.applications.createFreeApplication(arg),
    options,
  );
};
