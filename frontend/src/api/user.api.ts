import { useQuery } from '@tanstack/react-query';
import type {
  RegisterAudienceResponse,
  UsersApiRegisterAudienceRequest,
  UsersApiVerifyRegisterAudienceRequest,
} from '../lib/api/generated';
import useApi from '../lib/api/useApi';
import type { SWRMutationConfiguration } from 'swr/mutation';
import useSWRMutation from 'swr/mutation';

export const useRegisterAudienceMutation = <T>(options?: SWRMutationConfiguration<RegisterAudienceResponse, T>) => {
  const api = useApi();
  const key = `/api/v1/users/register`;
  return useSWRMutation<RegisterAudienceResponse, T, typeof key, UsersApiRegisterAudienceRequest>(
    key,
    async (_: string, { arg }) => await api.users.registerAudience(arg),
    options,
  );
};

export const useVerifyRegisterAudienceQuery = (params?: UsersApiVerifyRegisterAudienceRequest) => {
  const api = useApi();
  return useQuery({
    queryKey: ['verify-audience', params],
    queryFn: async () => await api.users.verifyRegisterAudience(params),
  });
};
