'use client';

import {
  useCreateOrganizationFollowMutation,
  useDeleteOrganizationFollowMutation,
} from '@/src/api/organization.api';
import { RoleCode } from '@/src/constants/role_code.constant';
import { styles } from '@/src/constants/styles.constant';
import { handleApiError } from '@/src/utils/app.util';

import { Button } from '@nextui-org/react';
import clsx from 'clsx';
import { useSession } from 'next-auth/react';
import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { IoMdLogIn } from 'react-icons/io';

interface OrganizationFollowButtonProps {
  organizationId: number;
  isFollowed: boolean;
  isDisabled?: boolean;
  onFollowChange?: (isFollowed: boolean) => void;
}

export default function OrganizationFollowButton({
  organizationId,
  isFollowed,
  isDisabled = false,
  onFollowChange,
}: OrganizationFollowButtonProps) {
  const { data: auth, status } = useSession();

  const [follow, setFollow] = useState<boolean>(isFollowed);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const { trigger: createOrganizationFollow } =
    useCreateOrganizationFollowMutation({
      onSuccess() {
        setFollow(true);
        if (onFollowChange) {
          onFollowChange(true);
        }
      },
      onError: handleApiError,
    });

  const { trigger: deleteOrganizationFollow } =
    useDeleteOrganizationFollowMutation({
      onSuccess() {
        setFollow(false);
        if (onFollowChange) {
          onFollowChange(false);
        }
      },
      onError: handleApiError,
    });

  const handleFollowClick = () => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      if (
        status === 'authenticated' &&
        auth?.user?.roleCode === RoleCode.AUDIENCE
      ) {
        follow
          ? deleteOrganizationFollow({ organizationId })
          : createOrganizationFollow({ organizationId });
      }
    }, 300); // 300ms debounce delay
  };

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
        } else {
          handleFollowClick();
        }
      }}
      isDisabled={isDisabled}
    >
      {follow ? 'Huỷ theo dõi' : 'Theo dõi'}
    </Button>
  );
}
