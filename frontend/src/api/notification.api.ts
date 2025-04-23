import type { SWRMutationConfiguration } from 'swr/dist/mutation';
import useSWRMutation from 'swr/mutation';
import useApi from '../lib/api/useApi';
import type { AuthApiLogoutRequest } from '../lib/api/generated';
import {
  type NotificationsApiRegisterNotificationDeviceTokenRequest,
  type RegisterNotificationDeviceTokenResponse,
} from '../lib/api/generated';

export const useRegisterNotificationDeviceTokenMutation = <T>(
  options?: SWRMutationConfiguration<
    RegisterNotificationDeviceTokenResponse,
    T
  >,
) => {
  const api = useApi();
  const key = 'register-notification-device-token';

  return useSWRMutation<
    RegisterNotificationDeviceTokenResponse,
    T,
    typeof key,
    NotificationsApiRegisterNotificationDeviceTokenRequest
  >(
    key,
    async (_: string, { arg }) =>
      await api.notifications.registerNotificationDeviceToken(arg),
    options,
  );
};

export const useRemoveNotificationDeviceTokenMutation = <T>(
  options?: SWRMutationConfiguration<void, T>,
) => {
  const api = useApi();
  const key = 'remove-notification-device-token';

  return useSWRMutation<void, T, typeof key, AuthApiLogoutRequest>(
    key,
    async (_: string, { arg }) => await api.auth.logout(arg),
    options,
  );
};
