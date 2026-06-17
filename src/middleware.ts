import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: [
    // Match all pathnames except for
    // - /api, /_next, /_vercel, /favicon.ico, static files
    // - /auth/callback (Supabase OAuth redirect — must not get locale-prefixed)
    '/((?!api|auth|_next|_vercel|.*\\..*).*)',
  ],
};
