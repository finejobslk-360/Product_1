import type { DecodedIdToken } from 'firebase-admin/auth';
import { auth } from '@/lib/firebaseAdmin';

export const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME ?? 'career_session';
const SESSION_MAX_AGE_DAYS = Number(process.env.SESSION_COOKIE_MAX_AGE_DAYS ?? '5');
const SESSION_MAX_AGE_MS = SESSION_MAX_AGE_DAYS * 24 * 60 * 60 * 1000;

export async function createSessionCookieValue(idToken: string): Promise<string> {
  return auth.createSessionCookie(idToken, {
    expiresIn: SESSION_MAX_AGE_MS,
  });
}

export const SESSION_COOKIE_MAX_AGE_SECONDS = SESSION_MAX_AGE_MS / 1000;

export async function getSessionUser(cookieValue?: string): Promise<DecodedIdToken | null> {
  if (!cookieValue) {
    return null;
  }

  try {
    return await auth.verifySessionCookie(cookieValue, true);
  } catch (error) {
    console.error('Failed to verify session cookie:', error);
    return null;
  }
}
