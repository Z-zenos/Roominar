'use client';

import clsx from 'clsx';

import { useEffect, useState } from 'react';
import {
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Image,
  Link,
} from '@nextui-org/react';
import {
  FaFacebookSquare,
  FaInstagram,
  FaLinkedin,
  FaRegCopy,
  FaRegEye,
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { BsFillPeopleFill } from 'react-icons/bs';
import { MdOutlineMail } from 'react-icons/md';
import { GoOrganization } from 'react-icons/go';
import { GiPartyPopper } from 'react-icons/gi';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// import '@/styles/custom.module.css';
import '@/src/component/editor/components/editor/themes/PlaygroundEditorTheme.css';

// import required modules
import { Autoplay, FreeMode, Pagination } from 'swiper/modules';
import { styles } from '@/src/constants/styles.constant';
import DotLoader from '@/src/component/common/Loader/DotLoader';
import useWindowDimensions from '@/src/hooks/useWindowDimension';
import Badge from '@/src/component/common/Badge';
import {
  useGetEventDetailQuery,
  useListingRelatedEventsQuery,
  useListingTopOrganizationEventsQuery,
} from '@/src/api/event.api';
import type { TagItem } from '@/src/lib/api/generated';
import { usePathname, useRouter } from 'next/navigation';
import Head from '@/src/component/common/Head';
import { formatEventDate, groupIntoPairs } from '@/src/utils/app.util';
import Chip from '@/src/component/common/Chip';
import { useSession } from 'next-auth/react';
import EventBookmark from '../../component/common/Button/EventBookmarkButton';
import OrganizationFollowButton from '@/src/component/common/Button/OrganizationFollowButton';
import HorizontalTimeline from '@/src/component/common/DateTime/HorizontalTimeline';
import toast from 'react-hot-toast';
import { TbClockExclamation } from 'react-icons/tb';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';

const LazyMap = dynamic(() => import('../../component/common/Map/Map'), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

interface OrganizationEventHomeProps {
  slug: string;
}

function OrganizationEventHome({ slug }: OrganizationEventHomeProps) {
  const t = useTranslations();
  const { data: event, isLoading } = useGetEventDetailQuery({ slug });
  const { data: topOrganizationEventsData } =
    useListingTopOrganizationEventsQuery(
      {
        organizationId: event?.organizationId,
      },
      !isLoading,
    );

  const { data: relatedEventsData } = useListingRelatedEventsQuery({ slug });

  const { width } = useWindowDimensions();

  const [isCopied, setIsCopied] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();
  const { data: auth } = useSession();

  useEffect(() => {
    setTimeout(() => setIsCopied(false), 30000);
  }, [isCopied]);

  return isLoading && !event ? (
    <DotLoader />
  ) : (
    <div className='w-full overflow-hidden'>
      <Head
        description='Detail information about specific event'
        keywords='Foreign Language,Webinar,Event,Sharing,Seminar,Ticket'
        title={event?.name}
      />
      <div
        className={clsx(
          'dark:bg-dark-sub w-full 450px:py-14 py-8 450px:px-[10%] px-[5%] relative flex-wrap',
          styles.between,
        )}
      >
        <div className='bg-transparent h-[200px] w-full flex items-center justify-center absolute top-0 left-0'>
          <div className='relative w-full '>
            <div className='my-8 relative space-y-4 opacity-15'>
              <Image
                src={event.coverImageUrl}
                alt='Cover image'
                className='w-full blur-xl'
                classNames={{ wrapper: '!max-w-full' }}
              />
            </div>
          </div>
        </div>
        <div
          className={clsx(
            'flex flex-col 450px:gap-7 gap-4',
            width > 1200 ? 'w-[70%]' : 'w-full 450px:mb-8 mb-4',
          )}
        >
          <div className='flex justify-between flex-wrap gap-4 450px:w-[90%] w-full'>
            <Breadcrumbs color='primary'>
              <BreadcrumbItem
                className='hover:underline'
                href='/home'
              >
                🏠 Home
              </BreadcrumbItem>
              <BreadcrumbItem
                className='hover:underline'
                href='/search'
              >
                Events
              </BreadcrumbItem>
              <BreadcrumbItem>
                <span className='break-words whitespace-normal'>
                  {event?.name}
                </span>
              </BreadcrumbItem>
            </Breadcrumbs>
            <Chip
              content={event?.viewNumber + ''}
              leftIcon={<FaRegEye className='text-sm' />}
              type='info'
              className='border border-primary-500'
            />
          </div>
          <Image
            src={event?.coverImageUrl}
            alt='Event banner image'
            width={1024}
            className={clsx(
              'w-full max-w-screen-xl aspect-video object-cover rounded-xl max-h-[576px]',
              width > 1200 ? 'mx-auto' : '',
            )}
            classNames={{ wrapper: '!max-w-full' }}
            loading='lazy'
          />
          <h2 className='text-primary font-bold 450px:text-xl text-xm'>
            {event?.name}
          </h2>
          <div className={clsx(styles.flexStart, 'gap-2 flex-wrap')}>
            {event &&
              event.tags.map((tag: TagItem) => (
                <Badge
                  title={t(`code.tag.${tag.name}`)}
                  key={`badge-tag-${tag.id}`}
                  className='cursor-pointer hover:underline'
                />
              ))}
          </div>
        </div>
        <div className={clsx(width > 1200 ? 'w-[25%]' : 'w-full')}>
          <div
            className={clsx(
              'bg-white shadow-[rgba(0,_0,_0,_0.05)_0px_6px_24px_0px,_rgba(0,_0,_0,_0.08)_0px_0px_0px_1px] border p-4 border-gray-100 rounded-md flex items-center gap-6',
              width > 1200 || width <= 450
                ? 'flex-col'
                : 'flex-row justify-between',
            )}
          >
            <div>
              <div
                className={clsx(styles.between, 'mt-4 [&>*]:cursor-pointer')}
              >
                <FaFacebookSquare
                  size={24}
                  className='text-[#0862f6]'
                />
                <FaXTwitter
                  size={24}
                  className='text-[]'
                />
                <FaInstagram
                  size={24}
                  className='text-orange-400'
                />
                <FaLinkedin
                  size={24}
                  className='text-[#0073af]'
                />
              </div>
              <div className={clsx(styles.between, 'gap-2 mt-3')}>
                <Button
                  variant='bordered'
                  className='w-full'
                  color='default'
                  onClick={() => {
                    navigator.clipboard.writeText(location.href);
                    setIsCopied(true);
                  }}
                  radius='sm'
                >
                  <FaRegCopy /> {isCopied ? 'Copied' : 'Copy'} URL
                </Button>
                <EventBookmark
                  isBookmarked={event?.isBookmarked}
                  eventId={event?.id}
                  isDisabled={true}
                />
              </div>
            </div>

            <div>
              <div
                className={clsx(
                  styles.flexStart,
                  'border-y border-y-gray-500 py-4',
                )}
              >
                <BsFillPeopleFill className='text-primary w-6 h-6' />
                <span className='font-light'>
                  {event?.soldTicketsNumber ?? 0} sold /{' '}
                  {event?.totalTicketNumber}
                </span>
              </div>
              <Button
                color='primary'
                className='450px:my-3 mt-3 mx-auto w-[160px] font-semibold'
                radius='none'
                onClick={() => {
                  if (
                    event?.applicationEndAt < new Date() ||
                    event?.applicationStartAt > new Date()
                  ) {
                    toast.custom(() => (
                      <div
                        className={clsx(
                          'bg-white dark:bg-dark-sub dark:text-white',
                          'flex items-center justify-between',
                          'max-w-[400px] p-4 rounded-lg shadow-lg',
                        )}
                      >
                        <div className='flex items-center gap-4'>
                          <div className='p-3 bg-red-500 rounded-full'>
                            <TbClockExclamation className='text-white' />
                          </div>
                          <div>
                            <h3 className='text-red-500 font-semibold'>
                              Application is not available
                            </h3>
                            <p className='text-sm'>
                              The application is not available at this time
                            </p>
                          </div>
                        </div>
                      </div>
                    ));
                  } else {
                    router.push(auth?.user ? `${pathname}/apply` : '/login');
                  }
                }}
                isDisabled={true}
              >
                Apply Now
              </Button>
            </div>

            <Link
              className={clsx(styles.between, 'text-primary gap-2')}
              href='#'
              underline='hover'
            >
              <MdOutlineMail size={20} />
              Ask about this event
            </Link>
          </div>

          {/* === LOCATION === */}
          {event?.organizeAddress && (
            <div>
              <h3 className='font-semibold 450px:text-xm text-xm mt-4'>
                Offline address
              </h3>
              <div>
                <p className='font-light mb-2'>{event?.organizeAddress}</p>
                <div className='border border-gray-400 rounded-md shadow-sm'>
                  {event.organizeAddress && event.lat && event.lng && (
                    <LazyMap
                      defaultCoordinate={[event?.lat, event?.lng]}
                      className='w-full !h-[200px] rounded-md'
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div
        className={clsx(
          'dark:bg-dark-sub w-full 450px:py-14 py-6 450px:px-[10%] px-[5%] relative flex-wrap flex justify-between items-start',
        )}
      >
        <div
          className={clsx(
            'flex flex-col gap-7',
            width > 1200 ? 'w-[70%]' : 'w-full mb-8',
          )}
        >
          {/* === Timeline === */}
          <div>
            <h3 className='font-semibold 450px:text-lg text-xm border-b border-b-gray-400'>
              General Timeline
            </h3>

            <HorizontalTimeline
              applicationStartAt={event?.applicationStartAt}
              applicationEndAt={event?.applicationEndAt}
              startAt={event?.startAt}
              endAt={event?.endAt}
            />
          </div>

          {/* === DESCRIPTION === */}
          <div>
            <h3 className='font-semibold 450px:text-lg text-xm border-b border-b-gray-400'>
              About this event
            </h3>
            <div className='mt-3'>
              <div
                dangerouslySetInnerHTML={{ __html: event?.description }}
              ></div>
            </div>
          </div>

          {/* === Refund Policy === */}
          <div>
            <h3 className='font-semibold 450px:text-lg text-xm'>
              Refund Policy
            </h3>
            <div className='mt-3'>
              <p className='font-light'>No refund policy</p>
            </div>
          </div>

          {/* === Speaker === */}
          <div>
            <h3 className='font-semibold 450px:text-lg text-xm border-b border-b-gray-400'>
              Speaker
            </h3>

            {/* <div className='flex gap-5 items-center justify-start mt-6 flex-wrap'>
                {[10, 11, 12, 15].map((speaker, i) => (
                  <SpeakerCard
                    key={`speaker-${i}`}
                    className='max-w-[250px]'
                  />
                ))}
              </div> */}
          </div>
        </div>
        <div
          className={clsx(width > 1200 ? 'w-[25%]' : 'w-full', 'self-start')}
        >
          <div>
            <h3
              className={clsx(
                styles.flexStart,
                'gap-2 450px:text-lg text-xm font-semibold text-primary',
              )}
            >
              <GoOrganization />
              Organization
            </h3>
            <div className='mt-3 border border-gray-200 shadow-sm'>
              {event?.organizationAvatarUrl && (
                <div className='h-[100px] overflow-hidden'>
                  <Image
                    src={event?.organizationAvatarUrl}
                    className='w-full h-[200px] aspect-video'
                    alt='Organization banner image'
                  />
                </div>
              )}
              <div className={clsx(styles.between, 'px-5')}>
                <h3 className='font-semibold text-primary text-xm cursor-pointer'>
                  {event?.organizationName}
                </h3>
                <div className='text-right mt-3'>
                  <OrganizationFollowButton
                    organizationId={event.organizationId}
                    isFollowed={event.isOrganizationFollowed}
                    isDisabled={true}
                  />
                  <p className='mt-2'>
                    <span className='underline font-medium text-sm text-red-500 mr-2'>
                      {event.organizationFollowerNumber ?? 0}
                    </span>
                    <span className='font-light opacity-80 text-sm'>
                      Follower
                    </span>
                  </p>
                </div>
              </div>
              <div className='my-3 px-5'>
                <p className='opacity-70 text-ss line-clamp-3'>
                  {event?.organizationDescription}
                </p>

                <h3 className='font-semibold text-gray-700 text-nm cursor-pointer 450px:my-3 my-2'>
                  Events ({event?.organizationEventNumber ?? 0})
                </h3>
                {topOrganizationEventsData &&
                  topOrganizationEventsData.events.map(
                    (topOrganizationEvent) => (
                      <div
                        key={`toe-${topOrganizationEvent.id}`}
                        className='flex justify-start gap-3 450px:my-6 my-3 items-start cursor-pointer'
                        onClick={() => router.push(topOrganizationEvent?.slug)}
                      >
                        <Image
                          src={topOrganizationEvent.coverImageUrl}
                          width={100}
                          height={70}
                          className='rounded-md min-w-[100px] aspect-video'
                          alt='organization top organizationEvent image'
                        />
                        <div>
                          <h3 className='font-medium text-sm'>
                            {topOrganizationEvent.name}
                          </h3>
                          <p className='text-ss font-light opacity-65'>
                            Start at{' '}
                            {formatEventDate(topOrganizationEvent.startAt)}
                          </p>
                        </div>
                      </div>
                    ),
                  )}
                <button
                  className='w-full px-3 py-2 border border-transparent transition-all font-light bg-green-sub border-t border-t-green-sub text-green-main hover:border hover:border-green-main'
                  // TODO: List events of profiel organization
                  // onClick={() =>
                  //   router.push(
                  //     `/organizations/?keyword=${event.organizationName}`,
                  //   )
                  // }
                  disabled={true}
                >
                  More event +
                </button>
              </div>
            </div>
          </div>

          <div>
            {relatedEventsData?.events &&
              relatedEventsData?.events?.length > 0 && (
                <h3
                  className={clsx(
                    styles.flexStart,
                    'gap-2 450px:text-lg text-xm font-semibold text-orange-500 mt-5',
                  )}
                >
                  <GiPartyPopper />
                  Related Events
                </h3>
              )}

            <Swiper
              key={1}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              freeMode={true}
              modules={[Autoplay, Pagination, FreeMode]}
              pagination={{
                clickable: true,
              }}
              slidesPerView={1}
              spaceBetween={30}
              wrapperClass='pb-2'
            >
              {relatedEventsData &&
                groupIntoPairs(relatedEventsData.events).map(
                  (relatedEventPair) => (
                    <SwiperSlide
                      key={`re-${relatedEventPair[0]?.id}`}
                      className={clsx('dark:rounded-lg dark:p-0')}
                    >
                      <div
                        className='mt-3 450px:border border-gray-200 shadow-sm p-2 cursor-pointer'
                        onClick={() => router.push(relatedEventPair[0]?.slug)}
                      >
                        <Image
                          src={relatedEventPair[0]?.coverImageUrl}
                          className='w-full h-[200px]'
                          alt='More event image'
                        />
                        <div className='pt-3 px-1'>
                          <h3 className='text-nm'>
                            {relatedEventPair[0]?.name}
                          </h3>
                          <p className='text-ss font-light opacity-65'>
                            Start at{' '}
                            {formatEventDate(relatedEventPair[0]?.startAt)}
                          </p>
                        </div>
                      </div>

                      <div
                        className='mt-3 450px:border border-gray-200 shadow-sm p-2 cursor-pointer'
                        onClick={() => router.push(relatedEventPair[1]?.slug)}
                      >
                        <Image
                          src={relatedEventPair[1]?.coverImageUrl}
                          className='w-full h-[200px] aspect-video'
                          alt='More event image'
                        />
                        <div className='pt-3 px-1'>
                          <h3 className='text-nm'>
                            {relatedEventPair[1]?.name}
                          </h3>
                          <p className='text-ss font-light opacity-65'>
                            Start at{' '}
                            {formatEventDate(relatedEventPair[1]?.startAt)}
                          </p>
                        </div>
                      </div>
                    </SwiperSlide>
                  ),
                )}
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrganizationEventHome;
