import useApi from '../lib/api/useApi';

import { useQuery } from '@tanstack/react-query';

export const useListingRandomSpeakersQuery = () => {
  const api = useApi();
  return useQuery({
    queryKey: ['listing-random-speakers'],
    queryFn: async () => await api.speakers.listingRandomSpeakers(),
  });
};
