'use client';

import clsx from 'clsx';

import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { Autoplay, FreeMode, Navigation } from 'swiper/modules';

// import required modules
import { styles } from '@/src/constants/styles.constant';
import DotLoader from '@/src/component/common/Loader/DotLoader';
import useWindowDimensions from '@/src/hooks/useWindowDimension';
import { useRouter } from 'next/navigation';
import Head from '@/src/component/common/Head';
import { useGetOrganizationDetailQuery } from '@/src/api/organization.api';
import { Image, Link } from '@nextui-org/react';
import OrganizationFollowButton from '@/src/component/common/Button/OrganizationFollowButton';
import type { TagItem } from '@/src/lib/api/generated';
import EventCard from '@/src/component/common/Card/EventCard';
import { FaPhone } from 'react-icons/fa6';
import { GrLocationPin } from 'react-icons/gr';
import { CiMail } from 'react-icons/ci';

interface OrganizationProfileProps {
  slug: string;
}

function OrganizationProfile({ slug }: OrganizationProfileProps) {
  const { data: organization, isLoading: isGetOrganizationDetailLoading } =
    useGetOrganizationDetailQuery({ organizationSlug: slug });
  const { width } = useWindowDimensions();

  const router = useRouter();

  return isGetOrganizationDetailLoading && !organization ? (
    <DotLoader />
  ) : (
    <div className='w-full'>
      <Head
        description='Detail information about specific organization'
        keywords={organization?.tags.map((tag) => tag.name).join(', ')}
        title={organization?.name}
      />
      <div className='bg-transparent h-[200px] w-full flex items-center justify-center absolute top-0 left-0'>
        <div className='relative w-full '>
          <div className='my-8 relative space-y-4 opacity-10'>
            <Image
              src={organization.avatarUrl}
              alt='Cover image'
              className='w-full blur-xl'
              classNames={{ wrapper: '!max-w-full' }}
            />
          </div>
        </div>
      </div>
      <div className={clsx('dark:bg-dark-sub w-full py-14 px-[15%]')}>
        <div className='rounded-md bg-gradient-to-tr from-pink-300 to-blue-300 p-1 shadow-md'>
          <div className='h-[100px] border-b border-b-gray-200 bg-white'></div>
          <div className='grid grid-cols-7 px-20 pt-10 pb-5 bg-white'>
            <div className='1000px:col-span-5 col-span-7 pt-5 relative'>
              <Image
                src={organization.avatarUrl}
                alt='organization avatar url'
                width={100}
                height={100}
                radius='lg'
                className='border border-gray-300 dark:border-dark-sub left-0 -top-[120px] absolute aspect-square shadow-md'
              />

              <div className='flex flex-col'>
                <div className='text-lg font-semibold'>{organization.name}</div>
                <div className={clsx(styles.flexStart, 'flex-wrap gap-4')}>
                  <span className='text-[15px] text-gray-500 dark:text-dark-text'>
                    <span className='text-primary font-semibold'>
                      {organization.followerNumber}
                    </span>{' '}
                    Followers
                  </span>
                  <span className='text-[15px] text-gray-500 dark:text-dark-text'>
                    <span className='text-orange-500 font-semibold'>
                      {organization.totalPublicEvents}
                    </span>{' '}
                    Events
                  </span>
                </div>
              </div>
            </div>
            <div className='1000px:col-span-2 col-span-7 '>
              <div className='flex justify-end items-start'>
                <OrganizationFollowButton
                  organizationId={organization.id}
                  isFollowed={organization.isFollowed}
                />
              </div>

              <div className='mt-4 flex justify-end gap-4 text-[15px] text-gray-500 dark:text-dark-text'>
                <p className='flex justify-end items-center gap-2'>
                  <CiMail className='text-primary w-6 h-6' />
                  {organization.contactEmail ?? '---'}
                </p>
                <p className='flex justify-end items-center gap-2'>
                  <FaPhone className='text-primary w-5 h-5' />
                  {organization.phone ?? '---'}
                </p>
              </div>
              <p className='flex justify-end items-center gap-2 text-[15px] text-gray-500 mt-2'>
                <GrLocationPin className='text-orange-500 w-5 h-5' />
                {organization.address ?? '---'}
              </p>
            </div>
          </div>
        </div>
        <div className='grid 1000px:grid-cols-3 grid-cols-2 gap-5 mt-12'>
          <div className='col-span-2'>
            <div className='bg-white dark:bg-dark-sub rounded-md p-6 border border-gray-200'>
              <div className='text-md font-semibold'>About Organization</div>
              <div className='text-sm text-gray-500 dark:text-dark-text mt-2'>
                {organization.description ?? 'No description'}
              </div>
              {organization.tags.map((tag: TagItem, i: number) => (
                <Link
                  underline='hover'
                  key={`event-card-tag-${tag.id}`}
                  className='cursor-pointer hover:underline text-gray-500 text-sm mr-2 hover:text-primary'
                  onClick={() => router.push(`/search?tags[]=${tag.id}`)}
                >
                  #{tag.name}
                  {i === organization.tags.length - 1 ? '' : ', '}
                </Link>
              ))}
            </div>
          </div>
          <div className='1000px:col-span-1 col-span-2'>
            <div className='border border-gray-200'></div>
          </div>
        </div>
        <div className='bg-white my-10'>
          <div className='text-md font-semibold mb-4'>Events</div>

          <Swiper
            key={width > 1200 ? 4 : 2}
            autoplay={{
              delay: 7000,
              disableOnInteraction: false,
            }}
            freeMode={true}
            modules={[Autoplay, Navigation, FreeMode]}
            pagination={{
              clickable: true,
            }}
            slidesPerView={width > 1200 ? 4 : 2}
            spaceBetween={30}
            wrapperClass='pb-2 px-4'
          >
            {organization.events.map((event) => (
              <SwiperSlide key={event.id}>
                <EventCard
                  direction={width > 800 ? 'vertical' : 'horizontal'}
                  event={event}
                  variant='standard'
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
}

export default OrganizationProfile;
