import {
  createConfiguration,
  ServerConfiguration,
} from '@/src/lib/api/generated';
import { getRouter } from '@/src/util/app.util';
import dayjs from 'dayjs';
import type { JwtPayload } from 'jwt-decode';
import { jwtDecode } from 'jwt-decode';
import { signOut, useSession } from 'next-auth/react';
import { useMemo } from 'react';
import queryString from 'query-string';

function useApiConfig() {
  const session = useSession();
  return useMemo(
    () =>
      createConfiguration({
        authMethods: session.data?.token?.accessToken
          ? {
              OAuth2PasswordBearer: {
                accessToken: session.data?.token?.accessToken,
              },
            }
          : {},
        baseServer: new ServerConfiguration(
          process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
          {},
        ),
        promiseMiddleware: [
          {
            async pre(context) {
              if (session?.data?.token?.accessToken) {
                const { accessToken, refreshToken } = session.data.token;
                context.setHeaderParam(
                  'Authorization',
                  `Bearer ${accessToken}`,
                );
                const decodedAccessToken = jwtDecode<JwtPayload>(accessToken);
                if (dayjs().isAfter(dayjs.unix(decodedAccessToken.exp))) {
                  if (refreshToken) {
                    const decodedRefreshToken =
                      jwtDecode<JwtPayload>(refreshToken);
                    if (dayjs().isAfter(dayjs.unix(decodedRefreshToken.exp))) {
                      await signOut({
                        callbackUrl: getRouter('login'),
                      });
                      return Promise.reject(context);
                    }
                    const newSession = await session.update();
                    context.setHeaderParam(
                      'Authorization',
                      `Bearer ${newSession.token.accessToken}`,
                    );
                    return Promise.resolve(context);
                  }

                  await signOut({
                    callbackUrl: getRouter('login'),
                  });
                  return Promise.reject(context);
                }
              }

              /* === RE-FORMAT QUERY PARAMS === */
              context.setUrl(
                queryString.stringifyUrl(
                  queryString.parseUrl(context.getUrl(), {
                    arrayFormat: 'comma',
                  }),
                ),
              );

              return Promise.resolve(context);
            },
            async post(context) {
              if (context.httpStatusCode === 401) {
                await signOut({
                  callbackUrl: getRouter('login'),
                });
                return Promise.reject(context);
              }
              return Promise.resolve(context);
            },
          },
        ],
      }),
    [session],
  );
}

export default useApiConfig;
