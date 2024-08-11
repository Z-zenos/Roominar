import type { IRouter } from '@/src/type/app';

const createRouters = <T extends Record<string, IRouter>>(routers: T) => routers;

/*
- The value of property private is boolean or undefined
*/
const routers = createRouters({
  notFound: {
    router: '/not-found',
    pattern: '/not-found',
    private: false,
  },
  home: {
    router: '/',
    pattern: '/',
    private: true,
  },
  login: {
    router: '/login',
    pattern: '/login',
    private: false,
  },
  healthCheck: {
    router: '/health-check',
    pattern: '/health-check',
    private: false,
  },
  authenticatedSample: {
    router: '/authenticated_sample',
    pattern: '/authenticated_sample',
    private: true,
  },
  patients: {
    router: '/patients',
    pattern: '/patients',
    private: true,
  },
  patientInfo: {
    router: (id: string) => `/patients/${id}`,
    pattern: '/patients/:id',
    private: true,
  },
  injuryInfo: {
    router: '/injury-info',
    pattern: '/injury-info',
    private: true,
  },
  vital: {
    router: '/vital',
    pattern: '/vital',
    private: true,
  },
  treatmentInfo: {
    router: '/treatment-info',
    pattern: '/treatment-info',
    private: true,
  },
  bloodTransfusion: {
    router: '/blood-transfusion',
    pattern: '/blood-transfusion',
    private: true,
  },
  drugInfusion: {
    router: '/drug-infusion',
    pattern: '/drug-infusion',
    private: true,
  },
  triage: {
    router: '/triage',
    pattern: '/triage',
    private: true,
  },
  inputLog: {
    router: '/input-log',
    pattern: '/input-log',
    private: true,
  },
});

export default routers;
