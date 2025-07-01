import React, { useState } from 'react';
import ConfirmDialog from '../Dialog/ConfirmDialog';
import { Image, Spinner, useDisclosure } from '@nextui-org/react';
import {
  VoteTypeCode,
  type ListingEventCommentsItem,
} from '@/src/lib/api/generated';
import { useSession } from 'next-auth/react';
import CommentInput from '../Input/CommentInput';
import { handleApiError, timeAgo } from '@/src/utils/app.util';
import {
  useDeleteCommentMutation,
  useListingCommentRepliesQuery,
  usePinCommentMutation,
  useReplyCommentMutation,
  useUnpinCommentMutation,
  useUpdateCommentMutation,
  useVoteCommentMutation,
} from '@/src/api/comment.api';
import { CiEdit } from 'react-icons/ci';
import { BsReplyAll } from 'react-icons/bs';
import {
  PiArrowFatDownThin,
  PiArrowFatUpThin,
  PiPlusCircleThin,
  PiTrashThin,
} from 'react-icons/pi';
import { toast } from 'react-hot-toast';
import clsx from 'clsx';
import { styles } from '@/src/constants/styles.constant';
import CommentReply from './CommentReply';
import type { CommentEventRequestSchema } from '@/src/schemas/event/CommentEventFormSchema';

interface CommentProps {
  comment: ListingEventCommentsItem;
}

