'use client'

import { type ReactNode } from 'react'
import { Navbar } from './navbar'
import { Sidebar } from './sidebar'

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex flex-1">
        <div className="sticky top-14 h-[calc(100vh-3.5rem)] shrink-0">
          <Sidebar />
        </div>
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  )
}
