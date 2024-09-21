'use server';

import { cookies } from 'next/headers';

const COOKIE_NAME = 'NEXT_LOCALE';
const defaultLocale = 'en';

export async function getUserLocale() {
  return cookies().get(COOKIE_NAME)?.value || defaultLocale;
}

export async function setUserLocale(locale: 'en' | 'vi') {
  cookies().set(COOKIE_NAME, locale);
}
