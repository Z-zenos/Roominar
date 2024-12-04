'use client';

import {
  useCreateOrganizationFollowMutation,
  useDeleteOrganizationFollowMutation,
} from '@/src/api/organization.api';
import { styles } from '@/src/constants/styles.constant';
import type { ApiException, ErrorResponse400 } from '@/src/lib/api/generated';
import { Button } from '@nextui-org/react';
import clsx from 'clsx';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { IoMdLogIn } from 'react-icons/io';

interface OrganizationFollowButtonProps {
  organizationId: number;
  isFollowed: boolean;
}

export default function OrganizationFollowButton({
  organizationId,
  isFollowed,
}: OrganizationFollowButtonProps) {
  const { status } = useSession();
  const [follow, setFollow] = useState<boolean>(isFollowed);

  const { trigger: createOrganizationFollow } =
    useCreateOrganizationFollowMutation({
      onSuccess() {
        setFollow(true);
      },
      onError(error: ApiException<unknown>) {
        toast.error(
          (error.body as ErrorResponse400)?.message ??
            (error.body as ErrorResponse400)?.errorCode ??
            'Unknown Error 😵',
        );
      },
    });

  const { trigger: deleteOrganizationFollow } =
    useDeleteOrganizationFollowMutation({
      onSuccess() {
        setFollow(false);
      },
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
                  You need to <b>login</b> for follow
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
    >
      {follow ? 'Unfollow' : 'Follow'}
    </Button>
  );
}
