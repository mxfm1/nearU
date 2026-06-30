'use client'

import { usePathname } from 'next/navigation'
import { type ReactNode } from 'react'
import { AppShell } from './app-shell'
import { DirtyGuardProvider } from '@/hooks/use-dirty-guard'

const HIDDEN_ROUTE_PREFIXES = [
  '/auth',
  '/reset-password',
  '/verify-email',
]

const HIDDEN_ROUTE_EXACT = [
  '/',

]

function shouldHideSidebar(pathname: string): boolean {
  if (HIDDEN_ROUTE_EXACT.includes(pathname)) return true
  return HIDDEN_ROUTE_PREFIXES.some((prefix) => pathname.startsWith(prefix))
}

export function LayoutWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  if (shouldHideSidebar(pathname)) {
    return (
      <DirtyGuardProvider>
        {children}
      </DirtyGuardProvider>
    )
  }

  return (
    <DirtyGuardProvider>
      <AppShell>{children}</AppShell>
    </DirtyGuardProvider>
  )
}
