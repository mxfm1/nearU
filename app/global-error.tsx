"use client";

import * as Sentry from "@sentry/nextjs";
import NextErrorComponent from 'next/error'
import { useEffect } from "react";

export default function GlobalError({ error }: { error: Error }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        {/* Your Error component here... */}
        <NextErrorComponent statusCode={0} />
      </body>
    </html>
  );
}