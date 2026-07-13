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

const HIDDEN_FOOTER_ROUTE_PREFIXES = [
  '/auth',
  '/reset-password',
  '/verify-email',
  '/user',
]

const HIDDEN_FOOTER_ROUTE_EXACT = []

function shouldHideFooter(pathname: string): boolean {
  if (HIDDEN_FOOTER_ROUTE_EXACT.includes(pathname)) return true
  return HIDDEN_FOOTER_ROUTE_PREFIXES.some((prefix) => pathname.startsWith(prefix))
}

function getSidebarConfig(pathname: string) {
  // Score rules route: collapsed on mobile, hide toggle on mobile
  if (pathname.match(/^\/crear\/evento\/[^/]+$/)) {
    return {
      sidebarCollapsed: true, // Will be overridden by media query in sidebar
      hideSidebarToggle: true,
    }
  }
  return {}
}

export function LayoutWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const sidebarConfig = getSidebarConfig(pathname)

  return (
    <DirtyGuardProvider>
      <AppShell
        hideSidebar={shouldHideSidebar(pathname)}
        hideFooter={shouldHideFooter(pathname)}
        sidebarCollapsed={sidebarConfig.sidebarCollapsed}
        hideSidebarToggle={sidebarConfig.hideSidebarToggle}
      >
        {children}
      </AppShell>
    </DirtyGuardProvider>
  )
}
