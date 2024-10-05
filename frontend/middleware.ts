import type { NextRequestWithAuth } from 'next-auth/middleware';
import { withAuth } from 'next-auth/middleware';
import type { NextFetchEvent } from 'next/server';
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { RoleCode } from './src/constant/role_code.constant';
import { matchRoute } from './src/util/app.util';

export const pathPermissionMaster = {
  AUDIENCE: [
    '/register',
    '/my-profile',
    '/home',
    '/search',
    '/events/[slug]',
    '/events/[slug]/apply',
    '/account-settings',
    '/not-found',
    '/email/change/[token]',
    '/my-events',
    '/organization/login',
    '/organization/register',
  ],
  SPEAKER: ['/login', '/organization/login'],
  ORGANIZER: [
    '/login',
    '/organization/events',
    '/organization/overview',
    '/organization/events/create',
  ],
  ADMIN: ['/admin/users', '/admin/organizers', '/login', '/organization/login'],
  GUEST: [
    '/login',
    '/register',
    '/home',
    '/search',
    '/events/[slug]',
    '/not-found',
    '/forgot-password',
    '/email/verify/[token]',
    '/email/change/[token]',
    '/email/revert/[token]',
    '/organization/login',
    '/organization/register',
  ],
};

const nextResponseRedirectUrl = (
  roleCode: string,
  pathName: string,
  url: string,
) => {
  if (
    !pathPermissionMaster?.[roleCode]?.some((route: string) =>
      matchRoute(route, pathName),
    ) ||
    pathName === '/'
  ) {
    return NextResponse.redirect(new URL('/not-found', url));
  }
};

const nextAuthMiddleware = withAuth(async function middleware(req) {
  const { pathname: pathName, href: url } = req.nextUrl;
  const token = await getToken({ req: req });
  if (token) {
    return nextResponseRedirectUrl(token.role, pathName, url);
  }
});

export default async function middleware(
  request: NextRequestWithAuth,
  event: NextFetchEvent,
) {
  const token = await getToken({ req: request });
  const isAuthenticated = !!token;
  if (
    request.nextUrl.pathname === '/healthcheck' ||
    request.nextUrl.pathname.startsWith('/_next/') ||
    request.nextUrl.pathname.startsWith('/api/')
  ) {
    return NextResponse.next();
  }

  if (isAuthenticated) {
    const resp = await nextAuthMiddleware(
      request as NextRequestWithAuth,
      event,
    );
    const url = (resp as NextResponse)?.headers.get('location');
    if (url) {
      const baseUrl = new URL(url);
      if (baseUrl.pathname === '/api/auth/signin')
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return resp;
  } else {
    const role = token?.role ?? RoleCode.GUEST;
    return nextResponseRedirectUrl(
      role,
      request.nextUrl.pathname,
      request.nextUrl.href,
    );
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|static|icons|images|svg).*)',
  ],
};
