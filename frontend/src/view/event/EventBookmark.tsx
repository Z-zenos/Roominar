'use client';

import {
  useCreateEventBookmarkMutation,
  useDeleteEventBookmarkMutation,
} from '@/src/api/event.api';
import { styles } from '@/src/constant/styles.constant';
import type { ApiException, ErrorResponse400 } from '@/src/lib/api/generated';
import { Button } from '@nextui-org/button';
import clsx from 'clsx';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { IoMdLogIn } from 'react-icons/io';
import { IoBookmarkOutline, IoBookmark } from 'react-icons/io5';

interface EventBookmarkProps {
  eventId: number;
  isBookmarked: boolean;
}

function EventBookmark({ eventId, isBookmarked }: EventBookmarkProps) {
  const { status } = useSession();

  const { trigger: createEventBookmark, isMutating: isCreating } =
    useCreateEventBookmarkMutation({
      onError(error: ApiException<unknown>) {
        toast.error(
          (error.body as ErrorResponse400)?.message ??
            (error.body as ErrorResponse400)?.errorCode ??
            'Unknown Error 😵',
        );
      },
    });

  const { trigger: deleteEventBookmark, isMutating: isDeleting } =
    useDeleteEventBookmarkMutation({
      onError(error: ApiException<unknown>) {
        toast.error(
          (error.body as ErrorResponse400)?.message ??
            (error.body as ErrorResponse400)?.errorCode ??
            'Unknown Error 😵',
        );
      },
    });

  return (
    <Button
      isIconOnly
      color='primary'
      variant='flat'
      onClick={() => {
        if (status === 'unauthenticated') {
          toast(
            () => (
              <span className={clsx(styles.between, 'gap-2')}>
                <span>
                  You need to <b>login</b> for bookmark
                </span>
                <IoMdLogIn size={16} />
              </span>
            ),
            {
              icon: '⚠️',
            },
          );
        }
        if (status === 'authenticated') {
          isBookmarked
            ? deleteEventBookmark({ eventId })
            : createEventBookmark({ eventId });
        }
      }}
      isLoading={isBookmarked ? isDeleting : isCreating}
    >
      {isBookmarked ? (
        <IoBookmark size={16} />
      ) : (
        <IoBookmarkOutline size={16} />
      )}
    </Button>
  );
}

export default EventBookmark;
