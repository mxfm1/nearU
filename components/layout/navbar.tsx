import Link from 'next/link'
import { Suspense } from 'react'
import { NavbarActions } from './navbar-actions'

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 flex h-14 items-center gap-4 border-b border-border bg-background px-4">
      <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
        NearU
      </Link>
      <Link
        href="/descubrir"
        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        Descubrir
      </Link>
      <Suspense fallback={null}>
        <NavbarActions />
      </Suspense>
    </header>
  )
}
