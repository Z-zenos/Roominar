import type { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import {
  createConfiguration,
  ServerConfiguration,
} from '@/src/lib/api/generated';
import { API_URL } from '@/src/constants/app.constant';

export default function apiConfig(session: Session) {
  return createConfiguration({
    authMethods: session && {
      OAuth2PasswordBearer: {
        accessToken: session?.token?.accessToken,
      },
    },
    baseServer: new ServerConfiguration(API_URL, {}),
    promiseMiddleware: [
      {
        pre(context) {
          return Promise.resolve(context);
        },
        async post(context) {
          if (context.httpStatusCode === 401) {
            signOut({
              callbackUrl: '/login',
            });
          }
          return Promise.resolve(context);
        },
      },
    ],
  });
}
