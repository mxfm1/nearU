import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'
import './globals.css'
import { QueryProvider } from '@/lib/query-provider'
import { AuthProvider } from '@/hooks/use-auth'
import { LayoutWrapper } from '@/components/layout/layout-wrapper'

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
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
            <Toaster position="bottom-right" />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
