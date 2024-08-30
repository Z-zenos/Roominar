import type { ApplicationsApiCreateApplicationRequest } from '../lib/api/generated';
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
