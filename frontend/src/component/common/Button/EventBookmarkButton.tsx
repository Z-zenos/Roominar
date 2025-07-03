'use client';

import {
  useCreateEventBookmarkMutation,
  useDeleteEventBookmarkMutation,
} from '@/src/api/event.api';
import { RoleCode } from '@/src/constants/role_code.constant';
import { styles } from '@/src/constants/styles.constant';
import { handleApiError } from '@/src/utils/app.util';

import { Button } from '@nextui-org/button';
import clsx from 'clsx';
import { useSession } from 'next-auth/react';
import { useRef, useState } from 'react';
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
  const { data: auth, status } = useSession();
  const [bookmark, setBookmark] = useState<boolean>(isBookmarked);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

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

  const handleBookmarkClick = () => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      if (
        status === 'authenticated' &&
        auth?.user?.roleCode === RoleCode.AUDIENCE
      ) {
        bookmark
          ? deleteEventBookmark({ eventId })
          : createEventBookmark({ eventId });
      }
    }, 300); // 300ms debounce delay
  };

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
                  Bạn cần <b>đăng nhập</b> để bookmark sự kiện này.
                </span>
                <IoMdLogIn size={16} />
              </span>
            ),
            {
              icon: '⚠️',
            },
          );
        } else {
          handleBookmarkClick();
        }
      }}
      isDisabled={isDisabled}
    >
      {bookmark ? <IoBookmark size={16} /> : <IoBookmarkOutline size={16} />}
    </Button>
  );
}

export default EventBookmarkButton;
