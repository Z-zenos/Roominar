import { useMemo } from 'react';
import useApiConfig from './useConfigApi';
import { AuthApi, EventsApi } from '@/src/lib/api/generated';

function useApi() {
  const config = useMemo(() => useApiConfig, [])();
  return {
    auth: new AuthApi(config),
    events: new EventsApi(config),
  };
}

export default useApi;
