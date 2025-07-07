'use client';

import clsx from 'clsx';

import { useEffect, useState } from 'react';
import { Button, Checkbox, Image } from '@nextui-org/react';
import {
  FaFacebookSquare,
  FaInstagram,
  FaLinkedin,
  FaRegCopy,
  FaRegEye,
} from 'react-icons/fa';
import {
  FaArrowRight,
  FaRegCommentDots,
  FaStar,
  FaXTwitter,
} from 'react-icons/fa6';
import { GoOrganization } from 'react-icons/go';
import { GiMicrophone, GiPartyPopper } from 'react-icons/gi';

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
import type { TagItem, TicketItem } from '@/src/lib/api/generated';
import { usePathname, useRouter } from 'next/navigation';
import Head from '@/src/component/common/Head';
import { cn, formatEventDate, groupIntoPairs } from '@/src/utils/app.util';
import Chip from '@/src/component/common/Chip';
import { useSession } from 'next-auth/react';
import EventBookmark from '../../component/common/Button/EventBookmarkButton';
import OrganizationFollowButton from '@/src/component/common/Button/OrganizationFollowButton';
import HorizontalTimeline from '@/src/component/common/DateTime/HorizontalTimeline';
import toast from 'react-hot-toast';
import { TbClockExclamation } from 'react-icons/tb';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import useFormatMoney from '@/src/hooks/useFormatMoney';
import { HiOutlineTicket } from 'react-icons/hi2';
import { ArrowRight } from 'lucide-react';
import { EventDetailMenuBar } from '@/src/component/common/Navbar/EventDetailNavbar';
import { CiViewTimeline } from 'react-icons/ci';
import EventComment from './EventComment';
import FeedbackEventForm from '../../component/form/FeedbackEventForm';
import FeedbackList from './FeedbackList';
import { RoleCode } from '@/src/constants/role_code.constant';

