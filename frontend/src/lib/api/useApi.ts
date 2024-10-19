import { useMemo } from 'react';
import useApiConfig from './useConfigApi';
import {
  ApplicationsApi,
  AuthApi,
  EventsApi,
  OrganizationsApi,
  SurveysApi,
  TagsApi,
  TargetsApi,
  TicketsApi,
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
    organizations: new OrganizationsApi(config),
    surveys: new SurveysApi(config),
    targets: new TargetsApi(config),
    tickets: new TicketsApi(config),
  };
}

export default useApi;
