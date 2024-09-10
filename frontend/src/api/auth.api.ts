import type {
  AuthApiForgotPasswordRequest,
  AuthApiResetPasswordRequest,
  ForgotPasswordResponse,
  RegisterAudienceResponse,
  AuthApiRegisterAudienceRequest,
  VerifyAudienceResponse,
  AuthApiVerifyAudienceRequest,
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

export const useResetPasswordMutation = <T>(
  options?: SWRMutationConfiguration<void, T>,
) => {
  const api = useApi();
  const key = 'reset-password';
  return useSWRMutation<void, T, typeof key, AuthApiResetPasswordRequest>(
    key,
    async (_: string, { arg }) => await api.auth.resetPassword(arg),
    options,
  );
};

export const useRegisterAudienceMutation = <T>(
  options?: SWRMutationConfiguration<RegisterAudienceResponse, T>,
) => {
  const api = useApi();
  const key = 'register-audience';
  return useSWRMutation<
    RegisterAudienceResponse,
    T,
    typeof key,
    AuthApiRegisterAudienceRequest
  >(
    key,
    async (_: string, { arg }) => await api.auth.registerAudience(arg),
    options,
  );
};

export const useVerifyAudienceMutation = <T>(
  options?: SWRMutationConfiguration<VerifyAudienceResponse, T>,
) => {
  const api = useApi();
  const key = `/api/v1/users/verify`;
  return useSWRMutation<
    VerifyAudienceResponse,
    T,
    typeof key,
    AuthApiVerifyAudienceRequest
  >(
    key,
    async (_: string, { arg }) => await api.auth.verifyAudience(arg),
    options,
  );
};
