import type {
  RegisterAudienceResponse,
  UsersApiRegisterAudienceRequest,
  UsersApiVerifyAudienceRequest,
  VerifyAudienceResponse,
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

export const useVerifyAudienceMutation = <T>(options?: SWRMutationConfiguration<VerifyAudienceResponse, T>) => {
  const api = useApi();
  const key = `/api/v1/users/verify`;
  return useSWRMutation<VerifyAudienceResponse, T, typeof key, UsersApiVerifyAudienceRequest>(
    key,
    async (_: string, { arg }) => await api.users.verifyAudience(arg),
    options,
  );
};
