import type {
  AuthApiForgotPasswordRequest,
  AuthApiResetPasswordRequest,
  ForgotPasswordResponse,
  RegisterAudienceResponse,
  AuthApiRegisterAudienceRequest,
  AuthApiVerifyAudienceRequest,
  RequestChangeEmailResponse,
  AuthApiRequestChangeEmailRequest,
  AuthApiChangePasswordRequest,
  AuthApiVerifyChangeEmailRequest,
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
  options?: SWRMutationConfiguration<number, T>,
) => {
  const api = useApi();
  const key = `verify-user`;
  return useSWRMutation<number, T, typeof key, AuthApiVerifyAudienceRequest>(
    key,
    async (_: string, { arg }) => await api.auth.verifyAudience(arg),
    options,
  );
};

export const useRequestChangeEmailMutation = <T>(
  options?: SWRMutationConfiguration<RequestChangeEmailResponse, T>,
) => {
  const api = useApi();
  const key = `request-change-email`;
  return useSWRMutation<
    RequestChangeEmailResponse,
    T,
    typeof key,
    AuthApiRequestChangeEmailRequest
  >(
    key,
    async (_: string, { arg }) => await api.auth.requestChangeEmail(arg),
    options,
  );
};

export const useChangePasswordMutation = <T>(
  options?: SWRMutationConfiguration<void, T>,
) => {
  const api = useApi();
  const key = `change-password`;
  return useSWRMutation<void, T, typeof key, AuthApiChangePasswordRequest>(
    key,
    async (_: string, { arg }) => await api.auth.changePassword(arg),
    options,
  );
};

export const useVerifyChangeEmailMutation = <T>(
  options?: SWRMutationConfiguration<void, T>,
) => {
  const api = useApi();
  const key = `verify-change-email`;
  return useSWRMutation<void, T, typeof key, AuthApiVerifyChangeEmailRequest>(
    key,
    async (_: string, { arg }) => await api.auth.verifyChangeEmail(arg),
    options,
  );
};
