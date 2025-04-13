'use client';

import { useEffect, useState } from 'react';
import { getCookie } from 'cookies-next';
import dayjs from '../utils/dayjs';

const useDayjsLocale = () => {
  const [isEnglish, setIsEnglish] = useState<boolean>(
    getCookie('NEXT_LOCALE') === 'en' || !getCookie('NEXT_LOCALE'),
  );

  useEffect(() => {
    dayjs.locale(isEnglish ? 'en' : 'vi');
  }, [isEnglish]);

  return { isEnglish, setIsEnglish };
};

export default useDayjsLocale;
