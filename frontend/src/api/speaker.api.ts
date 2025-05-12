import type { SpeakersApiGetSpeakerDetailRequest } from '../lib/api/generated';
import useApi from '../lib/api/useApi';

import { useQuery } from '@tanstack/react-query';

export const useListingRandomSpeakersQuery = () => {
  const api = useApi();
  return useQuery({
    queryKey: ['listing-random-speakers'],
    queryFn: async () => await api.speakers.listingRandomSpeakers(),
  });
};

export const useGetSpeakerDetailQuery = (
  params?: SpeakersApiGetSpeakerDetailRequest,
) => {
  const api = useApi();
  return useQuery({
    queryKey: ['get-speaker-detail'],
    queryFn: async () => await api.speakers.getSpeakerDetail(params),
  });
};
