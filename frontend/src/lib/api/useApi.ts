import { useMemo } from 'react';
import useApiConfig from './useConfigApi';
import {
  ApplicationsApi,
  AuthApi,
  EventsApi,
  TagsApi,
  UsersApi,
} from '@/src/lib/api/generated';

function useApi() {
  const config = useMemo(() => useApiConfig, [])();
  return {
    auth: new AuthApi(config),
    events: new EventsApi(config),
    users: new UsersApi(config),
    tags: new TagsApi(config),
    applications: new ApplicationsApi(config),
  };
}

export default useApi;
