import type { MeResponse, TokenResponse } from '@/src/lib/api/generated';

declare module 'next-auth' {
  interface Session {
    token: TokenResponse;
    user: MeResponse;
  }

  interface User extends TokenResponse {
    id?: string;
  }
}

declare module 'next-auth/adapters' {
  type AdapterUser = MgLoginResponse;
}

declare module 'next-auth/jwt' {
  interface JWT extends TokenResponse {
    user: MeResponse;
  }
}
