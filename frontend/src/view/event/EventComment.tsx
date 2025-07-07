import {
  useCommentEventMutation,
  useListingEventCommentsQuery,
} from '@/src/api/comment.api';
import type { CommentEventRequestSchema } from '@/src/schemas/event/CommentEventFormSchema';
import { handleApiError } from '@/src/utils/app.util';
import CommentInput from '@/src/component/common/Input/CommentInput';
import Comment from '@/src/component/common/Comment/Comment';
import { Button, Spinner } from '@nextui-org/react';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface EventCommentProps {
  eventId: number;
}

export default function EventComment({ eventId }: EventCommentProps) {
  const [page, setPage] = useState(1);
  const [comments, setComments] = useState([]);
  const [isLoadAllComments, setIsLoadAllComments] = useState(false);

  const [commentId, setCommentId] = useState<number | null>(null);
  const [commentContent, setCommentContent] = useState<string | null>(null);
  const { data: auth } = useSession();

  const {
    data: commentsData,
    isLoading: isLoadingComments,
    isPending: isFetchingComments,
  } = useListingEventCommentsQuery({ eventId, page });

  const { trigger: commentEvent, isMutating: isCommenting } =
    useCommentEventMutation({
      onSuccess(commentId) {
        setCommentId(commentId);
      },
      onError: handleApiError,
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

  useEffect(() => {
    if (commentId) {
      setComments((prevComments) => [
        {
          id: commentId,
          content: commentContent,
          userId: auth?.user?.id,
          userName: auth?.user?.firstName + ' ' + auth?.user?.lastName,
          userAvatar: auth?.user?.avatarUrl,
          userRole: auth?.user?.roleCode,
          replyCount: 0,
          voteCount: 0,
          isPinned: false,
          voteType: null,
          deletedAt: null,
        },
        ...prevComments,
      ]);
    }
  }, [commentId]);

  function handleCommentEvent(data: CommentEventRequestSchema) {
    setCommentContent(data.content);
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
