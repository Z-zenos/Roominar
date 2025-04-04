import { getCookie } from 'cookies-next';
import { useEffect, useState } from 'react';

export default function useFormatMoney() {
  const [isEnglish, setIsEnglish] = useState<boolean>(true);

  useEffect(() => {
    const locale = getCookie('NEXT_LOCALE');
    setIsEnglish(locale === 'en' || !locale);
  }, []);

  const formatMoney = (money: number) => {
    return new Intl.NumberFormat(isEnglish ? 'en-US' : 'vi-VN', {
      style: 'currency',
      currency: isEnglish ? 'USD' : 'VND',
    }).format(money);
  };

  return formatMoney;
}
