'use client'

import { type ReactNode } from 'react'
import { Navbar } from './navbar'
import { Sidebar } from './sidebar'
import { Footer } from './footer'

interface AppShellProps {
  children: ReactNode
  hideSidebar?: boolean
  hideFooter?: boolean
  sidebarCollapsed?: boolean
  hideSidebarToggle?: boolean
}

export function AppShell({ children, hideSidebar = false, hideFooter = false, sidebarCollapsed, hideSidebarToggle }: AppShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex flex-1">
        {!hideSidebar && (
          <div className="sticky top-14 h-[calc(100vh-3.5rem)] shrink-0">
            <Sidebar defaultCollapsed={sidebarCollapsed} hideToggle={hideSidebarToggle} />
          </div>
        )}
        <main className="flex-1 min-w-0 flex flex-col">
          <div className="flex-1">
            {children}
          </div>
          {!hideFooter && <Footer />}
        </main>
      </div>
    </div>
  )
}
