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
import { Button, Spinner } from '@nextui-org/react';
import { useState, useEffect } from 'react';

interface EventCommentProps {
  eventId: number;
}

export default function EventComment({ eventId }: EventCommentProps) {
  const [page, setPage] = useState(1);
  const [comments, setComments] = useState([]);
  const [isLoadAllComments, setIsLoadAllComments] = useState(false);

  const {
    data: commentsData,
    isLoading: isLoadingComments,
    isPending: isFetchingComments,
    refetch: refetchListingEventComments,
  } = useListingEventCommentsQuery({ eventId, page });

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

  useEffect(() => {
    if (commentsData?.data) {
      setComments((prevComments) => [...prevComments, ...commentsData.data]);
    }
    if (commentsData?.data?.length === 0) {
      setIsLoadAllComments(true);
    } else {
      setIsLoadAllComments(false);
    }
  }, [commentsData]);

  function handleCommentEvent(data: CommentEventRequestSchema) {
    commentEvent({
      eventId,
      commentEventRequest: {
        content: data.content,
      },
    });
  }

  function handleLoadMoreComments() {
    setPage((prevPage) => prevPage + 1);
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
          comments.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
            />
          ))}

        {!isLoadAllComments ||
          (comments.length >= 10 && (
            <Button
              isLoading={isFetchingComments}
              color='primary'
              className='mx-auto'
              onClick={handleLoadMoreComments}
              disabled={isFetchingComments}
            >
              Tải thêm bình luận
            </Button>
          ))}
      </section>
    </main>
  );
}
