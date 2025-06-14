'use client';

import {
  useCreateEventBookmarkMutation,
  useDeleteEventBookmarkMutation,
} from '@/src/api/event.api';
import { styles } from '@/src/constants/styles.constant';
import { handleApiError } from '@/src/utils/app.util';

import { Button } from '@nextui-org/button';
import clsx from 'clsx';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { IoMdLogIn } from 'react-icons/io';
import { IoBookmarkOutline, IoBookmark } from 'react-icons/io5';

interface EventBookmarkButtonProps {
  eventId: number;
  isBookmarked: boolean;
  isDisabled?: boolean;
}

function EventBookmarkButton({
  eventId,
  isBookmarked,
  isDisabled = false,
}: EventBookmarkButtonProps) {
  const { status } = useSession();
  const [bookmark, setBookmark] = useState<boolean>(isBookmarked);

  const { trigger: createEventBookmark } = useCreateEventBookmarkMutation({
    onSuccess() {
      setBookmark(true);
    },
    onError: handleApiError,
  });

  const { trigger: deleteEventBookmark } = useDeleteEventBookmarkMutation({
    onSuccess() {
      setBookmark(false);
    },
    onError: handleApiError,
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
          bookmark
            ? deleteEventBookmark({ eventId })
            : createEventBookmark({ eventId });
        }
      }}
      isDisabled={isDisabled}
    >
      {bookmark ? <IoBookmark size={16} /> : <IoBookmarkOutline size={16} />}
    </Button>
  );
}

export default EventBookmarkButton;
