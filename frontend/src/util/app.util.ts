import routers from '@/src/constant/router.constant';
import type { GetRouterFunc, RoutersType } from '@/src/type/app';
import { toastError } from './toast.util';

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
    return toastError(message);
  }
  return;
};

export const camelToSnake = (camelCase: string): string => {
  return camelCase.replace(/([A-Z])/g, '_$1').toLowerCase();
};
