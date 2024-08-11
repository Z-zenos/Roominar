'use client';
import { Box, MenuItem, MenuList, SvgIcon, Typography } from '@mui/material';
import * as React from 'react';
import UserIcon from '../../../public/icons/user-detail.svg';
import UserPatientIcon from '../../../public/icons/injury-6318_oGhWrOxL.svg';
import HeartIcon from '../../../public/icons/heart-rate-6281.svg';
import KitIcon from '../../../public/icons/first-aid-kit-6282.svg';
import SyringeIcon from '../../../public/icons/syringe-6290_skdJJW2hS.svg';
import PrescriptionIcon from '../../../public/icons/prescription-taken-6326.svg';
import TriageIcon from '../../../public/icons/triage.svg';
import MedicalIcon from '../../../public/icons/medical-record-6313.svg';
import UserIconActive from '../../../public/icons/user-detail-active.svg';
import UserPatientIconActive from '../../../public/icons/injury-6398_active.svg';
import HeartIconActive from '../../../public/icons/heart-rate-6281_active.svg';
import KitIconActive from '../../../public/icons/first-aid-kit-6362_active.svg';
import SyringeIconActive from '../../../public/icons/syringe-6370_active.svg';
import PrescriptionIconActive from '../../../public/icons/prescription-taken-6406_active.svg';
import TriageIconActive from '../../../public/icons/triage.svg';
import MedicalIconActive from '../../../public/icons/medical-record-6313.svg';
import { useParams, usePathname } from 'next/navigation';
import { getRouter } from '@/src/util/app.util';
import Link from 'next/link';

const Sidebar = () => {
  const { id } = useParams();
  const pathname = usePathname();
  const sidebarConfig = [
    {
      title: '個人Info',
      icon: pathname === getRouter('patientInfo', id) ? <UserIconActive /> : <UserIcon />,
      url: getRouter('patientInfo', id),
    },
    {
      title: '参加者一覧',
      icon: pathname === getRouter('injuryInfo') ? <UserPatientIconActive /> : <UserPatientIcon />,

      url: getRouter('injuryInfo'),
    },
    {
      title: '座席表',
      icon: pathname === getRouter('vital') ? <HeartIconActive /> : <HeartIcon />,

      url: getRouter('vital'),
    },
    {
      title: '当日チェックイン',
      icon: pathname === getRouter('treatmentInfo') ? <KitIconActive /> : <KitIcon />,

      url: getRouter('treatmentInfo'),
    },
    {
      title: 'メール文面',
      icon: pathname === getRouter('bloodTransfusion') ? <SyringeIconActive /> : <SyringeIcon />,

      url: getRouter('bloodTransfusion'),
    },
    {
      title: 'メール文面',
      icon: pathname === getRouter('drugInfusion') ? <PrescriptionIconActive /> : <PrescriptionIcon />,

      url: getRouter('drugInfusion'),
    },

    {
      title: 'メール文面',
      icon: pathname === getRouter('triage') ? <TriageIconActive /> : <TriageIcon />,

      url: getRouter('triage'),
    },
    {
      title: 'メール文面',
      icon: pathname === getRouter('inputLog') ? <MedicalIconActive /> : <MedicalIcon />,

      url: getRouter('inputLog'),
    },
  ];
  return (
    <Box className='w-60'>
      <div className='h-screen px-2 py-2 bg-white min-w-[180px]'>
        <MenuList className='grid gap-3'>
          {sidebarConfig.map(({ title, icon, url }, index) => (
            <Link key={index} href={url}>
              <MenuItem className='h-12 px-2 transition-all rounded-lg min-w-12 transform-none hover:bg-[#e8f6ff] cursor-pointer'>
                <div className='flex items-center justify-center gap-6'>
                  {icon && (
                    <SvgIcon className='text-blue-500' sx={{ width: 24, color: 'red' }}>
                      {icon}
                    </SvgIcon>
                  )}
                  <Typography className={`text-base ${pathname === url && 'text-[#2196F3]'}`}>{title}</Typography>
                </div>
              </MenuItem>
            </Link>
          ))}
        </MenuList>
      </div>
    </Box>
  );
};

export default Sidebar;
