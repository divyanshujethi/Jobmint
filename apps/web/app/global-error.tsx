"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-slate-900 text-white p-4 font-sans">
        <div className="max-w-md text-center space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/20 text-rose-400 text-2xl font-bold">
            ⚠️
          </div>
          <h2 className="text-2xl font-bold text-slate-100">Something went wrong</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Our engineering team has received the diagnostic trace via Sentry and is investigating.
          </p>
          <button
            onClick={() => reset()}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold text-xs shadow-md transition-all active:scale-95"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