export default function Comment({ comment }: CommentProps) {
  const { data: auth, status } = useSession();
  const [voteCount, setVoteCount] = useState(comment.voteCount);
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [userVote, setUserVote] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const {
    data: listingCommentRepliesData,
    isLoading: isLoadingListingCommentReplies,
    refetch: refetchListingCommentReplies,
  } = useListingCommentRepliesQuery(
    {
      commentId: comment.id,
    },
    false,
  );

  const { trigger: replyComment, isMutating: isReplyingComment } =
    useReplyCommentMutation({
      onSuccess() {},
      onError: handleApiError,
    });

  const { trigger: updateComment, isMutating: isUpdating } =
    useUpdateCommentMutation({
      onSuccess() {
        setIsEditing(false);
        refetchListingCommentReplies();
      },
      onError: handleApiError,
    });

  const { trigger: deleteComment, isMutating: isDeleting } =
    useDeleteCommentMutation({
      onSuccess() {
        setIsVisible(false);
      },
      onError: handleApiError,
    });

  const { trigger: pinComment } = usePinCommentMutation({
    onSuccess() {
      // setIsPinning(false);
    },
    onError: handleApiError,
  });

  const { trigger: unpinComment } = useUnpinCommentMutation({
    onSuccess() {
      // setIsUnpinning(false);
    },
    onError: handleApiError,
  });

  const { trigger: voteComment } = useVoteCommentMutation({
    onSuccess() {
      // setIsVoting(false);
    },
    onError: handleApiError,
  });

  const handleUpvote = () => {
    if (status !== 'authenticated') {
      toast.error('Vui lòng đăng nhập để bình chọn');
      return;
    }
    if (userVote === -1) return;
    if (userVote === 1) {
      setVoteCount(voteCount - 1);
      setUserVote(0);
    } else {
      setVoteCount(voteCount + 1);
      setUserVote(1);
    }
    voteComment({
      commentId: comment.id,
      voteCommentRequest: {
        voteType: VoteTypeCode.Upvote,
      },
    });
  };

  const handleDownvote = () => {
    if (status !== 'authenticated') {
      toast.error('Vui lòng đăng nhập để bình chọn');
      return;
    }
    if (userVote === 1) return;
    if (userVote === -1) {
      setVoteCount(voteCount + 1);
      setUserVote(0);
    } else {
      setVoteCount(voteCount - 1);
      setUserVote(-1);
    }
    voteComment({
      commentId: comment.id,
      voteCommentRequest: {
        voteType: VoteTypeCode.Downvote,
      },
    });
  };

  const handleDeleteComment = () => {
    if (status !== 'authenticated') {
      toast.error('Vui lòng đăng nhập để xóa bình luận');
      return;
    }
    deleteComment({ commentId: comment.id });
  };

  const handleEditComment = () => {
    setIsEditing(true);
  };

  const handleReplyComment = () => {
    refetchListingCommentReplies();
  };

  const handleOpenReplyInput = () => {
    setIsReplying(!isReplying);
  };

  const handleUpdateComment = (data: CommentEventRequestSchema) => {
    updateComment({
      commentId: comment.id,
      updateEventCommentRequest: {
        content: data.content,
      },
    });
  };

  return (
    <>
      {isVisible && (
        <div className='mb-7'>
          <div className='flex flex-col bg-White px-4 rounded-lg w-full min-h-[7rem] space-y-3 relative'>
            <div className='md:order-2 '>
              <div className='flex justify-start items-center space-x-4'>
                <Image
                  src={comment.userAvatar}
                  width={35}
                  height={35}
                  alt='pfp'
                  classNames={{
                    img: 'rounded-full',
                  }}
                />
                {(comment.userId === auth?.user?.id && (
                  <div>
                    <span className='text-Dark-blue font-semibold text-sm'>
                      {comment.userName}
                    </span>
                    <span className='bg-primary px-1.5 rounded-sm ml-3 text-white text-ss'>
                      you
                    </span>
                  </div>
                )) || (
                  <span className='text-Dark-blue font-bold'>
                    {comment.userName}
                  </span>
                )}
                <span className='ml-3'>•</span>
                <span className='text-Grayish-Blue text-ss'>
                  {timeAgo(comment.createdAt)}
                </span>
              </div>

              <>
                {(!isEditing && (
                  <>
                    <p className='text-Grayish-Blue my-3 break-words font-light'>
                      {/* <span className='text-Moderate-blue font-bold'>{replyTag}</span>{' '} */}
                      {comment.content}
                    </p>
                    <div className='flex space-x-4'>
                      <div className='flex 450px:gap-4 gap-1 items-center justify-around space-x-4 md:space-x-0 mr-5 px-2 rounded-md'>
                        <PiArrowFatUpThin
                          className='cursor-pointer min-w-5 min-h-5 hover:text-green-500'
                          onClick={handleUpvote}
                        />
                        <span className='py-2 md:py-0 text-primary font-semibold'>
                          {voteCount ?? 0}
                        </span>
                        <PiArrowFatDownThin
                          className='cursor-pointer min-w-5 min-h-5 hover:text-red-500'
                          onClick={handleDownvote}
                        />
                      </div>
                      {comment.userId === auth?.user?.id && (
                        <PiTrashThin
                          className='cursor-pointer min-w-5 min-h-5'
                          onClick={onOpen}
                        />
                      )}
                      {comment.userId === auth?.user?.id && (
                        <CiEdit
                          className='cursor-pointer min-w-5 min-h-5'
                          onClick={handleEditComment}
                        />
                      )}
                      <span className={clsx(styles.flexStart, 'gap-2')}>
                        <BsReplyAll
                          className='cursor-pointer min-w-5 min-h-5'
                          onClick={handleOpenReplyInput}
                        />
                      </span>
                    </div>
                  </>
                )) || (
                  <CommentInput
                    onSubmit={handleUpdateComment}
                    isLoading={isUpdating}
                    defaultContent={comment.content}
                    isUpdate={true}
                    onCancel={() => setIsEditing(false)}
                  />
                )}
              </>
            </div>
          </div>
          {comment.replyCount > 0 && (
            <span
              className='font-light text-sm mb-8 hover:underline cursor-pointer flex items-center gap-2'
              onClick={handleReplyComment}
            >
              <span className=' ml-3 w-7 h-3 border-b border-b-gray-300 border-l border-l-gray-300'></span>
              <PiPlusCircleThin className='w-6 h-6' /> {comment.replyCount} phản
              hồi
            </span>
          )}
          <div className='ml-10'>
            {isLoadingListingCommentReplies && (
              <div className='flex justify-center items-center'>
                <Spinner />
              </div>
            )}

            {!isLoadingListingCommentReplies &&
              listingCommentRepliesData?.data.map((reply) => (
                <CommentReply
                  key={reply.id}
                  commentId={comment.id}
                  reply={reply}
                  refetch={refetchListingCommentReplies}
                />
              ))}
          </div>
          {isReplying && (
            <CommentInput
              onSubmit={(data) => {
                replyComment({
                  commentId: comment.id,
                  createCommentReplyRequest: {
                    content: data.content,
                  },
                });
              }}
              isLoading={isReplyingComment}
            />
          )}
        </div>
      )}

      <ConfirmDialog
        content={<p>Bạn có chắc chắn muốn xóa bình luận này không?</p>}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onConfirm={handleDeleteComment}
        confirmLabel='Xóa'
      />
    </>
  );
}
