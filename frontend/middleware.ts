import { withAuth } from 'next-auth/middleware';
import type { NextRequest } from 'next/server';
import { NextResponse, URLPattern } from 'next/server';
import type { JWT } from 'next-auth/jwt';
import type { IRouter, RoutersType } from '@/src/type/app';
import authOptions from '@/src/util/authOptions';
import routers from './src/constant/router.constant';

export const initialScreen = {
  AUDIENCE: '/home',
  SPEAKER: '/home',
  ORGANIZER: '/organization/events',
  ADMIN: '/admin/organizers',
  GUEST: '/home',
};

const routesPattern = Object.keys(routers).map((name) => {
  const router = routers[name as RoutersType] as IRouter;

  return {
    name,
    ...router,
    pattern: new URLPattern({ pathname: router.pattern }),
  };
});

export default withAuth(
  (req: NextRequest & { nextauth: { token: JWT | null } }) => {
    const { pathname } = req.nextUrl;
    const pattern = routesPattern.find((item) => item.pattern.test({ pathname }));
    const url = req.nextUrl.clone();
    const { token } = req.nextauth;
    if (pattern?.private && !token) {
      if (url.pathname === routers.login.router) {
        return NextResponse.next();
      }
      url.pathname = routers.login.router;
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }

    if (token && url.pathname === routers.login.router) {
      url.pathname = routers.home.router;
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        const pattern = routesPattern.find((item) => item.pattern.test({ pathname }));
        if (typeof pattern?.private === 'undefined' || pattern?.private === false || pattern?.private) {
          return true;
        }

        return !!token;
      },
    },
    pages: authOptions.pages,
    secret: authOptions.secret,
  },
);

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|static|icons|images|svg).*)'],
};
