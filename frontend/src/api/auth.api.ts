import { useQuery } from '@tanstack/react-query';
import useApi from '@/src/lib/api/useApi';
import type { SWRMutationConfiguration } from 'swr/mutation';
import useSWRMutation from 'swr/mutation';
import type { RegisterAudienceResponse, UsersApiRegisterAudienceRequest } from '../lib/api/generated';

export const useQueryGetProfile = () => {
  const api = useApi();
  return useQuery({
    queryKey: ['get-user-profile'],
    queryFn: async () => await api.auth.me(),
    enabled: true,
  });
};

export const useRegisterAudienceMutation = <T>(options?: SWRMutationConfiguration<RegisterAudienceResponse, T>) => {
  const api = useApi();
  const key = `/api/v1/users/verify`;
  return useSWRMutation<RegisterAudienceResponse, T, typeof key, UsersApiRegisterAudienceRequest>(
    key,
    async (_: string, { arg }) => await api.users.registerAudience(arg),
    options,
  );
};
