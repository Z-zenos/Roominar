'use client';

import type {
  ListingRandomOrganizationsItem,
  TagItem,
} from '@/src/lib/api/generated';
import {
  Avatar,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Link,
} from '@nextui-org/react';
import clsx from 'clsx';
import OrganizationFollowButton from '../Button/OrganizationFollowButton';

export interface Organization extends ListingRandomOrganizationsItem {}

interface OrganizationCardProps {
  organization?: Organization;
  className?: string;
}

function OrganizationCard({ organization, className }: OrganizationCardProps) {
  return (
    <Card className={clsx('', className)}>
      <CardHeader className='justify-between'>
        <Link
          className='flex gap-3'
          href={`/organization/${organization?.slug}`}
        >
          <Avatar
            isBordered
            radius='full'
            size='md'
            src={organization?.avatarUrl}
          />
          <div className='flex flex-col gap-1 items-start justify-center'>
            <h4 className='text-small font-semibold leading-none text-default-600 hover:text-primary'>
              {organization?.name}
            </h4>
            {/* <h5 className='text-small tracking-tight text-default-400'>
              @zoeylang
            </h5> */}
          </div>
        </Link>
        <OrganizationFollowButton
          organizationId={organization.id}
          isFollowed={organization.isFollowed}
        />
      </CardHeader>
      <CardBody className='px-3 py-0 text-small text-default-400'>
        <p className='line-clamp-2 min-h-10 max-h-10'>
          {organization?.description}
        </p>
        <span className='pt-2 line-clamp-1'>
          {organization?.tags.slice(0, 2).map((tag: TagItem, i: number) => (
            <Link
              href={`#`}
              underline='hover'
              key={`event-card-tag-${tag.id}`}
              className={clsx(
                'text-sm font-light text-gray-700 hover:text-primary',
              )}
            >
              {i > 0 && ', '}#{tag.name}
            </Link>
          ))}
        </span>
      </CardBody>
      <CardFooter className='gap-3'>
        <div className='flex gap-1'>
          <p className='font-semibold text-default-400 text-small'>
            {organization?.eventNumber ?? 0}
          </p>
          <p className=' text-default-400 text-small'>Events</p>
        </div>
        <div className='flex gap-1'>
          <p className='font-semibold text-default-400 text-small'>
            {organization?.followerNumber ?? 0}
          </p>
          <p className='text-default-400 text-small'>Followers</p>
        </div>
      </CardFooter>
    </Card>
  );
}

export default OrganizationCard;
