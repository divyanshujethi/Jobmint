import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn:
    process.env.SENTRY_DSN ||
    process.env.NEXT_PUBLIC_SENTRY_DSN ||
    "https://53c674f338af7a34d433def785f1bd15@o4512144533618688.ingest.us.sentry.io/4512144535846912",

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});
