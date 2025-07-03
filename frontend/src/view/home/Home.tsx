'use client';

import clsx from 'clsx';
import { MdKeyboardDoubleArrowRight, MdOutlineExplore } from 'react-icons/md';
import { FaConnectdevelop, FaFireAlt } from 'react-icons/fa';
import { Input } from '@nextui-org/input';
import { CiSearch } from 'react-icons/ci';
import Link from 'next/link';
import { PiRankingFill } from 'react-icons/pi';
import { GoOrganization } from 'react-icons/go';
import { GiMicrophone } from 'react-icons/gi';

import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { Autoplay, FreeMode, Navigation } from 'swiper/modules';
import { Button } from '@nextui-org/button';
import { Image } from '@nextui-org/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useWindowDimensions from '@/src/hooks/useWindowDimension';
import OrganizationCard from '@/src/component/common/Card/OrganizationCard';
import RankingList from '@/src/component/common/Ranking/RankingList';
import SpeakerCard from '@/src/component/common/Card/SpeakerCard';
import {
  useListingEventRankQuery,
  useListingRecommendationEventsQuery,
  useListingTrendingEventsQuery,
  useSearchEventsQuery,
} from '@/src/api/event.api';
import { EventSortByCode } from '@/src/lib/api/generated';
import EventCard from '@/src/component/common/Card/EventCard';
import EventCardSkeleton from '@/src/component/common/Card/EventCardSkeleton';
import { useListingTagRankQuery } from '@/src/api/tag.api';
import Marquee from 'react-fast-marquee';
import OrganizationCardSkeleton from '@/src/component/common/Card/OrganizationCardSkeleton';
import { useSession } from 'next-auth/react';
import { useListingRandomOrganizationsQuery } from '@/src/api/organization.api';
import { useListingRandomSpeakersQuery } from '@/src/api/speaker.api';
import RecommendedEvents from '../event/RecommendedEvents';
import { useTranslations } from 'next-intl';
import { styles } from '@/src/constants/styles.constant';
import { usePwaInstallPrompt } from '@/src/hooks/usePwaInstallPrompt';

