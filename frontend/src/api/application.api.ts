import type {
  ApplicationsApiCreateCheckoutSessionRequest,
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
    ApplicationsApiCreateCheckoutSessionRequest
  >(
    key,
    async (_: string, { arg }) =>
      await api.applications.createCheckoutSession(arg),
    options,
  );
};

export const useCreateFreeApplicationMutation = <T>(
  options?: SWRMutationConfiguration<number, T>,
) => {
  const api = useApi();
  const key = 'create-free-application';
  return useSWRMutation<
    number,
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
