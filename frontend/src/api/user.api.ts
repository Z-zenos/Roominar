import type { SWRMutationConfiguration } from 'swr/dist/mutation';
import type {
  GetMeResponse,
  UsersApiUpdateAudienceRequest,
} from '../lib/api/generated';
import useSWRMutation from 'swr/mutation';
import useApi from '../lib/api/useApi';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

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

export const useListingNotificationsInfiniteQuery = (enabled = false) => {
  const api = useApi();

  return useInfiniteQuery({
    initialPageParam: 1,
    queryKey: ['listing-notifications'],
    queryFn: async ({ pageParam = 1 }) => {
      return await api.users.listingNotifications({
        page: pageParam,
      });
    },
    getNextPageParam: (response) => {
      const { page, total } = response || {};
      return page < total ? page + 1 : undefined;
    },
    enabled,
    staleTime: 1000 * 60 * 5,
    // select: (data) => {
    //   return {
    //     ...data,
    //     pages: data.pages.map((page) => ({
    //       ...page,
    //       data: page.data.map((notification) => ({
    //         ...notification,
    //         createdAt: new Date(notification.createdAt),
    //       })),
    //     })),
    //   };
    // },
  });
};

export const useGetTotalUnreadNotificationsQuery = () => {
  const api = useApi();
  return useQuery({
    queryKey: ['total-unread-notifications'],
    queryFn: async () => await api.users.getTotalUnreadNotifications(),
  });
};
