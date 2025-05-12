'use client';

import React from 'react';
import { useGetSpeakerDetailQuery } from '@/src/api/speaker.api';
import { Image } from '@nextui-org/react';
import DotLoader from '@/src/component/common/Loader/DotLoader';
import Badge from '@/src/component/common/Badge';
import { useTranslations } from 'next-intl';
import {
  FaEnvelope,
  FaFacebook,
  FaLinkedin,
  FaPhoneAlt,
  FaTwitter,
  FaYoutube,
} from 'react-icons/fa';

interface SpeakerProfileProps {
  slug: string;
}

export default function SpeakerProfile({ slug }: SpeakerProfileProps) {
  const t = useTranslations('code');
  const { data: speaker, isLoading: isLoadingGetSpeakerDetail } =
    useGetSpeakerDetailQuery({ slug: slug });

  return isLoadingGetSpeakerDetail ? (
    <DotLoader />
  ) : (
    <div className='max-w-[800px] mx-auto grid grid-cols-3 gap-4 items-center'>
      <div className='p-6 space-y-6 col-span-2'>
        {/* Header */}
        <div className='flex items-center space-x-4'>
          <Image
            src={speaker.avatarUrl}
            alt='avatar'
            className='w-32 h-32 object-cover'
            radius='md'
          />
          <div>
            <h2 className='text-xl font-semibold'>
              {speaker.firstName} {speaker.lastName}
            </h2>
            {/* <p className='text-sm text-gray-400'>1990/12/12 (${18} y/o)</p> */}
            {/* <p className='text-green-400 font-semibold'>${45}/h</p> */}
          </div>
        </div>

        {/* Resume */}
        {/* {speaker.resume_url && (
        <div>
          <a
            href={speaker.resume_url}
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-gray-200'
          >
            <FaDownload className='text-gray-700' /> Resume (.pdf)
          </a>
        </div>
      )} */}

        {/* Skills */}
        <div>
          <h3 className='text-sm text-gray-400 uppercase'>Skills</h3>
          {speaker?.skills && (
            <div className='flex flex-wrap gap-2 mt-2 text-white'>
              {speaker?.skills?.map((skill, index) => (
                <Badge
                  title={skill}
                  key={`skill-${index}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Certifications */}
        <div>
          <h3 className='text-sm text-gray-400 uppercase mb-2'>Description</h3>
          <p className='font-light '>{speaker.description}</p>
          {/* <div className='space-y-2'>
          {speaker.certificates?.map((cert, i) => (
            <a
              key={i}
              href={cert.url}
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center gap-2 text-sm text-blue-400 hover:underline'
            >
              <FaFilePdf /> {cert.name} ({cert.ext})
            </a>
          ))}
        </div> */}
        </div>

        {/* General Info */}
        <div>
          <h3 className='text-sm text-gray-400 uppercase'>General</h3>
          <div className='flex justify-between items-center mt-2'>
            <span>Financial reward</span>
          </div>
          {/* {speaker.start_date && (
          <div className='flex justify-between items-center mt-2'>
            <span>Start of work</span>
            <span className='text-gray-300 flex items-center gap-2'>
              <FaCalendarAlt /> {speaker.start_date}
            </span>
          </div>
        )} */}
        </div>

        {/* Absences */}
        <div>
          <h3 className='text-sm text-gray-400 uppercase'>Industry / Job</h3>
          <div className='flex mt-2'>
            <div className='underline text-sm'>
              {t(`industry.${speaker.industryCode}`)}
            </div>
            ,
            <div className='underline text-sm ml-1'>
              {t(`jobType.${speaker.jobTypeCode}`)}
            </div>
          </div>
        </div>
      </div>
      <div className=''>
        <h3 className='text-sm text-gray-400 uppercase'>Contacts</h3>
        <div className='mt-2 space-y-1 text-sm w-full'>
          {speaker.phone && (
            <p className='text-nm font-light'>
              <FaPhoneAlt className='inline mr-2 text-primary text-md' />
              {speaker.phone}
            </p>
          )}
          {speaker.email && (
            <p className='text-nm font-light'>
              <FaEnvelope className='inline mr-2 text-primary text-md' />
              {speaker.email}
            </p>
          )}
        </div>

        {/* Social Links */}
        <div className='flex gap-3 mt-3 text-lg'>
          {speaker.facebookUrl && (
            <a
              href={speaker.facebookUrl}
              target='_blank'
              rel='noreferrer'
            >
              <FaFacebook className='text-blue-500' />
            </a>
          )}
          {speaker.twitterUrl && (
            <a
              href={speaker.twitterUrl}
              target='_blank'
              rel='noreferrer'
            >
              <FaTwitter className='text-sky-400' />
            </a>
          )}
          {speaker.linkedinUrl && (
            <a
              href={speaker.linkedinUrl}
              target='_blank'
              rel='noreferrer'
            >
              <FaLinkedin className='text-blue-600' />
            </a>
          )}
          {speaker.youtubeUrl && (
            <a
              href={speaker.youtubeUrl}
              target='_blank'
              rel='noreferrer'
            >
              <FaYoutube className='text-red-600' />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
