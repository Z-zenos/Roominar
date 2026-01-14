import React, { useState } from 'react';
import ConfirmDialog from '../Dialog/ConfirmDialog';
import { Image, useDisclosure } from '@nextui-org/react';
import { type ListingCommentRepliesItem } from '@/src/lib/api/generated';
import { useSession } from 'next-auth/react';
import CommentInput from '../Input/CommentInput';
import { handleApiError, timeAgo } from '@/src/utils/app.util';
import {
  useReplyCommentMutation,
  useUpdateCommentReplyMutation,
  useDeleteCommentReplyMutation,
} from '@/src/api/comment.api';
import { CiEdit } from 'react-icons/ci';
import { BsReplyAll } from 'react-icons/bs';
import { PiTrashThin } from 'react-icons/pi';
import { toast } from 'react-hot-toast';
import clsx from 'clsx';
import { styles } from '@/src/constants/styles.constant';
import type { CommentEventRequestSchema } from '@/src/schemas/event/CommentEventFormSchema';

interface CommentReplyProps {
  commentId: number;
  reply: ListingCommentRepliesItem;
  refetch: () => void;
}

export default function CommentReply({
  commentId,
  reply,
  refetch,
}: CommentReplyProps) {
  const { data: auth, status } = useSession();
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [content, setContent] = useState(reply.content);

  const { trigger: replyComment, isMutating: isReplyingComment } =
    useReplyCommentMutation({
      onSuccess() {
        setIsReplying(false);
        refetch();
      },
      onError: handleApiError,
    });

  const { trigger: updateCommentReply, isMutating: isUpdating } =
    useUpdateCommentReplyMutation({
      onSuccess() {
        setIsEditing(false);
        refetch();
      },
      onError: handleApiError,
    });

  const { trigger: deleteCommentReply } = useDeleteCommentReplyMutation({
    onSuccess() {
      setIsVisible(false);
      refetch();
      onClose();
    },
    onError: handleApiError,
  });

  const handleDeleteComment = () => {
    if (status !== 'authenticated') {
      toast.error('Vui lòng đăng nhập để xóa bình luận');
      return;
    }
    deleteCommentReply({ replyId: reply.id });
  };

  const handleEditComment = (data: CommentEventRequestSchema) => {
    updateCommentReply({
      replyId: reply.id,
      updateCommentReplyRequest: {
        content: data.content,
      },
    });
  };

  const handleReplyComment = () => {
    setIsReplying(!isReplying);
  };

  return (
    <>
      {isVisible && (
        <div>
          <div className='flex flex-col bg-White px-4 rounded-lg w-full min-h-[9rem] space-y-3 relative'>
            <div className='md:order-2 '>
              <div className='flex justify-start items-center space-x-4'>
                <Image
                  src={reply.userAvatar}
                  width={35}
                  height={35}
                  alt='pfp'
                  classNames={{
                    img: 'rounded-full',
                  }}
                />
                {(reply.userId === auth?.user?.id && (
                  <div>
                    <span className='text-Dark-blue font-semibold text-sm'>
                      {reply.userName}
                    </span>
                    <span className='bg-primary px-1.5 rounded-sm mx-3 text-white'>
                      you
                    </span>
                  </div>
                )) || (
                  <span className='text-Dark-blue font-bold'>
                    {reply.userName}
                  </span>
                )}
                <span className='ml-3'>•</span>
                <span className='text-Grayish-Blue text-ss'>
                  {timeAgo(reply.createdAt)}
                </span>
              </div>

              <>
                {(!isEditing && (
                  <>
                    <p className='text-Grayish-Blue my-3 break-words font-light'>
                      {/* <span className='text-Moderate-blue font-bold'>{replyTag}</span>{' '} */}
                      {reply.content}
                    </p>
                    <div className='flex space-x-4'>
                      {reply.userId === auth?.user?.id && (
                        <PiTrashThin
                          className='cursor-pointer min-w-5 min-h-5'
                          onClick={onOpen}
                        />
                      )}
                      {reply.userId === auth?.user?.id && (
                        <CiEdit
                          className='cursor-pointer min-w-5 min-h-5'
                          onClick={() => setIsEditing(true)}
                        />
                      )}
                      <span
                        className={clsx(
                          styles.flexStart,
                          'gap-2 cursor-pointer',
                        )}
                        onClick={handleReplyComment}
                      >
                        <span className='font-light text-ss'>phản hồi</span>
                        <BsReplyAll className='cursor-pointer min-w-5 min-h-5' />
                      </span>
                    </div>
                  </>
                )) || (
                  <CommentInput
                    onSubmit={handleEditComment}
                    isLoading={isUpdating}
                    defaultContent={content}
                    isUpdate={true}
                    onCancel={() => setIsEditing(false)}
                  />
                )}
              </>
            </div>
          </div>

          {isReplying && (
            <CommentInput
              onSubmit={(data) => {
                setContent(data.content);
                replyComment({
                  commentId: commentId,
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
