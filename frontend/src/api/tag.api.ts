import { useQuery } from '@tanstack/react-query';
import useApi from '../lib/api/useApi';

export const useListingTagsQuery = () => {
  const api = useApi();
  return useQuery({
    queryKey: ['listing-tags'],
    queryFn: async () => await api.tags.listingTags(),
  });
};
