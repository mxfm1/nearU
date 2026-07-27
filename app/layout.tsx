import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import './globals.css';
import { QueryProvider } from '@/lib/query-provider';
import { AuthProvider } from '@/hooks/use-auth';
import { LayoutWrapper } from '@/components/layout/layout-wrapper';
import { ErrorBoundary } from '@/components/error-boundary';
import * as Sentry from '@sentry/nextjs';

export function generateMetadata(): Metadata {
  return {
    title: 'NearU',
    description: 'Marketplace B2B de eventos empresariales',
    other: {
      ...Sentry.getTraceData(),
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-background text-foreground antialiased">
        <ErrorBoundary>
          <QueryProvider>
            <AuthProvider>
              <LayoutWrapper>{children}</LayoutWrapper>
              <Toaster position="bottom-right" />
            </AuthProvider>
          </QueryProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
