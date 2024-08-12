import { Card, CardBody, CardHeader, Image } from '@nextui-org/react';
import clsx from 'clsx';

interface SpeakerCardProps {
  className?: string;
}

function SpeakerCard({ className }: SpeakerCardProps) {
  return (
    <Card className={clsx('py-4 shadow-[rgba(0,_0,_0,_0.16)_0px_1px_4px]', className)}>
      <CardHeader className='pb-0 pt-2 px-4 flex-col items-start'>
        <p className='text-tiny uppercase font-bold'>Daily Mix</p>
        <small className='text-default-500'>12 Tracks</small>
        <h4 className='font-bold text-large'>Frontend Radio</h4>
      </CardHeader>
      <CardBody className='overflow-visible py-2'>
        <Image
          alt='Card background'
          className='object-cover rounded-xl'
          src='https://nextui.org/images/hero-card-complete.jpeg'
          width={270}
        />
      </CardBody>
    </Card>
  );
}

export default SpeakerCard;
