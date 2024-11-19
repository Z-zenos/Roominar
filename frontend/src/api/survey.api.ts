import type { SWRMutationConfiguration } from 'swr/mutation';
import useSWRMutation from 'swr/mutation';
import useApi from '../lib/api/useApi';
import type { SurveysApiCreateSurveyRequest } from '../lib/api/generated';
import { useQuery } from '@tanstack/react-query';

export const useCreateSurveyMutation = <T>(
  options?: SWRMutationConfiguration<number, T>,
) => {
  const api = useApi();
  const key = 'create-survey';
  return useSWRMutation<number, T, typeof key, SurveysApiCreateSurveyRequest>(
    key,
    async (_: string, { arg }) => await api.surveys.createSurvey(arg),
    options,
  );
};

export const useListingSurveyOptionsQuery = () => {
  const api = useApi();
  return useQuery({
    queryKey: ['listing-survey-options'],
    queryFn: async () => await api.surveys.listingSurveyOptions(),
  });
};
