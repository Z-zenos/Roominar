import {
  AuthApi,
  createConfiguration,
  ServerConfiguration,
} from '@/src/lib/api/generated';
import { getRouter } from '@/src/util/app.util';
import { getCookie } from 'cookies-next';
import dayjs from 'dayjs';
import type { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { cookies } from 'next/headers';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import type { GoogleProfile } from 'next-auth/providers/google';
import GoogleProvider from 'next-auth/providers/google';

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
      baseServer: new ServerConfiguration(
        process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
        {},
      ),
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
          type: 'text',
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
          type: 'string',
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
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, session, trigger, profile }) {
      const compareTime = <T extends Date | number>(value: T) => {
        const now = dayjs(
          dayjs().tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD HH:mm:ss'),
        ).unix();
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

      if (profile) {
        const googleProfile = profile as GoogleProfile;
        if (!googleProfile.email_verified) {
          throw Error('Email has not verified');
        }
        const response = await makeAuthApi().socialAuth({
          socialAuthRequest: {
            email: googleProfile.email,
            givenName: googleProfile.given_name,
            familyName: googleProfile.family_name,
            picture: googleProfile.picture,
            name: googleProfile.name,
            isVerified: googleProfile.email_verified,
          },
        });

        return { ...token, ...user, ...response };
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
    error: getRouter('home'),
    signIn: getRouter('login'),
    signOut: getRouter('home'),
  },
};

export default authOptions;
