import {
  useCommentEventMutation,
  useListingEventCommentsQuery,
} from '@/src/api/comment.api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { CommentEventRequestSchema } from '@/src/schemas/event/CommentEventFormSchema';
import { commentEventRequestSchema } from '@/src/schemas/event/CommentEventFormSchema';
import { handleApiError } from '@/src/utils/app.util';
import CommentInput from '@/src/component/common/Input/CommentInput';
import Comment from '@/src/component/common/Comment/Comment';
import { Spinner } from '@nextui-org/react';

interface EventCommentProps {
  eventId: number;
}

export default function EventComment({ eventId }: EventCommentProps) {
  const {
    data: commentsData,
    isLoading: isLoadingComments,
    refetch: refetchListingEventComments,
  } = useListingEventCommentsQuery({ eventId });

  const { trigger: commentEvent, isMutating: isCommenting } =
    useCommentEventMutation({
      onSuccess() {
        form.reset();
        refetchListingEventComments();
      },
      onError: handleApiError,
    });

  const form = useForm<CommentEventRequestSchema>({
    resolver: zodResolver(commentEventRequestSchema),
    defaultValues: {
      content: '',
    },
  });

  function handleCommentEvent(data: CommentEventRequestSchema) {
    commentEvent({
      eventId,
      commentEventRequest: {
        content: data.content,
      },
    });
  }

  return (
    <main className='font-rubik'>
      <section className='flex flex-col '>
        <CommentInput
          onSubmit={handleCommentEvent}
          isLoading={isCommenting}
        />
        {isLoadingComments && (
          <div className='flex justify-center items-center'>
            <Spinner />
          </div>
        )}
        {!isLoadingComments &&
          commentsData?.data.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
            />
          ))}
      </section>
    </main>
  );
}
