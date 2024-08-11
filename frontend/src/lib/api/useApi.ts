import { useMemo } from 'react';
import useApiConfig from './useConfigApi';
import { AuthApi, PatientsApi } from '@/src/lib/api/generated';

function useApi() {
  const config = useMemo(() => useApiConfig, [])();
  return {
    auth: new AuthApi(config),
    patient: new PatientsApi(config),
  };
}

export default useApi;
