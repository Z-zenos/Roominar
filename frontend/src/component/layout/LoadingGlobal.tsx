'use client';

import { Fragment } from 'react';
import { useRecoilValue } from 'recoil';
import { LoadingGlobalState } from '@/src/recoil/app.recoil';

export default function LoadingGlobal() {
  const loadingGlobalState = useRecoilValue(LoadingGlobalState);
  return (
    <Fragment>
      {loadingGlobalState && (
        <div className='fixed inset-0 flex justify-center items-center z-[9999] bg-[#00000063]'>
          <div className='spinner' />
        </div>
      )}
    </Fragment>
  );
}
