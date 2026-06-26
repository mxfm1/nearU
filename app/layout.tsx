import type { Metadata } from 'next'
import './globals.css'
import { QueryProvider } from '@/lib/query-provider'
import { AuthProvider } from '@/hooks/use-auth'
import { AppShell } from '@/components/layout/app-shell'

export const metadata: Metadata = {
  title: 'NearU',
  description: 'Marketplace B2B de eventos empresariales',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="bg-background text-foreground antialiased">
        <QueryProvider>
          <AuthProvider>
            <AppShell>
              {children}
            </AppShell>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
