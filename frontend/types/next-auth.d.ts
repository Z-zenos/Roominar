import type { GetMeResponse, TokenResponse } from '@/src/lib/api/generated';

declare module 'next-auth' {
  interface Session {
    token: TokenResponse;
    user: GetMeResponse;
  }

  interface User extends TokenResponse {
    id?: string;
    role?: string;
  }
}

declare module 'next-auth/adapters' {
  type AdapterUser = User;
}

declare module 'next-auth/jwt' {
  interface JWT extends TokenResponse {
    user: GetMeResponse;
    role: string;
  }
}
