'use server';

import { cookies } from 'next/headers';

const COOKIE_NAME = 'NEXT_LOCALE';
const defaultLocale = 'ja';

export async function getUserLocale() {
  return cookies().get(COOKIE_NAME)?.value || defaultLocale;
}

export async function setUserLocale(locale: 'ja' | 'en') {
  cookies().set(COOKIE_NAME, locale);
}
