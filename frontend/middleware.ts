import type { NextRequestWithAuth } from 'next-auth/middleware';
import { withAuth } from 'next-auth/middleware';
import type { NextFetchEvent } from 'next/server';
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import Stripe from 'stripe';
import { RoleCode } from './src/constants/role_code.constant';
import { matchRoute } from './src/utils/app.util';

// Initialize Stripe
const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

// Define route access permissions
export const pathPermissionMaster = {
  AUDIENCE: [
    '/register',
    '/my-profile',
    '/home',
    '/search',
    '/events/[slug]',
    '/events/[slug]/apply',
    '/events/[slug]/apply/result',
    '/account-settings',
    '/not-found',
    '/email/change/[token]',
    '/my-events',
    '/organization/login',
    '/organization/register',
    '/icon.ico',
  ],
  SPEAKER: ['/login', '/organization/login'],
  ORGANIZER: [
    '/login',
    '/organization/events',
    '/organization/overview',
    '/organization/events/create/[slug]',
    '/organization/surveys',
    '/organization/surveys/create',
    '/organization/attendees',
    '/icon.ico',
  ],
  ADMIN: ['/admin/users', '/admin/organizers', '/login', '/organization/login'],
  GUEST: [
    '/login',
    '/register',
    '/home',
    '/search',
    '/events/[slug]',
    '/events/[slug]/apply',
    '/not-found',
    '/forgot-password',
    '/email/verify/[token]',
    '/email/change/[token]',
    '/email/revert/[token]',
    '/organization/login',
    '/organization/register',
    '/icon.ico',
  ],
};

// Redirect based on permissions and route access
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

// Middleware for Stripe session verification
const verifyStripeSession = async (req: NextRequestWithAuth) => {
  const sessionId = req.nextUrl.searchParams.get('session_id');
  if (!sessionId) return NextResponse.next(); // Allow if session_id is not provided

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      // Payment is successful, allow the request to proceed
      return NextResponse.next();
    } else {
      // Redirect to payment failure page
      return NextResponse.redirect(new URL('/home', req.url));
    }
  } catch (error) {
    console.error('Stripe verification error:', error);
    // Redirect to an error page if session verification fails
    return NextResponse.redirect(new URL('/home', req.url));
  }
};

// Auth middleware logic
const nextAuthMiddleware = withAuth(async function middleware(req) {
  const { pathname: pathName, href: url } = req.nextUrl;
  const token = await getToken({ req: req });

  if (token) {
    return nextResponseRedirectUrl(token.role, pathName, url);
  }
});

// Main middleware function
export default async function middleware(
  request: NextRequestWithAuth,
  event: NextFetchEvent,
) {
  const token = await getToken({ req: request });
  const isAuthenticated = !!token;

  // Bypass middleware for specific paths
  if (
    request.nextUrl.pathname === '/healthcheck' ||
    request.nextUrl.pathname.startsWith('/_next/') ||
    request.nextUrl.pathname.startsWith('/api/')
  ) {
    return NextResponse.next();
  }

  // Stripe session verification for `/events/[slug]/apply/result`
  if (matchRoute('/events/[slug]/apply/result', request.nextUrl.pathname)) {
    return verifyStripeSession(request);
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

// Matcher configuration
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|static|icons|images|svg).*)',
  ],
};
