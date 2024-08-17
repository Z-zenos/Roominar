import routers from '@/src/constant/router.constant';
import type { GetRouterFunc, RoutersType } from '@/src/type/app';
import type { ClassValue } from 'clsx';
import clsx from 'clsx';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import type { ReadonlyURLSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import queryString from 'query-string';
import { twMerge } from 'tailwind-merge';
import dayjs from 'dayjs';
import type { EventsApiListingEventsRequest } from '../lib/api/generated';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getRouter = (name?: RoutersType, ...rest: Array<any>) => {
  if (!name) return '#';

  const router = routers[name].router;
  return typeof router === 'function' ? (router as GetRouterFunc)(...rest) : router;
};

export const parseErrorMessage = (errorMessage?: string) => {
  const parts = errorMessage?.split('\n');

  const errorObject = {
    httpCode: null,
    message: null,
    body: null,
    headers: null,
  };

  parts?.forEach((part) => {
    if (part.startsWith('HTTP-Code:')) {
      errorObject.httpCode = part?.substring('HTTP-Code:'.length).trim();
    } else if (part?.startsWith('Message:')) {
      errorObject.message = part?.substring('Message:'.length).trim();
    } else if (part?.startsWith('Body:')) {
      errorObject.body = JSON.parse(part?.substring('Body:'.length).trim());
    } else if (part.startsWith('Headers:')) {
      errorObject.headers = JSON.parse(part?.substring('Headers:'.length).trim());
    }
  });

  return errorObject;
};

export const handleToast = (code: number, message: string) => {
  if (code === 400) {
    return toast.error(message);
  }
  return;
};

// export const camelToSnake = (camelCase: string): string => {
//   return camelCase.replace(/([A-Z])/g, '_$1').toLowerCase();
// };

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getTotalQueryParams(searchParams: string) {
  return Object.keys(queryString.parse(searchParams)).length;
}

export function camelToSnake(obj) {
  const newObj = {};

  for (const key in obj) {
    // Convert camelCase key to snake_case
    const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

    // Assign the value to the new key
    newObj[snakeKey] = obj[key];
  }
  return newObj;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function searchQuery(
  router: AppRouterInstance,
  filters: EventsApiListingEventsRequest,
  searchParams: ReadonlyURLSearchParams,
  exclude_queries: string[],
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let refineQuery: { [key: string]: any } = {
    ...queryString.parse(searchParams.toString()),
    ...filters,
  };
  for (const query of exclude_queries) {
    delete refineQuery[query];
  }

  refineQuery = camelToSnake(refineQuery);

  for (const key in refineQuery) {
    if (!refineQuery[key] || (Array.isArray(refineQuery[key]) && refineQuery[key].length === 0)) {
      delete refineQuery[key];
    }
  }
  const query = queryString.stringify(refineQuery);
  router.push(`?${query}`);
}

export function toCamelCase(obj: { [key: string]: any }) {
  if (Array.isArray(obj)) {
    return obj.map((item) => toCamelCase(item));
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      acc[camelKey] = toCamelCase(obj[key]);
      return acc;
    }, {});
  }
  return obj;
}

export function formatEventDate(datetime: Date) {
  return dayjs(datetime).format('YYYY MMM d - HH:MM');
}

export function parseCode(code: string) {
  const words = code.toLowerCase().split('_');
  const capitalizedWords = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1));
  return capitalizedWords.join(' ');
}
