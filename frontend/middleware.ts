import type { NextRequestWithAuth } from 'next-auth/middleware';
import { withAuth } from 'next-auth/middleware';
import type { NextFetchEvent } from 'next/server';
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { RoleCode } from './src/constant/role_code.constant';
// import { getToken } from 'next-auth/jwt';

export const pathPermissionMaster = {
  AUDIENCE: [
    '/register',
    // '/register/registration',
    // '/register/success',
    // '/forget-password',
    // '/reset-password',
    '/my-profile',
    // '/applied-upcoming',
    // '/applied-ended',
    // '/bookmark',
    // '/update-information',
    // '/public-information',
    // '/change-email',
    '/home',
    '/search',
    '/events/[slug]',
    '/events/[slug]/apply',
    // '/organization/login',
    // '/change-email/[token]',
  ],
  SPEAKER: ['/login', '/organization/login'],
  ORGANIZER: [
    '/login',
    // '/organization/register',
    // '/organization/register/success',
    // '/organization/events',
    // '/organization/events/[id]',
    // '/organization/applications',
    // '/organization/members',
    // '/organization/setting/member/[id]',
    // '/organization/create-questionaire',
    // '/organization/questionnaire/[id]',
    // '/organization/applications',
    // '/organization/setting/member',
    // '/organization/questionnaires-management',
    // '/organization/event-register',
    // '/organization/register-member',
    // '/organization/create-target',
    // '/organization/targets',
    // '/organization/targets/[id]',
    // '/organization/information',
  ],
  ADMIN: ['/admin/users', '/admin/organizers', '/login', '/organization/login'],
  GUEST: [
    '/login',
    '/register',
    '/register/registration',
    // '/register/success',
    '/home',
    '/search',
    '/events/[slug]',
    // '/events/[slug]/apply',
    // '/change-email/[token]',
    '/not-found',
  ],
};

const nextResponseRedirectUrl = (
  roleCode: string,
  pathName: string,
  url: string,
) => {
  if (
    !pathPermissionMaster?.[roleCode]?.find((item: string) =>
      pathName.includes(item),
    ) ||
    pathName === '/'
  ) {
    return NextResponse.redirect(new URL('/not-found', url));
  }
};

const nextAuthMiddleware = withAuth(
  async function middleware(req) {
    const { pathname: pathName, href: url } = req.nextUrl;
    const token = await getToken({ req: req });
    console.dir(token);
    if (token) {
      return nextResponseRedirectUrl(token.role, pathName, url);
    }
  },
  // {
  //   pages: {
  //     signIn: `/login`,
  //   },
  // },
);

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
