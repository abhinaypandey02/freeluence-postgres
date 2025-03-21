import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Adjust this value in production, or use tracesSampler
  // for greater control
  tracesSampleRate: 1.0,

  // Setting this option to true will print useful information
  // to the console while you're setting up Sentry.
  debug: process.env.NODE_ENV === 'development',
}); 