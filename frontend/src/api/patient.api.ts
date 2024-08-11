import { useQuery } from '@tanstack/react-query';
import useApi from '../lib/api/useApi';
import type { PatientsApiGetPatientInformationRequest } from '../lib/api/generated';

export const useQueryGetPatientInfo = (param?: PatientsApiGetPatientInformationRequest) => {
  const api = useApi();
  return useQuery({
    queryKey: ['get-patient-info', param],
    queryFn: async () => await api.patient.getPatientInformation(param),
    enabled: !!param?.incidentNo,
  });
};
