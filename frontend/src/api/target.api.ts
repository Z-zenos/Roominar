import type { SWRMutationConfiguration } from 'swr/mutation';
import useSWRMutation from 'swr/mutation';
import useApi from '../lib/api/useApi';
import { useQuery } from '@tanstack/react-query';
import type { TargetsApiCreateTargetRequest } from '../lib/api/generated';

export const useCreateTargetMutation = <T>(
  options?: SWRMutationConfiguration<number, T>,
) => {
  const api = useApi();
  const key = 'create-target';
  return useSWRMutation<number, T, typeof key, TargetsApiCreateTargetRequest>(
    key,
    async (_: string, { arg }) => await api.targets.createTarget(arg),
    options,
  );
};

export const useListingTargetOptionsQuery = () => {
  const api = useApi();
  return useQuery({
    queryKey: ['listing-target-options'],
    queryFn: async () => await api.targets.listingTargetOptions(),
  });
};
