import { getRequestConfig } from 'next-intl/server';
import { getUserLocale } from './src/util/locale';

export default getRequestConfig(async () => {
  const locale = await getUserLocale();

  return {
    locale,
    messages: (await import(`./src/locales/${locale}.json`)).default,
  };
});
