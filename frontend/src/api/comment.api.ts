import type { SWRMutationConfiguration } from 'swr/mutation';
import useSWRMutation from 'swr/mutation';
import type {
  CommentsApiDeleteCommentReplyRequest,
  CommentsApiDeleteCommentRequest,
  CommentsApiListingCommentRepliesRequest,
  CommentsApiPinCommentRequest,
  CommentsApiUnpinCommentRequest,
  CommentsApiReplyCommentRequest,
  CommentsApiUpdateCommentReplyRequest,
  CommentsApiUpdateCommentRequest,
  CommentsApiVoteCommentRequest,
  EventsApiCommentEventRequest,
  EventsApiListingEventCommentsRequest,
} from '../lib/api/generated/types/ObjectParamAPI';
import useApi from '../lib/api/useApi';
import { toCamelCase } from '../utils/app.util';
import { useQuery } from '@tanstack/react-query';

export const useListingEventCommentsQuery = (
  params?: EventsApiListingEventCommentsRequest,
) => {
  params = toCamelCase(params);
  const api = useApi();
  return useQuery({
    queryKey: ['listing-event-comments', params],
    queryFn: async () => await api.events.listingEventComments(params),
  });
};

export const useCommentEventMutation = <T>(
  options?: SWRMutationConfiguration<number, T>,
) => {
  const api = useApi();
  const key = 'comment-event';
  return useSWRMutation<number, T, typeof key, EventsApiCommentEventRequest>(
    key,
    async (_: string, { arg }) => await api.events.commentEvent(arg),
    options,
  );
};

export const useUpdateCommentMutation = <T>(
  options?: SWRMutationConfiguration<number, T>,
) => {
  const api = useApi();
  const key = 'update-comment';
  return useSWRMutation<number, T, typeof key, CommentsApiUpdateCommentRequest>(
    key,
    async (_: string, { arg }) => await api.comments.updateComment(arg),
    options,
  );
};

export const useDeleteCommentMutation = <T>(
  options?: SWRMutationConfiguration<void, T>,
) => {
  const api = useApi();
  const key = 'delete-comment';
  return useSWRMutation<void, T, typeof key, CommentsApiDeleteCommentRequest>(
    key,
    async (_: string, { arg }) => await api.comments.deleteComment(arg),
    options,
  );
};

export const useListingCommentRepliesQuery = (
  params?: CommentsApiListingCommentRepliesRequest,
  enabled?: boolean,
) => {
  params = toCamelCase(params);
  const api = useApi();
  return useQuery({
    queryKey: ['listing-comment-replies', params],
    queryFn: async () => await api.comments.listingCommentReplies(params),
    enabled,
  });
};

export const useReplyCommentMutation = <T>(
  options?: SWRMutationConfiguration<number, T>,
) => {
  const api = useApi();
  const key = 'reply-comment';
  return useSWRMutation<number, T, typeof key, CommentsApiReplyCommentRequest>(
    key,
    async (_: string, { arg }) => await api.comments.replyComment(arg),
    options,
  );
};

export const useUpdateCommentReplyMutation = <T>(
  options?: SWRMutationConfiguration<number, T>,
) => {
  const api = useApi();
  const key = 'update-comment-reply';
  return useSWRMutation<
    number,
    T,
    typeof key,
    CommentsApiUpdateCommentReplyRequest
  >(
    key,
    async (_: string, { arg }) => await api.comments.updateCommentReply(arg),
    options,
  );
};

export const useDeleteCommentReplyMutation = <T>(
  options?: SWRMutationConfiguration<void, T>,
) => {
  const api = useApi();
  const key = 'delete-comment-reply';
  return useSWRMutation<
    void,
    T,
    typeof key,
    CommentsApiDeleteCommentReplyRequest
  >(
    key,
    async (_: string, { arg }) => await api.comments.deleteCommentReply(arg),
    options,
  );
};

export const useVoteCommentMutation = <T>(
  options?: SWRMutationConfiguration<number, T>,
) => {
  const api = useApi();
  const key = 'vote-comment';
  return useSWRMutation<number, T, typeof key, CommentsApiVoteCommentRequest>(
    key,
    async (_: string, { arg }) => await api.comments.voteComment(arg),
    options,
  );
};

export const usePinCommentMutation = <T>(
  options?: SWRMutationConfiguration<number, T>,
) => {
  const api = useApi();
  const key = 'pin-comment';
  return useSWRMutation<number, T, typeof key, CommentsApiPinCommentRequest>(
    key,
    async (_: string, { arg }) => await api.comments.pinComment(arg),
    options,
  );
};

export const useUnpinCommentMutation = <T>(
  options?: SWRMutationConfiguration<void, T>,
) => {
  const api = useApi();
  const key = 'unpin-comment';
  return useSWRMutation<void, T, typeof key, CommentsApiUnpinCommentRequest>(
    key,
    async (_: string, { arg }) => await api.comments.unpinComment(arg),
    options,
  );
};
