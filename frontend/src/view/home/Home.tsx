'use client';

import clsx from 'clsx';
import { MdKeyboardDoubleArrowRight, MdOutlineExplore } from 'react-icons/md';
import { FaConnectdevelop } from 'react-icons/fa';
import { Input } from '@nextui-org/input';
import { CiSearch } from 'react-icons/ci';
import Link from 'next/link';
import { PiRankingFill } from 'react-icons/pi';
import { GoOrganization } from 'react-icons/go';
import { GiMicrophone, GiPartyPopper } from 'react-icons/gi';

import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { Autoplay, FreeMode, Navigation } from 'swiper/modules';
import { Button } from '@nextui-org/button';
import { Image, Kbd } from '@nextui-org/react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Organization } from '@/src/component/common/Card/OrganizationCard';
import useWindowDimensions from '@/src/hook/useWindowDimension';
import OrganizationCard from '@/src/component/common/Card/OrganizationCard';
import RankingList from '@/src/component/common/Ranking/RankingList';
import SpeakerCard from '@/src/component/common/Card/SpeakerCard';
import {
  useListingEventRankQuery,
  useSearchEventsQuery,
} from '@/src/api/event.api';
import { EventSortByCode } from '@/src/lib/api/generated';
import EventCard from '@/src/component/common/Card/EventCard';
import EventCardSkeleton from '@/src/component/common/Card/EventCardSkeleton';
import { useListingTagRankQuery } from '@/src/api/tag.api';
import Marquee from 'react-fast-marquee';

interface HeadingGroupProps {
  heading: string | ReactNode;
  subheading: string;
  className?: string;
}

const HeadingGroup = ({
  heading,
  subheading,
  className,
}: HeadingGroupProps) => {
  return (
    <div className={clsx('mb-12 text-center ', className)}>
      <h2 className='text-xl text-primary font-semibold'>{heading}</h2>
      <h3 className='text-xm text-gray-600 font-light'>{subheading}</h3>
    </div>
  );
};

const organizations: Organization[] = [
  { id: 1, name: 'Viettel', avatar_url: '' },
  { id: 2, name: 'HUST', avatar_url: '' },
  { id: 3, name: 'Theinfitech', avatar_url: '' },
  { id: 4, name: 'VinGroup', avatar_url: '' },
  { id: 5, name: 'Google', avatar_url: '' },
];

