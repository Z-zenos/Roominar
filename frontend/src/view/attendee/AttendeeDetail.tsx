'use client';

import { useGetAttendeeDetailQuery } from '@/src/api/organization.api';
import DotLoader from '@/src/component/common/Loader/DotLoader';
import { Image } from '@nextui-org/react';
import { useTranslations } from 'next-intl';
import AttendeeDetailInfoRow from './AttendeeDetailInfoRow';
import { styles } from '@/src/constants/styles.constant';
import clsx from 'clsx';
import Chip from '@/src/component/common/Chip';
import { RiChatFollowUpLine } from 'react-icons/ri';

interface AttendeeDetailProps {
  id: number;
}

export default function AttendeeDetail({ id }: AttendeeDetailProps) {
  const { data: attendee } = useGetAttendeeDetailQuery({
    attendeeId: id,
  });
  const t = useTranslations('code');

  return attendee ? (
    <div>
      {/* BASIC INFO */}
      <div>
        <div className='-translate-y-4 border-b border-b-gray-300 flex justify-start gap-2 items-center relative'>
          <Image
            src={attendee.avatarUrl}
            alt='attendee avatar'
            className='translate-x-4 translate-y-6 border border-gray-300'
            width={100}
            height={100}
            radius='full'
          />
          <div className='flex flex-col ml-6 mt-5'>
            <div className='text-nm font-bold'>{attendee.userName}</div>
            <div className='text-gray-500 text-sm'>{attendee.email}</div>
          </div>

          <div className='bottom-0 right-0 py-2 mt-8 px-5 bg-primary h-10 absolute after:absolute after:w-10 after:z-10 after:rotate-45 after:h-10 after:-top-6 after:bg-white after:-left-6 w-fit overflow-hidden text-white font-semibold'>
            Basic Info
          </div>
        </div>
        <div className={clsx(styles.between, 'mt-4')}>
          {attendee.isFollowed && (
            <Chip
              content='Following your organization'
              leftIcon={<RiChatFollowUpLine className='text-md' />}
              type='success'
            />
          )}
          <span className='text-ss font-light translate-y-3 text-primary'>
            Click to Copy
          </span>
        </div>
        <div className='mt-3'>
          <AttendeeDetailInfoRow
            title='Phone'
            content={attendee.phone}
          />
          <AttendeeDetailInfoRow
            title='Workplace Name'
            content={attendee.workplaceName}
          />
          <AttendeeDetailInfoRow
            title='Industry'
            content={
              attendee.industryCode && t(`industry.${attendee.industryCode}`)
            }
          />
          <AttendeeDetailInfoRow
            title='Job Type'
            content={
              attendee.jobTypeCode && t(`jobType.${attendee.jobTypeCode}`)
            }
          />
        </div>
      </div>
    </div>
  ) : (
    <DotLoader />
  );
}
