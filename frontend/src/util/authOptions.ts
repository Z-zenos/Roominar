import { AuthApi, createConfiguration, ServerConfiguration } from '@/src/lib/api/generated';
import { getRouter } from '@/src/util/app.util';
import { getCookie } from 'cookies-next';
import dayjs from 'dayjs';
import type { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { cookies } from 'next/headers';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

function makeAuthApi(accessToken?: string) {
  return new AuthApi(
    createConfiguration({
      authMethods: accessToken && {
        OAuth2PasswordBearer: {
          accessToken,
        },
      },
      baseServer: new ServerConfiguration(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000', {}),
    }),
  );
}

const authOptions: AuthOptions = {
  session: { strategy: 'jwt' },
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'credentials',
      credentials: {
        email: {
          label: 'email',
          type: 'email',
        },
        password: {
          label: 'password',
          type: 'password',
        },
        rememberMe: {
          label: 'rememberMe',
          type: 'boolean',
          defaultValue: false,
        },
        roleCode: {
          label: 'roleCode',
          type: 'text',
        },
      },
      async authorize({ email, password, rememberMe, roleCode }) {
        if (!email || !password) {
          throw Error('Invalid credentials');
        }
        return await makeAuthApi().login({
          userLoginRequest: {
            email,
            password,
            rememberMe: Boolean(rememberMe),
            roleCode: roleCode,
          },
        });
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, session, trigger }) {
      const compareTime = <T extends Date | number>(value: T) => {
        const now = dayjs(dayjs().tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD HH:mm:ss')).unix();
        const exp = dayjs(value).unix();
        return now > exp;
      };

      const rememberMe = getCookie('rememberMe', { cookies }) === 'true';

      if (token.accessToken && compareTime(token.expireAt)) {
        if (!rememberMe) return { ...token, ...user };

        const refreshToken = token.refreshToken;
        const response = await makeAuthApi().refreshToken({
          token: refreshToken,
        });
        return { ...token, ...user, ...response };
      }

      if (trigger === 'update' && session?.token) {
        token = session.token;
      }
      return {
        ...token,
        ...user,
      };
    },
    session: async ({ session, token }) => {
      const user = await makeAuthApi(token.accessToken).me();
      session.user = JSON.parse(JSON.stringify(user));
      session.token = token;
      return session;
    },
  },
  pages: {
    error: getRouter('login'),
    signIn: getRouter('login'),
  },
};

export default authOptions;
