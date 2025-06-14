'use client';

import {
  useCreateOrganizationFollowMutation,
  useDeleteOrganizationFollowMutation,
} from '@/src/api/organization.api';
import { styles } from '@/src/constants/styles.constant';
import { handleApiError } from '@/src/utils/app.util';

import { Button } from '@nextui-org/react';
import clsx from 'clsx';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { IoMdLogIn } from 'react-icons/io';

interface OrganizationFollowButtonProps {
  organizationId: number;
  isFollowed: boolean;
  isDisabled?: boolean;
}

export default function OrganizationFollowButton({
  organizationId,
  isFollowed,
  isDisabled = false,
}: OrganizationFollowButtonProps) {
  const { status } = useSession();
  const [follow, setFollow] = useState<boolean>(isFollowed);

  const { trigger: createOrganizationFollow } =
    useCreateOrganizationFollowMutation({
      onSuccess() {
        setFollow(true);
      },
      onError: handleApiError,
    });

  const { trigger: deleteOrganizationFollow } =
    useDeleteOrganizationFollowMutation({
      onSuccess() {
        setFollow(false);
      },
      onError: handleApiError,
    });

  return (
    <Button
      className={
        follow ? 'bg-transparent text-foreground border-default-200' : ''
      }
      color='primary'
      radius='full'
      size='sm'
      variant={follow ? 'bordered' : 'solid'}
      onPress={() => {
        if (status === 'unauthenticated') {
          toast(
            () => (
              <span className={clsx(styles.between, 'gap-2')}>
                <span>
                  Bạn cần <b>đăng nhập</b> để theo dõi.
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
          follow
            ? deleteOrganizationFollow({ organizationId })
            : createOrganizationFollow({ organizationId });
        }
      }}
      isDisabled={isDisabled}
    >
      {follow ? 'Huỷ theo dõi' : 'Theo dõi'}
    </Button>
  );
}
