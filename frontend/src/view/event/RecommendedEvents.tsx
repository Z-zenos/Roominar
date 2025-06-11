'use client';

import { styles } from '@/src/constants/styles.constant';
import useFormatMoney from '@/src/hooks/useFormatMoney';
import type { SearchEventsItem } from '@/src/lib/api/generated';
import { formatEventDate } from '@/src/utils/app.util';
import { Image, Link } from '@nextui-org/react';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { IoTicketOutline } from 'react-icons/io5';
import { MdKeyboardDoubleArrowRight } from 'react-icons/md';

interface RecommendedEventsProps {
  events: SearchEventsItem[]; // Replace 'any' with a more specific type if available
}

export default function RecommendedEvents({ events }: RecommendedEventsProps) {
  const router = useRouter();
  const formatMoney = useFormatMoney();

  const imageCards = [
    <div
      key='1'
      onClick={() => router.push(`events/${events[0]?.slug}`)}
      hidden={!events[0]}
      className='group bg-white rounded-xl shadow-2xl/10 border-0 overflow-hidden transition-all duration-300 hover:-translate-y-1'
    >
      <div className='relative overflow-hidden p-4'>
        <Image
          src={events[0]?.coverImageUrl}
          alt={events[0]?.name}
          className='w-full h-48 object-cover rounded-md transition-transform duration-300 group-hover:scale-105'
        />
      </div>
      <div className='p-5 pt-1'>
        <h3 className='font-semibold text-gray-900 text-nm mb-2 group-hover:text-blue-600 transition-colors'>
          🗓️ {formatEventDate(events[0]?.startAt)}
        </h3>
        <p className='text-gray-600 text-nm leading-relaxed'>
          {events[0]?.name}
        </p>
        <div className='mt-3 flex items-center text-xs text-gray-400'>
          <span className='bg-green-100 text-green-700 px-2 py-1 rounded-md'>
            <span
              className={clsx(
                styles.flexStart,
                'text-sm font-medium text-green-500',
              )}
            >
              <IoTicketOutline className='w-6 h-6' />
              {events[0]?.minTicketPrice > 0
                ? `Chỉ từ ${formatMoney(events[0].minTicketPrice)}`
                : 'Miễn phí'}
            </span>
          </span>
        </div>
      </div>
    </div>,

    <div
      key='2'
      onClick={() => router.push(`events/${events[1]?.slug}`)}
      hidden={!events[1]}
      className='group bg-white rounded-xl shadow-2xl/10 border-0 overflow-hidden transition-all duration-300 hover:-translate-y-1'
    >
      <div className='relative overflow-hidden p-4'>
        <Image
          src={events[1]?.coverImageUrl}
          alt={events[1]?.name}
          className='w-full h-64 object-cover rounded-md transition-transform duration-300 group-hover:scale-105'
        />
      </div>
      <div className='p-5 pt-1'>
        <h3 className='font-semibold text-gray-900 text-nm mb-2 group-hover:text-blue-600 transition-colors'>
          🗓️ {formatEventDate(events[1]?.startAt)}
        </h3>
        <p className='text-gray-600 text-nm leading-relaxed'>
          {events[1]?.name}
        </p>
        <div className='mt-3 flex items-center text-xs text-gray-400'>
          <span className='bg-blue-100 text-blue-700 px-2 py-1 rounded-md'>
            <span
              className={clsx(
                styles.flexStart,
                'text-sm font-medium text-green-500',
              )}
            >
              <IoTicketOutline className='w-6 h-6' />
              {events[1]?.minTicketPrice > 0
                ? `Chỉ từ ${formatMoney(events[1].minTicketPrice)}`
                : 'Miễn phí'}
            </span>
          </span>
        </div>
      </div>
    </div>,

    <div
      key='3'
      onClick={() => router.push(`events/${events[2]?.slug}`)}
      hidden={!events[2]}
      className='group bg-white rounded-xl shadow-2xl/10 border-0 overflow-hidden transition-all duration-300 hover:-translate-y-1'
    >
      <div className='relative overflow-hidden p-4'>
        <Image
          src={events[2]?.coverImageUrl}
          alt={events[2]?.name}
          className='w-full h-32 object-cover rounded-md transition-transform duration-300 group-hover:scale-105'
        />
      </div>
      <div className='p-5 pt-1'>
        <h3 className='font-semibold text-gray-900 text-nm mb-2 group-hover:text-blue-600 transition-colors'>
          🗓️ {formatEventDate(events[2]?.startAt)}
        </h3>
        <p className='text-gray-600 text-nm leading-relaxed'>
          {events[2]?.name}
        </p>
        <div className='mt-3 flex items-center text-xs text-gray-400'>
          <span className='bg-purple-100 text-purple-700 px-2 py-1 rounded-md'>
            <span
              className={clsx(
                styles.flexStart,
                'text-sm font-medium text-green-500',
              )}
            >
              <IoTicketOutline className='w-6 h-6' />
              {events[2]?.minTicketPrice > 0
                ? `Chỉ từ ${formatMoney(events[2].minTicketPrice)}`
                : 'Miễn phí'}
            </span>
          </span>
        </div>
      </div>
    </div>,

    <div
      key='4'
      onClick={() => router.push(`events/${events[3]?.slug}`)}
      hidden={!events[3]}
      className='group bg-white rounded-xl shadow-2xl/10 border-0 overflow-hidden transition-all duration-300 hover:-translate-y-1'
    >
      <div className='relative overflow-hidden p-4'>
        <Image
          src={events[3]?.coverImageUrl}
          alt={events[3]?.name}
          className='w-full h-56 object-cover rounded-md transition-transform duration-300 group-hover:scale-105'
        />
      </div>
      <div className='p-5 pt-1'>
        <h3 className='font-semibold text-gray-900 text-nm mb-2 group-hover:text-blue-600 transition-colors'>
          🗓️ {formatEventDate(events[3]?.startAt)}
        </h3>
        <p className='text-gray-600 text-nm leading-relaxed'>
          {events[3]?.name}
        </p>
        <div className='mt-3 flex items-center text-xs text-gray-400'>
          <span className='bg-orange-100 text-orange-700 px-2 py-1 rounded-md'>
            <span
              className={clsx(
                styles.flexStart,
                'text-sm font-medium text-green-500',
              )}
            >
              <IoTicketOutline className='w-6 h-6' />
              {events[3]?.minTicketPrice > 0
                ? `Chỉ từ ${formatMoney(events[3].minTicketPrice)}`
                : 'Miễn phí'}
            </span>
          </span>
        </div>
      </div>
    </div>,

    <div
      key='5'
      onClick={() => router.push(`events/${events[4]?.slug}`)}
      hidden={!events[4]}
      className='group bg-white rounded-xl shadow-2xl/10 border-0 overflow-hidden transition-all duration-300 hover:-translate-y-1'
    >
      <div className='relative overflow-hidden p-4'>
        <Image
          src={events[4]?.coverImageUrl}
          alt={events[4]?.name}
          className='w-full h-44 object-cover rounded-md transition-transform duration-300 group-hover:scale-105'
        />
      </div>
      <div className='p-5 pt-1'>
        <h3 className='font-semibold text-gray-900 text-nm mb-2 group-hover:text-blue-600 transition-colors'>
          🗓️ {formatEventDate(events[4]?.startAt)}
        </h3>
        <p className='text-gray-600 text-nm leading-relaxed'>
          {events[4]?.name}
        </p>
        <div className='mt-3 flex items-center text-xs text-gray-400'>
          <span className='bg-cyan-100 text-cyan-700 px-2 py-1 rounded-md'>
            <span
              className={clsx(
                styles.flexStart,
                'text-sm font-medium text-green-500',
              )}
            >
              <IoTicketOutline className='w-6 h-6' />
              {events[4]?.minTicketPrice > 0
                ? `Chỉ từ ${formatMoney(events[4].minTicketPrice)}`
                : 'Miễn phí'}
            </span>
          </span>
        </div>
      </div>
    </div>,

    <div
      key='6'
      onClick={() => router.push(`events/${events[5]?.slug}`)}
      hidden={!events[5]}
      className='group bg-white rounded-xl shadow-2xl/10 border-0 overflow-hidden transition-all duration-300 hover:-translate-y-1'
    >
      <div className='relative overflow-hidden p-4'>
        <Image
          src={events[5]?.coverImageUrl}
          alt={events[5]?.name}
          className='w-full h-52 object-cover rounded-md transition-transform duration-300 group-hover:scale-105'
        />
      </div>
      <div className='p-5 pt-1'>
        <h3 className='font-semibold text-gray-900 text-nm mb-2 group-hover:text-blue-600 transition-colors'>
          🗓️ {formatEventDate(events[5]?.startAt)}
        </h3>
        <p className='text-gray-600 text-nm leading-relaxed'>
          {events[5]?.name}
        </p>
        <div className='mt-3 flex items-center text-xs text-gray-400'>
          <span className='bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md'>
            <span
              className={clsx(
                styles.flexStart,
                'text-sm font-medium text-green-500',
              )}
            >
              <IoTicketOutline className='w-6 h-6' />
              {events[5]?.minTicketPrice > 0
                ? `Chỉ từ ${formatMoney(events[5].minTicketPrice)}`
                : 'Miễn phí'}
            </span>
          </span>
        </div>
      </div>
    </div>,

    <div
      key='7'
      onClick={() => router.push(`events/${events[6]?.slug}`)}
      hidden={!events[6]}
      className='group bg-white rounded-xl shadow-2xl/10 border-0 overflow-hidden transition-all duration-300 hover:-translate-y-1'
    >
      <div className='relative overflow-hidden p-4'>
        <Image
          src={events[6]?.coverImageUrl}
          alt={events[6]?.name}
          className='w-full h-60 object-cover rounded-md transition-transform duration-300 group-hover:scale-105'
        />
      </div>
      <div className='p-5 pt-1'>
        <h3 className='font-semibold text-gray-900 text-nm mb-2 group-hover:text-blue-600 transition-colors'>
          🗓️ {formatEventDate(events[6]?.startAt)}
        </h3>
        <p className='text-gray-600 text-nm leading-relaxed'>
          {events[6]?.name}
        </p>
        <div className='mt-3 flex items-center text-xs text-gray-400'>
          <span className='bg-pink-100 text-pink-700 px-2 py-1 rounded-md'>
            <span
              className={clsx(
                styles.flexStart,
                'text-sm font-medium text-green-500',
              )}
            >
              <IoTicketOutline className='w-6 h-6' />
              {events[6]?.minTicketPrice > 0
                ? `Chỉ từ ${formatMoney(events[6].minTicketPrice)}`
                : 'Miễn phí'}
            </span>
          </span>
        </div>
      </div>
    </div>,

    <div
      key='8'
      onClick={() => router.push(`events/${events[7]?.slug}`)}
      hidden={!events[7]}
      className='group bg-white rounded-xl shadow-2xl/10 border-0 overflow-hidden transition-all duration-300 hover:-translate-y-1'
    >
      <div className='relative overflow-hidden p-4'>
        <Image
          src={events[7]?.coverImageUrl}
          alt={events[7]?.name}
          className='w-full h-40 object-cover rounded-md transition-transform duration-300 group-hover:scale-105'
        />
      </div>
      <div className='p-5 pt-1'>
        <h3 className='font-semibold text-gray-900 text-nm mb-2 group-hover:text-blue-600 transition-colors'>
          🗓️ {formatEventDate(events[7]?.startAt)}
        </h3>
        <p className='text-gray-600 text-nm leading-relaxed'>
          {events[7]?.name}
        </p>
        <div className='mt-3 flex items-center text-xs text-gray-400'>
          <span className='bg-yellow-100 text-yellow-700 px-2 py-1 rounded-md'>
            <span
              className={clsx(
                styles.flexStart,
                'text-sm font-medium text-green-500',
              )}
            >
              <IoTicketOutline className='w-6 h-6' />
              {events[7]?.minTicketPrice > 0
                ? `Chỉ từ ${formatMoney(events[7].minTicketPrice)}`
                : 'Miễn phí'}
            </span>
          </span>
        </div>
      </div>
    </div>,

    <div
      key='9'
      onClick={() => router.push(`events/${events[8]?.slug}`)}
      hidden={!events[8]}
      className='group bg-white rounded-xl shadow-2xl/10 border-0 overflow-hidden transition-all duration-300 hover:-translate-y-1'
    >
      <div className='relative overflow-hidden p-4'>
        <Image
          src={events[8]?.coverImageUrl}
          alt={events[8]?.name}
          className='w-full h-56 object-cover rounded-md transition-transform duration-300 group-hover:scale-105'
        />
      </div>
      <div className='p-5 pt-1'>
        <h3 className='font-semibold text-gray-900 text-nm mb-2 group-hover:text-blue-600 transition-colors'>
          🗓️ {formatEventDate(events[8]?.startAt)}
        </h3>
        <p className='text-gray-600 text-nm leading-relaxed'>
          {events[8]?.name}
        </p>
        <div className='mt-3 flex items-center text-xs text-gray-400'>
          <span className='bg-slate-100 text-slate-700 px-2 py-1 rounded-md'>
            <span
              className={clsx(
                styles.flexStart,
                'text-sm font-medium text-green-500',
              )}
            >
              <IoTicketOutline className='w-6 h-6' />
              {events[8]?.minTicketPrice > 0
                ? `Chỉ từ ${formatMoney(events[8].minTicketPrice)}`
                : 'Miễn phí'}
            </span>
          </span>
        </div>
      </div>
    </div>,

    <div
      key='10'
      onClick={() => router.push(`events/${events[9]?.slug}`)}
      hidden={!events[9]}
      className='group bg-white rounded-xl shadow-2xl/10 border-0 overflow-hidden transition-all duration-300 hover:-translate-y-1'
    >
      <div className='relative overflow-hidden p-4'>
        <Image
          src={events[9]?.coverImageUrl}
          alt={events[9]?.name}
          className='w-full h-48 object-cover rounded-md transition-transform duration-300 group-hover:scale-105'
        />
      </div>
      <div className='p-5 pt-1'>
        <h3 className='font-semibold text-gray-900 text-nm mb-2 group-hover:text-blue-600 transition-colors'>
          🗓️ {formatEventDate(events[9]?.startAt)}
        </h3>
        <p className='text-gray-600 text-nm leading-relaxed'>
          {events[9]?.name}
        </p>
        <div className='mt-3 flex items-center text-xs text-gray-400'>
          <span className='bg-gray-100 text-gray-700 px-2 py-1 rounded-md'>
            <span
              className={clsx(
                styles.flexStart,
                'text-sm font-medium text-green-500',
              )}
            >
              <IoTicketOutline className='w-6 h-6' />
              {events[9]?.minTicketPrice > 0
                ? `Chỉ từ ${formatMoney(events[9].minTicketPrice)}`
                : 'Miễn phí'}
            </span>
          </span>
        </div>
      </div>
    </div>,
  ];

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 rounded-md pt-1 pb-4 mt-12 px-6 mb-6`}
    >
      <Link
        className='text-success font-bold flex justify-center gap-2 items-center cursor-pointer border-b border-b-success pb-2 mt-4 mb-4'
        href='/search?sort_by=APPLICATION_END_AT'
      >
        Sự kiện phù hợp với bạn
        <MdKeyboardDoubleArrowRight size={20} />
      </Link>
      <div className='max-w-7xl mx-auto space-y-20'>
        {/* Image Gallery Demo */}
        <section>
          <div
            className={`
        columns-1
        sm:columns-2
        md:columns-3
        lg:columns-4
        xl:columns-5
        gap-4
        space-y-4
      `}
          >
            {imageCards.map((child, index) => (
              <div
                key={index}
                className='break-inside-avoid mb-4 shadow-sm cursor-pointer'
              >
                {child}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
