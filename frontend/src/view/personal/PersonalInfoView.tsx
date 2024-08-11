'use client';
import { useQueryGetPatientInfo } from '@/src/api/patient.api';
import PersonalForm from '@/src/component/common/personal/PersonalForm';
import { Skeleton } from '@mui/material';
import { useParams } from 'next/navigation';

const PersonalInfoView = () => {
  const { id } = useParams();
  const { data, isFetchedAfterMount } = useQueryGetPatientInfo({ incidentNo: id as string });
  return (
    <div className='bg-white rounded-3xl p-3 w-full'>
      <div className='text-lg font-semibold'>個人Info</div>
      {isFetchedAfterMount ? (
        <PersonalForm data={data} />
      ) : (
        <div className='w-full flex justify-center'>
          <div className='mt-6 space-y-4 w-[575px]'>
            <Skeleton variant='rounded' height={56} />
            <div className='w-full flex justify-between items-center gap-4'>
              <Skeleton variant='rounded' height={56} width={'100%'} />
              <Skeleton variant='rounded' height={56} width={'100%'} />
            </div>
            <div className='w-full flex justify-between items-center gap-4'>
              <Skeleton variant='rounded' height={56} width={'100%'} />
              <Skeleton variant='rounded' height={56} width={'100%'} />
            </div>
            <div className='w-full flex justify-between items-center gap-4'>
              <Skeleton variant='rounded' height={56} width={'100%'} />
              <Skeleton variant='rounded' height={56} width={'100%'} />
            </div>
            <div className='w-full flex justify-between items-center gap-4'>
              <Skeleton variant='rounded' height={56} width={'100%'} />
              <Skeleton variant='rounded' height={56} width={'100%'} />
            </div>
            <div className='w-full flex justify-between items-center gap-4'>
              <Skeleton variant='rounded' height={56} width={'100%'} />
              <Skeleton variant='rounded' height={56} width={'100%'} />
            </div>
            <Skeleton variant='rounded' height={56} />
            <Skeleton variant='rounded' height={56} />
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalInfoView;
