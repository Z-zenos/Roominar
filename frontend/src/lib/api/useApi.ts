import { useMemo } from 'react';
import useApiConfig from './useConfigApi';
import { AuthApi, EventsApi, UsersApi } from '@/src/lib/api/generated';

function useApi() {
  const config = useMemo(() => useApiConfig, [])();
  return {
    auth: new AuthApi(config),
    events: new EventsApi(config),
    users: new UsersApi(config),
  };
}

export default useApi;
