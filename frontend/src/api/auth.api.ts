import type {
  AuthApiForgotPasswordRequest,
  ForgotPasswordResponse,
} from '../lib/api/generated';
import useApi from '../lib/api/useApi';
import type { SWRMutationConfiguration } from 'swr/mutation';
import useSWRMutation from 'swr/mutation';

export const useForgotPasswordMutation = <T>(
  options?: SWRMutationConfiguration<ForgotPasswordResponse, T>,
) => {
  const api = useApi();
  const key = 'forgot-password';
  return useSWRMutation<
    ForgotPasswordResponse,
    T,
    typeof key,
    AuthApiForgotPasswordRequest
  >(
    key,
    async (_: string, { arg }) => await api.auth.forgotPassword(arg),
    options,
  );
};
