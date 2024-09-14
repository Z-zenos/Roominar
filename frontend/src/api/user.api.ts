import type { SWRMutationConfiguration } from 'swr/dist/mutation';
import type {
  GetMeResponse,
  UsersApiUpdateAudienceRequest,
} from '../lib/api/generated';
import useSWRMutation from 'swr/mutation';
import useApi from '../lib/api/useApi';

export const useUpdateMyProfileMutation = <T>(
  options?: SWRMutationConfiguration<GetMeResponse, T>,
) => {
  const api = useApi();
  const key = 'register-audience';
  return useSWRMutation<
    GetMeResponse,
    T,
    typeof key,
    UsersApiUpdateAudienceRequest
  >(
    key,
    async (_: string, { arg }) => await api.users.updateAudience(arg),
    options,
  );
};
