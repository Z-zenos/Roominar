import type { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import {
  createConfiguration,
  ServerConfiguration,
} from '@/src/lib/api/generated';

export default function apiConfig(session: Session) {
  return createConfiguration({
    authMethods: session && {
      OAuth2PasswordBearer: {
        accessToken: session.token?.accessToken,
      },
    },
    baseServer: new ServerConfiguration(
      process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
      {},
    ),
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
