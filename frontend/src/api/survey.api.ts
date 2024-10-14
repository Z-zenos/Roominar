import type { SWRMutationConfiguration } from 'swr/mutation';
import useSWRMutation from 'swr/mutation';
import useApi from '../lib/api/useApi';

export const useCreateSurveyMutation = <T>(
  options?: SWRMutationConfiguration<number, T>,
) => {
  const api = useApi();
  const key = 'create-survey';
  return useSWRMutation<number, T, typeof key>(
    key,
    async (_: string, { arg }) => await api.surveys.createSurvey(arg),
    options,
  );
};
