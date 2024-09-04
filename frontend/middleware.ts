import type { NextRequestWithAuth } from 'next-auth/middleware';
import { withAuth } from 'next-auth/middleware';
import type { NextFetchEvent, NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { initialScreen } from './src/constant/app.constant';
// import { getToken } from 'next-auth/jwt';

export const pathPermissionMaster = {
  AUDIENCE: [
    '/register',
    // '/register/registration',
    // '/register/success',
    // '/forget-password',
    // '/reset-password',
    // '/mypage',
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
    return NextResponse.redirect(new URL(initialScreen?.[roleCode], url));
  }
};

const nextAuthMiddleware = withAuth(
  async function middleware(req) {
    const { pathname: pathName, href: url } = req.nextUrl;
    const { token } = req.nextauth;
    if (token) {
      return nextResponseRedirectUrl(token.user.roleCode, pathName, url);
    }
  },
  // {
  //   pages: {
  //     signIn: `/login`,
  //   },
  // },
);

export default async function middleware(
  request: NextRequest & NextRequestWithAuth,
  event: NextFetchEvent,
) {
  // Return role in token for check path master
  // const token = await getToken({ req: request });
  // const isAuthenticated = !!token;
  // console.log(token);
  // https://stackoverflow.com/questions/76175812/prevent-authenticated-users-to-access-custom-sign-in-page-with-next-auth-middlew

  if (
    request.nextUrl.pathname === '/healthcheck' ||
    request.nextUrl.pathname.startsWith('/_next/') ||
    request.nextUrl.pathname.startsWith('/api/')
  ) {
    return NextResponse.next();
  }
  if ('nextauth' in request) {
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
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|static|icons|images|svg).*)',
  ],
};