export default function Home() {
  const { data: upcomingEvents, isLoading: isUpcomingEventsLoading } =
    useSearchEventsQuery({
      sortBy: EventSortByCode.StartAt,
      perPage: 8,
    });

  const {
    data: applicationClosingSoonEvents,
    isLoading: isApplicationClosingSoonEventsLoading,
  } = useSearchEventsQuery({
    sortBy: EventSortByCode.ApplicationEndAt,
    perPage: 8,
  });

  const { data: tagRankData } = useListingTagRankQuery();
  const { data: eventRankData } = useListingEventRankQuery();

  const { width = 800 } = useWindowDimensions();
  const router = useRouter();
  const [value, setValue] = useState<string>('');
  const [activeEvent, setActiveEvent] = useState<number>(0);

  return (
    <div className='overflow-x-hidden'>
      {/* === HERO SECTION === */}
      <section className='text-center flex items-center justify-center flex-col pt-20 pb-10 relative '>
        <div className='z-10'>
          <h2
            className={clsx(
              'flex justify-center items-center gap-5 italic text-lg',
            )}
          >
            <span>Explore</span>
            <MdOutlineExplore className='text-primary' />
            <span>Connect</span>
            <FaConnectdevelop className='text-primary' />
            <span>Elevate</span>
          </h2>
          <h1 className='text-hg my-5 font-semibold'>
            Web(<span className='text-gradient'>Sem</span>)inar &{' '}
            <span className='text-gradient'>E</span>vent 2024 🎉
          </h1>
          <p className='text-primary font-semibold mb-8'>
            Search site for business seminars focusing on digital and AI
            utilization
          </p>
          <span className='border-t-1 border-gray-600 border-b-1 py-1 px-4'>
            🚀 | YOU&apos;VE GOT PLANS?
          </span>
          <Input
            className='max-w-[500px] mt-5 mx-auto'
            placeholder='Search any event you want.'
            startContent={
              <CiSearch className='w-5 h-5 pointer-events-none flex-shrink-0' />
            }
            onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) =>
              e.key === 'Enter' && router.push(`/search?name=${value}`)
            }
            value={value}
            onValueChange={setValue}
            endContent={<Kbd keys={['enter']}>Enter</Kbd>}
          />
        </div>

        <div className='bg-transparent h-[500px] w-full flex items-center justify-center absolute top-0 left-0'>
          <div className='relative w-full '>
            <div className='my-8 relative space-y-4 opacity-30'>
              {upcomingEvents && (
                <Image
                  src={upcomingEvents.data[activeEvent].coverImageUrl}
                  alt='Cover image'
                  className='w-full blur-xl'
                  classNames={{ wrapper: '!max-w-full' }}
                />
              )}
            </div>
          </div>
        </div>

        <div className='absolute top-[300px] left-0 z-0'>
          <Marquee className='opacity-5 text-[300px] strokeme'>
            ROOMINAR
          </Marquee>
        </div>
      </section>

      {/* === EVENT SECTION === */}
      <section className='py-[40px] px-[15%]'>
        <HeadingGroup
          heading={
            <span className='flex justify-center gap-2 items-center text-green-500'>
              Events <GiPartyPopper />
            </span>
          }
          subheading='Elevate your virtual experiences with our all-in-one webinar and event management solutions.'
        />
        <Link
          className='text-primary font-bold inline-flex justify-start gap-2 items-center cursor-pointer border-b border-b-primary pb-2'
          href='/search?sort_by=START_AT'
        >
          Upcoming Event <MdKeyboardDoubleArrowRight size={20} />
        </Link>

        <div className='border-l border-l-primary'>
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
            wrapperClass='pb-2'
            onSlideChange={(swipper) => setActiveEvent(swipper.activeIndex)}
          >
            {isUpcomingEventsLoading && (
              <div className='flex justify-between'>
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
            {!isUpcomingEventsLoading &&
              upcomingEvents &&
              upcomingEvents.data.map((event) => (
                <SwiperSlide
                  key={event.id}
                  className={clsx('dark:rounded-lg dark:p-0')}
                >
                  <EventCard
                    direction={width > 800 ? 'vertical' : 'horizontal'}
                    event={event}
                    variant='simple'
                  />
                </SwiperSlide>
              ))}
          </Swiper>
        </div>
        <Link
          className='text-warning font-bold inline-flex justify-start gap-2 items-center cursor-pointer border-b border-b-warning pb-2 mt-8'
          href='/search?sort_by=APPLICATION_END_AT'
        >
          Application Closing Soon Event{' '}
          <MdKeyboardDoubleArrowRight size={20} />
        </Link>
        <div className='border-l border-l-warning'>
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
            {isApplicationClosingSoonEventsLoading && (
              <div className='flex justify-between gap-8'>
                <EventCardSkeleton
                  direction='horizontal'
                  variant='simple'
                />
                <EventCardSkeleton
                  direction='horizontal'
                  variant='simple'
                />
              </div>
            )}
            {!isApplicationClosingSoonEventsLoading &&
              applicationClosingSoonEvents &&
              applicationClosingSoonEvents.data.map((event) => (
                <SwiperSlide
                  key={event.id}
                  className={clsx('dark:rounded-lg dark:p-0')}
                >
                  <EventCard
                    direction='horizontal'
                    event={event}
                    variant='simple'
                  />
                </SwiperSlide>
              ))}
          </Swiper>
        </div>
      </section>

      {/* === ORGANIZATION SECTION === */}
      <section className='px-[15%] mb-7'>
        <div
          className={clsx(
            'flex flex-wrap justify-between items-start gap-10',
            width > 1200 ? 'flex-row' : 'flex-col',
          )}
        >
          <div className={clsx(width > 1200 ? 'w-[70%]' : 'w-full')}>
            <h2 className='text-xl text-primary font-semibold flex justify-start items-center gap-2'>
              Organization <GoOrganization />
            </h2>
            <h3 className='text-xm text-gray-600 font-light'>
              Follow us to receive the latest news from the organization.
            </h3>
            <div
              className={clsx(
                'grid items-center gap-4 mt-6 ',
                width > 1200 ? ' grid-cols-3' : ' grid-cols-2 ',
              )}
            >
              {organizations.map((org, i) => (
                <OrganizationCard
                  key={`org-${i}`}
                  organization={org}
                />
              ))}
            </div>
            <div className='flex justify-between gap-2 items-center bg-info-sub mt-8 rounded-md px-10 py-8'>
              <div>
                <h3 className='font-semibold text-xm text-info-main'>
                  Start an event with Roominar
                </h3>
                <p className='font-light opacity-75'>
                  Anyone can create an event page for free by creating a group.
                  Why not publish an event for sharing information and
                  interacting with others on Roominar?
                </p>
              </div>
              <Button
                className='mt-3 text-info-main bg-transparent border-info-main border px-10 font-bold'
                radius='sm'
                variant='flat'
              >
                Create a free event
              </Button>
            </div>
          </div>
          <div className={clsx(width > 1200 ? 'w-[25%]' : 'w-full')}>
            <h2 className='text-xl flex justify-end gap-1 items-center text-warning-main font-semibold'>
              Ranking <PiRankingFill />
            </h2>
            <div className='flex gap-5 items-center justify-between overflow-x-scroll w-full pt-8'>
              <RankingList
                data={tagRankData?.tags}
                title='Tags'
              />
            </div>
            <div className='flex gap-5 items-center justify-between overflow-x-scroll w-full pt-8'>
              <RankingList
                data={eventRankData?.events}
                title='Events'
                onClick={(item) =>
                  item.slug && router.push(`events/${item.slug}`)
                }
              />
            </div>
          </div>
        </div>
      </section>

      {/* === SPEAKER SECTION === */}
      <section className='pb-[40px] px-[15%]'>
        <div>
          <h2 className='text-xl text-purple-main font-semibold flex justify-start items-center gap-2'>
            Speaker <GiMicrophone />
          </h2>
          <h3 className='text-xm text-gray-600 font-light'>
            Inspiring insights from visionary Speaker.
          </h3>
          <div className='flex gap-5 items-center justify-between mt-6 flex-wrap'>
            {[10, 11, 12, 15].map((speaker, i) => (
              <SpeakerCard key={`speaker-${i}`} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
