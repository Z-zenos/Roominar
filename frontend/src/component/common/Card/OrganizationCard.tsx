import type {
  ListingOngoingEventOrganizationsItem,
  TagItem,
} from '@/src/lib/api/generated';
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Link,
} from '@nextui-org/react';
import clsx from 'clsx';
import { useState } from 'react';

export interface Organization extends ListingOngoingEventOrganizationsItem {}

interface OrganizationCardProps {
  organization?: Organization;
  className?: string;
}

function OrganizationCard({ organization, className }: OrganizationCardProps) {
  const [isFollowed, setIsFollowed] = useState<boolean>(false);

  return (
    <Card className={clsx('', className)}>
      <CardHeader className='justify-between'>
        <div className='flex gap-5'>
          <Avatar
            isBordered
            radius='full'
            size='md'
            src={organization?.avatarUrl}
          />
          <div className='flex flex-col gap-1 items-start justify-center'>
            <h4 className='text-small font-semibold leading-none text-default-600'>
              {organization?.name}
            </h4>
            {/* <h5 className='text-small tracking-tight text-default-400'>
              @zoeylang
            </h5> */}
          </div>
        </div>
        <Button
          className={
            isFollowed
              ? 'bg-transparent text-foreground border-default-200'
              : ''
          }
          color='primary'
          radius='full'
          size='sm'
          variant={isFollowed ? 'bordered' : 'solid'}
          onPress={() => setIsFollowed(!isFollowed)}
        >
          {isFollowed ? 'Unfollow' : 'Follow'}
        </Button>
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
            {organization?.eventNumber}
          </p>
          <p className=' text-default-400 text-small'>Events</p>
        </div>
        <div className='flex gap-1'>
          <p className='font-semibold text-default-400 text-small'>
            {organization?.followerNumber}
          </p>
          <p className='text-default-400 text-small'>Followers</p>
        </div>
      </CardFooter>
    </Card>
  );
}

export default OrganizationCard;
