import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE_NAME, getSessionUser } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';

const PROTECTED_PREFIXES = ['/dashboard'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const hasSessionCookie = Boolean(sessionCookie);
  const decoded = sessionCookie ? await getSessionUser(sessionCookie) : null;

  // Check if user is admin from database
  let isAdmin = false;
  const hasDatabaseUrl = Boolean(
    process.env.DATABASE_URL && process.env.DATABASE_URL.trim() !== ''
  );
  if (decoded?.uid && hasDatabaseUrl) {
    try {
      const user = await prisma.user.findUnique({
        where: { firebaseUid: decoded.uid },
        select: { role: true },
      });
      isAdmin = user?.role === 'ADMIN';
    } catch (error) {
      console.error('Error checking admin role:', error);
      // Default to false if database check fails
    }
  }

  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  const isAdminRoute = pathname.startsWith('/dashboard/admin');

  if (isProtected && !decoded) {
    const signInUrl = new URL('/auth/signin', request.url);
    return NextResponse.redirect(signInUrl);
  }

  if (isAdminRoute && !isAdmin) {
    // Non-admin trying to access admin area: send them to main dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Allow logged-in users to access auth pages (they can sign out or switch accounts)
  // Removed redirect to allow access to sign-in page even when logged in

  const requestHeaders = new Headers(request.headers);
  if (decoded) {
    requestHeaders.set('x-user-id', decoded.uid);
    if (decoded.email) {
      requestHeaders.set('x-user-email', decoded.email);
    }
  }

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  if (hasSessionCookie && !decoded) {
    response.cookies.delete(SESSION_COOKIE_NAME);
  }

  return response;
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*'],
};