export default function Home() {
  const t = useTranslations();
  const { status } = useSession();
  const { data: upcomingEvents, isLoading: isUpcomingEventsLoading } =
    useSearchEventsQuery({
      sortBy: EventSortByCode.StartAt,
      perPage: 8,
    });

  const { data: recommendedEvents, isLoading: isRecommendationEventsLoading } =
    useListingRecommendationEventsQuery(
      {
        perPage: 10,
      },
      status === 'authenticated',
    );

  const { data: trendingEvents, isLoading: isTrendingEventsLoading } =
    useListingTrendingEventsQuery({
      perPage: 8,
    });

  const {
    data: applicationClosingSoonEvents,
    isLoading: isApplicationClosingSoonEventsLoading,
  } = useSearchEventsQuery({
    sortBy: EventSortByCode.ApplicationEndAt,
    perPage: 8,
  });

  const { data: randomOrganizations, isLoading: isRandomOrganizationsLoading } =
    useListingRandomOrganizationsQuery();
  const { data: randomSpeakers } = useListingRandomSpeakersQuery();

  const { data: tagRankData } = useListingTagRankQuery();
  const { data: eventRankData } = useListingEventRankQuery();

  const { width = 800 } = useWindowDimensions();
  const router = useRouter();
  const [value, setValue] = useState<string>('');
  const [activeEvent, setActiveEvent] = useState<number>(0);

  const { deferredPrompt, promptInstall } = usePwaInstallPrompt();
  const [showPrompt, setShowPrompt] = useState(true);

  return (
    <div className='overflow-x-hidden'>
      {showPrompt && deferredPrompt && width < 450 && (
        <div className='fixed bottom-4 right-4 bg-white border p-4 rounded-md shadow-xl z-50'>
          <div className={clsx(styles.flexStart)}>
            <Image
              src='/icons/icon-192x192.png'
              alt='PWA Icon'
              width={48}
              height={48}
              className='rounded-full'
            />
            <p>📱 Cài đặt web app để có trải nghiệm tốt hơn! 🚀</p>
          </div>

          <div className={clsx(styles.flexStart, 'gap-2 mt-3')}>
            <Button
              className='bg-transparent  border px-10 font-bold'
              radius='sm'
              color='default'
              onPress={() => {
                setShowPrompt(false);
              }}
            >
              Đóng
            </Button>
            <Button
              className='text-info-main bg-transparent border-info-main border px-10 font-bold'
              radius='sm'
              variant='flat'
              onPress={promptInstall}
            >
              Cài đặt
            </Button>
          </div>
        </div>
      )}

      {/* === HERO SECTION === */}
      <section className='text-center flex items-center justify-center flex-col pt-20 pb-10 relative '>
        <div className='z-10'>
          <h2
            className={clsx(
              'flex justify-center items-center 450px:gap-5 gap-3 italic 450px:text-lg text-md',
            )}
          >
            <span>Khám phá</span>
            <MdOutlineExplore className='text-primary' />
            <span>Kết nối</span>
            <FaConnectdevelop className='text-primary' />
            <span>Trải nghiệm</span>
          </h2>
          <h1 className='450px:text-hg text-xm 450px:my-5 my-3 font-semibold'>
            Web(<span className='text-gradient'>Sem</span>)inar &
            <span className='text-gradient'> E</span>vent{' '}
            {new Date().getFullYear()} 🎉
          </h1>
          {status == 'unauthenticated' ||
            (width > 450 && (
              <p className='text-primary font-semibold mb-8'>
                Trải nghiệm sự kiện theo cách cá nhân hóa và đầy cảm hứng
              </p>
            ))}
          <Input
            className='450px:max-w-[500px] max-w-[300px] mt-5 mx-auto'
            placeholder='Tìm bất kỳ sự kiện nào bạn muốn...'
            startContent={
              <CiSearch className='w-5 h-5 pointer-events-none flex-shrink-0' />
            }
            onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) =>
              e.key === 'Enter' && router.push(`/search?keyword=${value}`)
            }
            value={value}
            onValueChange={setValue}
          />
        </div>

        <div className='bg-transparent h-[500px] w-full flex items-center justify-center absolute top-0 left-0'>
          <div className='relative w-full '>
            <div className='my-8 relative space-y-4 opacity-30'>
              {upcomingEvents && (
                <Image
                  src={upcomingEvents.data[activeEvent]?.coverImageUrl}
                  alt='Cover image'
                  className='w-full blur-xl'
                  classNames={{ wrapper: '!max-w-full' }}
                />
              )}
            </div>
          </div>
        </div>

        <div className='absolute top-[300px] left-0 z-0'>
          <Marquee className='opacity-5 text-[300px] strokeme'>VIEVENT</Marquee>
        </div>
      </section>

      {/* === EVENT SECTION === */}
      <section className='450px:py-10 450px:px-[15%] px-[5%]'>
        <Link
          className='text-orange-500 font-bold inline-flex justify-start gap-2 items-center cursor-pointer border-b border-b-orange-500 pb-2'
          href='/search?sort_by=TRENDING'
        >
          <span className={styles.flexStart}>
            <FaFireAlt className='text-red-500' />
            <span className='bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent'>
              Trending
            </span>
          </span>
          <MdKeyboardDoubleArrowRight size={20} />
        </Link>

        <div>
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
            slidesPerView={width <= 450 ? 1 : width > 1200 ? 4 : 2}
            spaceBetween={30}
            wrapperClass='pb-2'
            onSlideChange={(swipper) => setActiveEvent(swipper.activeIndex)}
          >
            {isTrendingEventsLoading && (
              <div className='flex justify-between 450px:gap-0 gap-10'>
                <EventCardSkeleton
                  direction='vertical'
                  variant='simple'
                />
                <EventCardSkeleton
                  direction='vertical'
                  variant='simple'
                />
                <EventCardSkeleton
                  direction='vertical'
                  variant='simple'
                />
                <EventCardSkeleton
                  direction='vertical'
                  variant='simple'
                />
              </div>
            )}
            {!isTrendingEventsLoading &&
              trendingEvents &&
              trendingEvents.data.map((event, i) => (
                <SwiperSlide
                  key={`trending-${event.id}`}
                  className={clsx('dark:rounded-lg dark:p-0 mt-2')}
                >
                  <EventCard
                    direction={
                      width > 800 || width <= 450 ? 'vertical' : 'horizontal'
                    }
                    event={event}
                    variant='standard'
                    trendingOrderNumber={i + 1}
                    hasOrganizationInfo={false}
                  />
                </SwiperSlide>
              ))}
          </Swiper>
        </div>

        <div className='450px:mb-6'>
          {!isRecommendationEventsLoading &&
            recommendedEvents &&
            recommendedEvents?.data?.length > 0 && (
              <RecommendedEvents events={recommendedEvents.data} />
            )}
        </div>

        <Link
          className='text-warning font-bold inline-flex justify-start gap-2 items-center cursor-pointer border-b border-b-warning pb-2 mt-8'
          href='/search?sort_by=START_AT'
        >
          Sự kiện sắp diễn ra
          <MdKeyboardDoubleArrowRight size={20} />
        </Link>
        <div>
          <Swiper
            key={width > 1200 ? 2 : 1}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            freeMode={true}
            modules={[Autoplay, Navigation, FreeMode]}
            pagination={{
              clickable: true,
            }}
            slidesPerView={width > 1200 ? 2 : 1}
            spaceBetween={30}
            wrapperClass='pb-2'
          >
            {isUpcomingEventsLoading && (
              <div className='450px:flex 450px:justify-between gap-8'>
                <EventCardSkeleton
                  direction='horizontal'
                  variant='simple'
                />
                <EventCardSkeleton
                  direction='horizontal'
                  variant='simple'
                  className='450px:block hidden'
                />
              </div>
            )}
            {!isUpcomingEventsLoading &&
              upcomingEvents &&
              upcomingEvents.data.map((event) => (
                <SwiperSlide
                  key={`upcoming-${event.id}`}
                  className={clsx('dark:rounded-lg dark:p-0')}
                >
                  <EventCard
                    direction={width <= 450 ? 'vertical' : 'horizontal'}
                    event={event}
                    variant='standard'
                    className='mt-2'
                    hasOrganizationInfo={false}
                  />
                </SwiperSlide>
              ))}
          </Swiper>
        </div>

        <Link
          className='text-warning font-bold inline-flex justify-start gap-2 items-center cursor-pointer border-b border-b-warning pb-2 mt-8'
          href='/search?sort_by=APPLICATION_END_AT'
        >
          Sự kiện sắp kết thúc đăng ký
          <MdKeyboardDoubleArrowRight size={20} />
        </Link>
        <div>
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
            slidesPerView={width <= 450 ? 1 : width > 1200 ? 4 : 2}
            spaceBetween={30}
            wrapperClass='pb-2'
            onSlideChange={(swipper) => setActiveEvent(swipper.activeIndex)}
          >
            {isApplicationClosingSoonEventsLoading && (
              <div className='flex justify-between 450px:gap-0 gap-10'>
                <EventCardSkeleton
                  direction='vertical'
                  variant='simple'
                />
                <EventCardSkeleton
                  direction='vertical'
                  variant='simple'
                />
                <EventCardSkeleton
                  direction='vertical'
                  variant='simple'
                />
                <EventCardSkeleton
                  direction='vertical'
                  variant='simple'
                />
              </div>
            )}
            {!isApplicationClosingSoonEventsLoading &&
              applicationClosingSoonEvents &&
              applicationClosingSoonEvents.data.map((event) => (
                <SwiperSlide
                  key={`acs-${event.id}`}
                  className={clsx('dark:rounded-lg dark:p-0 mt-2')}
                >
                  <EventCard
                    direction={
                      width > 800 || width <= 450 ? 'vertical' : 'horizontal'
                    }
                    event={event}
                    variant='standard'
                  />
                </SwiperSlide>
              ))}
          </Swiper>
        </div>
      </section>

      {/* === ORGANIZATION SECTION === */}
      <section className='450px:px-[15%] px-[5%] mb-7 450px:mt-0 mt-4'>
        <div className='flex flex-wrap justify-between items-start gap-10 1200px:flex-row flex-col'>
          <div className='1200px:w-[70%] w-full'>
            <h2 className='450px:text-xl text-lg text-primary font-semibold flex justify-start items-center gap-2'>
              {t('common.text.organization')} <GoOrganization />
            </h2>
            <h3 className='450px:text-xm text-md text-gray-600 font-light'>
              Follow các tổ chức để cập nhật thông tin mới nhất về các sự kiện,
              hội thảo và hoạt động thú vị từ các tổ chức hàng đầu.
            </h3>
            <div className='grid items-center gap-4 mt-6 1200px:grid-cols-3 450px:grid-cols-2 grid-cols-1'>
              {randomOrganizations &&
                randomOrganizations.data?.length > 0 &&
                randomOrganizations.data.map((organization, i) => (
                  <OrganizationCard
                    key={`org-${i}`}
                    organization={organization}
                  />
                ))}

              {isRandomOrganizationsLoading && (
                <>
                  <OrganizationCardSkeleton />
                  <OrganizationCardSkeleton />
                  <OrganizationCardSkeleton />
                </>
              )}
            </div>
            <div className='flex 450px:flex-row flex-col justify-between gap-2 items-center bg-info-sub 450px:mt-8 mt-4 rounded-md 450px:px-10 p-4 450px:py-8'>
              <div>
                <h3 className='font-semibold 450px:text-xm text-md text-info-main'>
                  Bắt đầu một sự kiện với Vievent
                </h3>
                <p className='font-light opacity-75'>
                  Bất kỳ ai cũng có thể tạo trang sự kiện miễn phí bằng cách tạo
                  một tổ chức. Bạn có thể tạo một trang sự kiện để quảng bá sự
                  kiện của mình, thu hút người tham gia và quản lý đăng ký.
                  <br />
                  <span className='font-semibold'>
                    Vievent sẽ giúp bạn quản lý sự kiện một cách dễ dàng và hiệu
                    quả.
                  </span>
                </p>
              </div>
              <Button
                className='mt-3 text-info-main bg-transparent border-info-main border px-10 font-bold'
                radius='sm'
                variant='flat'
                onPress={() =>
                  status == 'unauthenticated' &&
                  router.push('/organization/login')
                }
              >
                Tạo sự kiện mới
              </Button>
            </div>
          </div>
          <div className='1200px:w-[25%] w-full'>
            <h2 className='450px:text-xl text-lg flex justify-end gap-1 items-center text-warning-main font-semibold'>
              Ranking <PiRankingFill />
            </h2>
            <div className='flex gap-5 items-center justify-between w-full pt-8'>
              <RankingList
                data={tagRankData?.tags}
                title='Tags'
                isTranslation
              />
            </div>
            <div className='flex gap-5 items-center justify-between w-full pt-8'>
              <RankingList
                data={eventRankData?.events}
                title={t('common.text.events')}
                onClick={(item) =>
                  item.slug && router.push(`events/${item.slug}`)
                }
              />
            </div>
          </div>
        </div>
      </section>

      {/* === SPEAKER SECTION === */}
      <section className='pb-[40px] 450px:px-[15%] px-[5%]'>
        <div>
          <h2 className='450px:text-xl text-lg text-purple-main font-semibold flex justify-start items-center gap-2'>
            Diễn giả <GiMicrophone />
          </h2>
          <h3 className='450px:text-xm text-md text-gray-600 font-light'>
            Tham gia cùng các diễn giả hàng đầu trong lĩnh vực của bạn.
          </h3>
          <div className='grid gap-5 items-center justify-between mt-6 1200px:grid-cols-4 grid-cols-2'>
            {randomSpeakers &&
              randomSpeakers?.data?.map((speaker, i) => (
                <SpeakerCard
                  key={`speaker-${i}`}
                  speaker={speaker}
                />
              ))}
          </div>
        </div>
      </section>
    </div>
  );
}
