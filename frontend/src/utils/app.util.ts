import type { ClassValue } from 'clsx';
import clsx from 'clsx';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import type { ReadonlyURLSearchParams } from 'next/navigation';
import queryString from 'query-string';
import { twMerge } from 'tailwind-merge';
import dayjs from 'dayjs';
import type Option from '../types/Option';
import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckCircle2,
  CircleHelp,
  CircleIcon,
  Timer,
} from 'lucide-react';
import { FaGalacticRepublic } from 'react-icons/fa6';

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
      errorObject.headers = JSON.parse(
        part?.substring('Headers:'.length).trim(),
      );
    }
  });

  return errorObject;
};

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
    const snakeKey = key.replace(
      /[A-Z]/g,
      (letter) => `_${letter.toLowerCase()}`,
    );

    // Assign the value to the new key
    newObj[snakeKey] = obj[key];
  }
  return newObj;
}

export function searchQuery(
  router: AppRouterInstance,
  filters: any,
  searchParams: ReadonlyURLSearchParams,
  exclude_queries: string[],
) {
  let refineQuery: { [key: string]: any } = {
    ...queryString.parse(searchParams.toString(), { arrayFormat: 'bracket' }),
    ...filters,
  };
  for (const query of exclude_queries) {
    delete refineQuery[query];
  }
  refineQuery = camelToSnake(refineQuery);

  for (const key in refineQuery) {
    if (
      !refineQuery[key] ||
      (Array.isArray(refineQuery[key]) && refineQuery[key].length === 0)
    ) {
      delete refineQuery[key];
    }
  }
  const query = queryString.stringify(refineQuery, { arrayFormat: 'bracket' });
  router.push(`?${query}`);
}

export function toCamelCase(obj: { [key: string]: any }) {
  if (Array.isArray(obj)) {
    return obj.map((item) => toCamelCase(item));
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) =>
        letter.toUpperCase(),
      );
      acc[camelKey] = toCamelCase(obj[key]);
      return acc;
    }, {});
  }
  return obj;
}

export function formatEventDate(datetime: Date) {
  return dayjs(datetime).format('YYYY MMM d - HH:MM');
}

interface OptionifyOptions {
  useValueAsKey: boolean;
}

export function optionify(
  data: { [key: string]: string } | string[],
  options: OptionifyOptions = { useValueAsKey: true },
): Option[] {
  if (Array.isArray(data)) {
    return data.map((opt) => ({ value: opt, label: opt }));
  } else if (data instanceof Object) {
    return Object.keys(data).map((key: string) => ({
      value: options?.useValueAsKey ? data[key] : key,
      label: data[key],
    }));
  }
}

export function groupIntoPairs(arr: any) {
  const result = [];
  for (let i = 0; i < arr.length; i += 2) {
    result.push(arr.slice(i, i + 2));
  }
  return result;
}

export function maskEmail(email: string) {
  if (!email) return;
  const [localPart, domain] = email.split('@');

  // Show only the first character of the local part and mask the rest
  const maskedLocalPart = localPart[0] + '***';

  return maskedLocalPart + '@' + domain;
}

export function matchRoute(route: string, pathname: string) {
  const routeRegex = new RegExp('^' + route.replace(/\[.*?\]/g, '.*') + '$');
  return routeRegex.test(pathname);
}

export function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function formatTableDataDate(
  date: Date | string | number,
  opts: Intl.DateTimeFormatOptions = {},
) {
  return new Intl.DateTimeFormat('en-US', {
    month: opts.month ?? 'long',
    day: opts.day ?? 'numeric',
    year: opts.year ?? 'numeric',
    ...opts,
  }).format(new Date(date));
}

export function toSentenceCase(str: string) {
  return str
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .toLowerCase()
    .replace(/^\w/, (c) => c.toUpperCase())
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * @see https://github.com/radix-ui/primitives/blob/main/packages/core/primitive/src/primitive.tsx
 */
export function composeEventHandlers<E>(
  originalEventHandler?: (event: E) => void,
  ourEventHandler?: (event: E) => void,
  { checkForDefaultPrevented = true } = {},
) {
  return function handleEvent(event: E) {
    originalEventHandler?.(event);

    if (
      checkForDefaultPrevented === false ||
      !(event as unknown as Event).defaultPrevented
    ) {
      return ourEventHandler?.(event);
    }
  };
}

/**
 * Returns the appropriate status icon based on the provided status.
 * @param status - The status of the task.
 * @returns A React component representing the status icon.
 */
export function getStatusIcon(status: any['status']) {
  const statusIcons = {
    PUBLIC: FaGalacticRepublic,
    DRAFT: CheckCircle2,
    PRIVATE: Timer,
    DEFERRED: CircleHelp,
  };

  return statusIcons[status] || CircleIcon;
}

/**
 * Returns the appropriate priority icon based on the provided priority.
 * @param priority - The priority of the task.
 * @returns A React component representing the priority icon.
 */
export function getPriorityIcon(priority: any['priority']) {
  const priorityIcons = {
    high: ArrowUpIcon,
    low: ArrowDownIcon,
    medium: ArrowRightIcon,
  };

  return priorityIcons[priority] || CircleIcon;
}

export const toSnakeCase = (str: string) =>
  str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
