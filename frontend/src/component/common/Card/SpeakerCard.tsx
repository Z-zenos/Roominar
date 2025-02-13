import { type ListingRandomSpeakersItem } from '@/src/lib/api/generated';
import { Card, CardBody, CardHeader, Image } from '@nextui-org/react';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';

interface SpeakerCardProps {
  className?: string;
  speaker: ListingRandomSpeakersItem;
}

function SpeakerCard({ className, speaker }: SpeakerCardProps) {
  const t = useTranslations();
  return (
    <Card
      className={clsx(
        'py-4 shadow-[rgba(0,_0,_0,_0.16)_0px_1px_4px]',
        className,
      )}
    >
      <CardHeader className='pb-0 pt-2 px-4 flex-col items-start'>
        <p className='text-tiny uppercase font-bold'>
          {t(`code.jobType.${speaker.jobTypeCode}`)}
        </p>
        <h4 className='font-bold text-large'>
          {speaker.firstName + ' ' + speaker.lastName}
        </h4>
      </CardHeader>
      <CardBody className='overflow-visible py-2'>
        <Image
          alt='Speaker avatar'
          className='object-cover rounded-xl'
          src={speaker.avatarUrl}
          width={270}
        />
      </CardBody>
    </Card>
  );
}

export default SpeakerCard;
