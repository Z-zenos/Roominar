import { AuthApi, createConfiguration, ServerConfiguration } from '@/src/lib/api/generated';
import { getRouter } from '@/src/util/app.util';
import type { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

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
        username: {
          label: 'username',
          type: 'text',
        },
        password: {
          label: 'password',
          type: 'password',
        },
        roleCode: {
          label: 'roleCode',
          type: 'text',
        },
      },
      async authorize({ username, password, roleCode }) {
        if (!username || !password) {
          throw Error('Invalid credentials');
        }
        return await makeAuthApi().login({
          userLoginRequest: {
            username,
            password,
            roleCode: roleCode,
          },
        });
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (trigger === 'update') {
        const newToken = await makeAuthApi().refreshToken({
          token: token.refreshToken,
        });
        Object.assign(token, newToken);
      }
      return { ...token, ...user };
    },
    session: async ({ session, token }) => ({
      ...session,
      token,
      user: token.user,
    }),
  },
  pages: {
    error: getRouter('login'),
    signIn: getRouter('login'),
  },
};

export default authOptions;