const LazyMap = dynamic(() => import('../../component/common/Map/Map'), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

const menuItems = [
  {
    icon: CiViewTimeline,
    label: 'Lịch trình',
    href: 'timeline',
    gradient:
      'radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(37,99,235,0.06) 50%, rgba(29,78,216,0) 100%)',
    iconColor: 'text-blue-500',
  },
  {
    icon: FaRegCommentDots,
    label: 'Q & A',
    href: 'comments',
    gradient:
      'radial-gradient(circle, rgba(249,115,22,0.15) 0%, rgba(234,88,12,0.06) 50%, rgba(194,65,12,0) 100%)',
    iconColor: 'text-orange-500',
  },
  {
    icon: HiOutlineTicket,
    label: 'Vé',
    href: 'tickets',
    gradient:
      'radial-gradient(circle, rgba(34,197,94,0.15) 0%, rgba(22,163,74,0.06) 50%, rgba(21,128,61,0) 100%)',
    iconColor: 'text-green-500',
  },
  {
    icon: GiMicrophone,
    label: 'Diễn giả',
    href: 'speakers',
    gradient:
      'radial-gradient(circle, rgba(239,68,68,0.15) 0%, rgba(220,38,38,0.06) 50%, rgba(185,28,28,0) 100%)',
    iconColor: 'text-red-500',
  },
  {
    icon: FaStar,
    label: 'Đánh giá',
    href: 'feedbacks',
    gradient:
      'radial-gradient(circle, rgba(234,179,8,0.15) 0%, rgba(202,138,4,0.06) 50%, rgba(161,98,7,0) 100%)',
    iconColor: 'text-yellow-500',
  },
];

interface EventDetailProps {
  slug: string;
}

function EventDetail({ slug }: EventDetailProps) {
  const t = useTranslations('code');
  const formatMoney = useFormatMoney();
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
  const [activeItem, setActiveItem] = useState<string>('timeline');
  const [showCommentsSection, setShowCommentsSection] =
    useState<boolean>(false);
  const [showFeedbackSection, setShowFeedbackSection] =
    useState<boolean>(false);
  const [followCount, setFollowCount] = useState<number>(
    event?.organizationFollowerNumber ?? 0,
  );

  useEffect(() => {
    setFollowCount(event?.organizationFollowerNumber ?? 0);
  }, [event?.organizationFollowerNumber]);

  useEffect(() => {
    setTimeout(() => setIsCopied(false), 30000);
  }, [isCopied]);

  useEffect(() => {
    handleScroll(activeItem.toLowerCase());
  }, [showCommentsSection, showFeedbackSection]);

  useEffect(() => {
    if (event) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [event]);

  const handleScroll = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
          'dark:bg-dark-sub w-full 450px:py-8 py-8 450px:px-[15%] px-[5%] relative flex-wrap',
          styles.between,
        )}
      >
        {!showCommentsSection && !showFeedbackSection && (
          <div className='bg-transparent h-[200px] w-full flex items-center justify-center absolute top-0 left-0'>
            <div className='relative w-full '>
              <div className='my-8 relative space-y-4 opacity-15'>
                <Image
                  src={event?.coverImageUrl}
                  alt='Cover image'
                  className='w-full blur-xl'
                  classNames={{ wrapper: '!max-w-full' }}
                />
              </div>
            </div>
          </div>
        )}
        <div
          className={clsx(
            'flex flex-col 450px:gap-7 gap-4',
            width > 1200 ? 'w-[70%]' : 'w-full 450px:mb-8 mb-4',
          )}
        >
          <div className='flex justify-between flex-wrap gap-4 450px:w-[95%] w-full items-end'>
            <EventDetailMenuBar
              items={menuItems.map((item) => {
                if (item.href === 'comments') {
                  return {
                    ...item,
                    label: `Q & A (${event?.commentCount})`,
                  };
                }
                if (item.href === 'feedbacks') {
                  return {
                    ...item,
                    label:
                      event?.endAt > new Date()
                        ? `Đánh giá (Mở sau khi sự kiện kết thúc)`
                        : `Đánh giá (${event?.feedbackCount})`,
                  };
                }
                return item;
              })}
              activeItem={activeItem}
              onItemClick={(item) => {
                if (item === 'comments') {
                  setShowCommentsSection(true);
                  setShowFeedbackSection(false);
                } else if (item === 'feedbacks') {
                  if (event?.endAt > new Date()) {
                    return;
                  }
                  setShowFeedbackSection(true);
                  setShowCommentsSection(false);
                } else {
                  setShowCommentsSection(false);
                  setShowFeedbackSection(false);
                  handleScroll(item.toLowerCase());
                }
                setActiveItem(item);
              }}
            />
            {!showFeedbackSection && (
              <Chip
                content={event?.viewCount + ''}
                leftIcon={<FaRegEye className='text-sm' />}
                type='info'
                className='border border-primary-500 !max-h-[40px]'
              />
            )}
          </div>
          {!showFeedbackSection && (
            <>
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
                {event?.tags.map((tag: TagItem) => (
                  <Badge
                    title={t(`tag.${tag.name}`)}
                    key={`badge-tag-${tag.id}`}
                    className='cursor-pointer hover:underline'
                    onClick={() => router.push(`/search?tags[]=${tag.id}`)}
                  />
                ))}
              </div>
            </>
          )}
          {showFeedbackSection && <FeedbackEventForm eventId={event?.id} />}
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
                <FaXTwitter size={24} />
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
                {auth?.user.roleCode === RoleCode.AUDIENCE && (
                  <EventBookmark
                    isBookmarked={event?.isBookmarked}
                    eventId={event?.id}
                  />
                )}
              </div>
            </div>

            <div>
              {((event?.remainingTicketsNumber ?? 0) /
                event?.totalTicketNumber) *
                100 <
              10 ? (
                <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg animate-pulse shadow-md inline-block font-semibold text-sm sm:text-base'>
                  🔥 Nhanh tay! Chỉ còn{' '}
                  <span className='text-red-900 font-bold'>5 vé</span>
                </div>
              ) : (
                <div
                  className={clsx(
                    styles.flexStart,
                    'border-y border-y-gray-500 py-4',
                  )}
                >
                  <HiOutlineTicket className='text-primary w-6 h-6 rotate-45' />
                  <span className='font-light'>
                    Còn {event?.remainingTicketsNumber ?? 0} vé /{' '}
                    {event?.totalTicketNumber ?? 0}
                  </span>
                </div>
              )}
              {auth?.user?.roleCode !== RoleCode.ORGANIZER && (
                <Button
                  color='primary'
                  className='450px:my-3 mt-3 mx-auto w-[160px] font-semibold block'
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
                              <p className='text-sm'>
                                Không thể đăng ký sự kiện trong khoảng thời gian
                                này vì thời gian đăng ký đã kết thúc hoặc chưa
                                bắt đầu.
                              </p>
                            </div>
                          </div>
                        </div>
                      ));
                    } else {
                      router.push(
                        auth?.user
                          ? `${pathname}/apply`
                          : `/login?callbackUrl=/events/${event?.slug}/apply`,
                      );
                    }
                  }}
                  isDisabled={event?.applicationEndAt < new Date()}
                >
                  Đăng ký ngay
                </Button>
              )}
              {event?.applicationEndAt < new Date() && (
                <p className='opacity-60 text-ss'>
                  Thời gian đăng ký sự kiện đã kết thúc.
                </p>
              )}
            </div>
          </div>

          {/* === LOCATION === */}
          {event?.organizeAddress && (
            <div>
              <h3 className='font-semibold 450px:text-xm text-xm mt-4'>
                Địa điểm tổ chức offline
              </h3>
              <div>
                <p className='font-light mb-2'>{event?.organizeAddress}</p>
                <div className='border border-gray-400 rounded-md shadow-sm'>
                  {/* {event.organizeAddress && event.lat && event.lng && (
                    <LazyMap
                      defaultCoordinate={[event?.lat, event?.lng]}
                      className='w-full !h-[200px] rounded-md'
                    />
                  )} */}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div
        className={clsx(
          'dark:bg-dark-sub w-full 450px:py-4 py-6 450px:px-[15%] px-[5%] relative flex-wrap flex justify-between items-start',
        )}
      >
        {showCommentsSection && (
          <div
            id='comments'
            className={clsx(
              'flex flex-col gap-7',
              width > 1200 ? 'w-[70%]' : 'w-full mb-8',
            )}
          >
            <h3 className='font-semibold 450px:text-lg text-xm border-b border-b-gray-400'>
              Q & A
            </h3>
            <EventComment eventId={event?.id} />
          </div>
        )}
        {showFeedbackSection && (
          <div
            className={clsx(
              'flex flex-col gap-7',
              width > 1200 ? 'w-[70%]' : 'w-full mb-8',
            )}
          >
            <h3 className='font-semibold 450px:text-lg text-xm border-b border-b-gray-400'>
              Đánh giá
            </h3>
            <FeedbackList eventId={event?.id} />
          </div>
        )}
        {!showCommentsSection && !showFeedbackSection && (
          <div
            className={clsx(
              'flex flex-col gap-7',
              width > 1200 ? 'w-[70%]' : 'w-full mb-8',
            )}
          >
            {/* === Timeline === */}
            <div id='timeline'>
              <h3 className='font-semibold 450px:text-lg text-xm border-b border-b-gray-400'>
                Lịch trình chung
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
                Về sự kiện này
              </h3>
              <div className='mt-3'>
                <div
                  dangerouslySetInnerHTML={{ __html: event?.description }}
                ></div>
              </div>
            </div>

            {/* === Tickets === */}
            <div id='tickets'>
              <h3 className='font-semibold 450px:text-lg text-xm'>
                Thông tin vé
              </h3>
              <div className='mt-3'>
                <div className='grid 1200px:grid-cols-1 450px:grid-cols-2 grid-cols-1'>
                  {event &&
                    event.tickets.map((ticket: TicketItem) => (
                      <Checkbox
                        aria-label='tickets'
                        name='tickets'
                        classNames={{
                          base: cn(
                            'flex max-w-full mx-0 my-1 w-full bg-content1',
                            'hover:bg-content2 items-center justify-start',
                            'cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent',
                            'data-[selected=true]:border-gray-100',
                            'pointer-events-none',
                          ),
                          label: 'w-full m-0',
                          icon: 'w-6 h-6 rotate-45',
                        }}
                        key={`t-${ticket.id}`}
                        icon={(props) => {
                          delete props.isIndeterminate;
                          delete props.isSelected;
                          delete props.disableAnimation;
                          return <HiOutlineTicket {...props} />;
                        }}
                        isSelected={true}
                        color='default'
                      >
                        <div className='w-full flex justify-between items-center gap-2'>
                          <div className='font-normal w-full'>
                            <h4
                              className={clsx(
                                styles.between,
                                'text-nm font-medium leading-5 flex-wrap gap-2',
                              )}
                            >
                              <span>
                                {ticket.name}{' '}
                                {ticket.salesStartAt && (
                                  <>
                                    ({formatEventDate(ticket.salesStartAt)}{' '}
                                    <FaArrowRight className='inline-flex' />{' '}
                                    {formatEventDate(ticket.salesEndAt)})
                                  </>
                                )}
                              </span>
                              {auth?.user?.roleCode !== RoleCode.ORGANIZER &&
                              event?.applicationEndAt > new Date() &&
                              event?.applicationStartAt < new Date() ? (
                                <button
                                  className='group relative flex items-center gap-1 overflow-hidden rounded-md border-[1.5px] border-[#333333]/40 bg-transparent px-8 py-2 text-sm font-semibold text-[#111111] cursor-pointer transition-all duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] hover:border-transparent hover:text-white hover:rounded-[12px] active:scale-[0.95] !pointer-events-auto'
                                  onClick={(e) => {
                                    e.preventDefault();
                                    router.push(`/events/${event.slug}/apply`);
                                  }}
                                >
                                  {/* Left arrow (arr-2) */}
                                  <ArrowRight className='absolute w-4 h-4 left-[-25%] stroke-[#111111] fill-none z-[9] group-hover:left-4 group-hover:stroke-white transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]' />

                                  {/* Text */}
                                  <span className='relative z-[1] -translate-x-3 group-hover:translate-x-3 transition-all duration-[800ms] ease-out'>
                                    Mua vé ngay
                                  </span>

                                  {/* Circle */}
                                  <span className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#111111] rounded-[50%] opacity-0 group-hover:w-[220px] group-hover:h-[220px] group-hover:opacity-100 transition-all duration-[800ms] ease-[cubic-bezier(0.19,1,0.22,1)]'></span>

                                  {/* Right arrow (arr-1) */}
                                  <ArrowRight className='absolute w-4 h-4 right-4 stroke-[#111111] fill-none z-[9] group-hover:right-[-25%] group-hover:stroke-white transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]' />
                                </button>
                              ) : (
                                <p className='text-sm text-gray-600'>
                                  Không phải thời điểm mua vé
                                </p>
                              )}
                            </h4>
                            <Chip
                              className='w-fit font-bold'
                              type={ticket.price > 0 ? 'warning' : 'info'}
                              content={t(`ticket.type.${ticket.type}`)}
                            />
                            <div
                              className={clsx(styles.between, 'w-full mt-1')}
                            >
                              {ticket.price ? (
                                <div className='text-sm w-full'>
                                  <span>Giá: </span>
                                  <span className='text-primary font-semibold ml-2'>
                                    {formatMoney(ticket.price)}
                                  </span>
                                </div>
                              ) : (
                                <span>&nbsp;</span>
                              )}
                              <p className='text-nm'>
                                Còn
                                <span className='text-orange-500 font-bold mx-1'>
                                  {ticket.quantity - ticket.soldQuantity}
                                </span>
                                vé
                              </p>
                            </div>
                          </div>
                        </div>
                      </Checkbox>
                    ))}
                </div>
              </div>
            </div>

            {/* === Refund Policy === */}
            {/* <div>
              <h3 className='font-semibold 450px:text-lg text-xm'>
                Chính sách hoàn tiền
              </h3>
              <div className='mt-3'>
                <p className='font-light'>Không có chính sách hoàn tiền nào.</p>
              </div>
            </div> */}

            {/* === Speaker === */}
            <div id='speakers'>
              <h3 className='font-semibold 450px:text-lg text-xm border-b border-b-gray-400'>
                Diễn giả
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
        )}
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
              Tổ chức
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
                <h3
                  className='font-semibold text-primary text-xm cursor-pointer'
                  onClick={() =>
                    router.push(`/organization/${event?.organizationSlug}`)
                  }
                >
                  {event?.organizationName}
                </h3>
                <div className='text-right mt-3'>
                  {auth?.user?.roleCode === RoleCode.AUDIENCE && (
                    <OrganizationFollowButton
                      organizationId={event.organizationId}
                      isFollowed={event.isOrganizationFollowed}
                      onFollowChange={(isFollowed) => {
                        setFollowCount((prev) =>
                          isFollowed ? prev + 1 : prev - 1,
                        );
                      }}
                    />
                  )}
                  <p className='mt-2'>
                    <span className='underline font-medium text-sm text-red-500 mr-2'>
                      {followCount ?? 0}
                    </span>
                    <span className='font-light opacity-80 text-sm'>
                      người theo dõi
                    </span>
                  </p>
                </div>
              </div>
              <div className='my-3 px-5'>
                <p className='opacity-70 text-ss line-clamp-3'>
                  {event?.organizationDescription}
                </p>

                <h3 className='font-semibold text-gray-700 text-nm cursor-pointer 450px:my-3 my-2'>
                  Sự kiện ({event?.organizationEventNumber ?? 0})
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
                            Bắt đầu lúc{' '}
                            {formatEventDate(topOrganizationEvent.startAt)}
                          </p>
                        </div>
                      </div>
                    ),
                  )}
                <button
                  className='w-full px-3 py-2 border border-transparent transition-all font-light bg-green-sub border-t border-t-green-sub text-green-main hover:border hover:border-green-main'
                  onClick={() =>
                    router.push(`/organization/${event?.organizationSlug}`)
                  }
                >
                  Nhiều sự kiện hơn +
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
                  Các sự kiện liên quan
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
                            Bắt đầu lúc{' '}
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

export default EventDetail;
