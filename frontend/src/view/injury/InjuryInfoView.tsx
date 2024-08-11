'use client';
import CustomDialog from '@/src/component/common/CustomDialog';
import ToggleButtonCommon from '@/src/component/common/ToggleButtonCommon';
import { FormHelperText, TextField } from '@mui/material';
import Image from 'next/image';
import { useState } from 'react';
import ỊnuryPoint from '../../../public/icons/injury_point.svg';
import Label from '../../../public/icons/label_on_inactive.svg';
import LabelActive from '../../../public/icons/label_on_active.svg';
import User from '../../../public/icons/user.svg';

const InjuryInfoView = () => {
  const key: string = 'burn';
  const [isBurn, setIsBurn] = useState(false);
  const [isLabelsOn, setIsLabelsOn] = useState(false);
  const items = [
    {
      key: 'Blunt',
      title: '鈍的外傷',
      icon: <User style={{ fill: key === 'Blunt' ? '#fff' : '#6c6c6c' }} className='mt-[2px]' />,
      callback: () => {},
    },
    {
      key: 'penetrating',
      title: '穿通性外傷',
      icon: <User style={{ fill: key === 'penetrating' ? '#fff' : '#6c6c6c' }} className='mt-[2px]' />,
      callback: () => {},
    },
    {
      key: 'burn',
      title: '熱傷',
      icon: <User style={{ fill: key === 'burn' ? '#fff' : '#6c6c6c' }} className='mt-[2px]' />,
      callback: () => {
        setIsBurn((prev) => !prev);
      },
    },
    {
      key: 'GSW',
      title: '銃創',
      callback: () => {},
    },
    {
      key: 'Blast',
      title: '爆傷',
      callback: () => {},
    },
    {
      key: 'fall',
      title: '転落墜落',
      callback: () => {},
    },
    {
      key: 'drowning',
      title: '溺水',
      callback: () => {},
    },
    {
      key: 'CBRNE',
      title: 'CBRNE',
      callback: () => {},
    },
    {
      key: 'detailed',
      title: '詳細',
      callback: () => {
        handleOpen();
      },
    },
  ];
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <div className=''>
      <div className='w-full h-full flex justify-start relative'>
        <div
          className='absolute top-1/2 left-0 cursor-pointer'
          onClick={() => {
            setIsLabelsOn((prev) => !prev);
          }}
        >
          {isLabelsOn ? <LabelActive /> : <Label />}
          <div className='whitespace-break-spaces text-center'>Labels </div>
          <div className='whitespace-break-spaces text-center'> On</div>
        </div>
        <div className='w-full pt-12 pl-[108px] pr-[238px]'>
          <div className='relative w-full aspect-[866/814]'>
            <Image src={'./images/injury_image.svg'} alt='humman image' className='object-contain' fill />
          </div>
          <div className=' absolute top-[22%] left-1/4'>
            <ỊnuryPoint />
          </div>
        </div>

        <div className='absolute right-0 top-0'>
          <div className='w-[180px] bg-white rounded-[10px] p-4 space-y-2'>
            {items.map((item) => (
              <ToggleButtonCommon
                key={item.key}
                active={item.key === key}
                startIcon={item.icon}
                callback={item?.callback}
              >
                {item.title}
              </ToggleButtonCommon>
            ))}
          </div>
        </div>
        <CustomDialog
          open={open}
          PaperProps={{
            style: {
              width: '448px', // Disable maxWidth to allow custom width
            },
          }}
          handleClose={handleClose}
          dialogTitle={<div className='flex flex-row gap-2 text-lg font-semibold'>詳細登録</div>}
          dialogContent={
            <div className='w-full '>
              <div className='w-full flex flex-wrap gap-x-2 gap-y-3 mb-3'>
                <ToggleButtonCommon active={false} className='max-w-[100px] !h-14 !justify-center'>
                  ミサイル
                </ToggleButtonCommon>
                <ToggleButtonCommon active={false} className='max-w-[100px] !h-14 !justify-center'>
                  迫撃砲
                </ToggleButtonCommon>
                <ToggleButtonCommon active={true} className='max-w-[100px] !h-14 !justify-center'>
                  地雷
                </ToggleButtonCommon>
                <ToggleButtonCommon
                  active={false}
                  className='max-w-[100px] !h-14 !justify-center whitespace-break-spaces text-center leading-[19px]'
                >
                  簡易爆発 装置
                </ToggleButtonCommon>
                <ToggleButtonCommon active={false} className='max-w-[100px] !h-14 !justify-center'>
                  ミサイル
                </ToggleButtonCommon>
                <ToggleButtonCommon active={false} className='max-w-[100px] !h-14 !justify-center'>
                  ミサイル
                </ToggleButtonCommon>
                <ToggleButtonCommon active={false} className='max-w-[100px] !h-14 !justify-center'>
                  ミサイル
                </ToggleButtonCommon>
                <ToggleButtonCommon active={false} className='max-w-[100px] !h-14 !justify-center'>
                  ミサイル
                </ToggleButtonCommon>
                <ToggleButtonCommon active={false} className='max-w-[100px] !h-14 !justify-center'>
                  ミサイル
                </ToggleButtonCommon>
                <ToggleButtonCommon active={false} className='max-w-[100px] !h-14 !justify-center'>
                  ミサイル
                </ToggleButtonCommon>
              </div>
              <TextField
                value={'NNNNNNNNNNNN(12)'}
                fullWidth
                name='others'
                className='w-[500px]'
                label='その他'
                variant='outlined'
              />
              <FormHelperText className='text-xs w-full !text-end'>12/12</FormHelperText>
            </div>
          }
        />
      </div>
      {isBurn && (
        <div className='bg-white rounded-[5px] p-3 w-full space-y-3 mt-6'>
          <div className='w-full flex justify-between items-center'>
            <div className='text-tertiary text-2xl font-medium'>熱傷面積</div>

            <div className='text-base'>
              %TBSA{` `} <span className='text-tertiary'>27</span>％【{` `}II°{` `}
              <span className='text-tertiary'>27</span> %{` `}III°{` `}
              <span className='text-tertiary'>27</span>
              {` `}%{` `}】
            </div>
          </div>
          <div className='w-full flex justify-between items-center'>
            <div className='text-tertiary text-2xl font-medium'>輸液開始量</div>

            <div className='text-base'>
              <span className='text-tertiary'>270</span>
              {` `} ml/h 【{` `} <span className='text-tertiary'>27</span> %{` `}×{` `}10{` `}】
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InjuryInfoView;
