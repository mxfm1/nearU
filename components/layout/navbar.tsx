import Link from 'next/link'
import { Suspense } from 'react'
import { TypeaheadSearch } from '@/components/typeahead-search'
import { NavbarActions } from './navbar-actions'
import { NavbarLinks } from './navbar-links'

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 flex h-14 items-center border-b border-border bg-background px-4">
      {/* Left: 1/3 — logo + navigation */}
      <div className="flex-1 flex items-center gap-4">
        <div className='pl-12'>
          <Link href="/" className="flex items-center gap-2 font-semibold text-lg whitespace-nowrap">
            NearU
          </Link>
        </div>
        <NavbarLinks />
      </div>

      {/* Middle: 2/3 — search */}
      <div className="flex-[1] flex items-center px-6">
        <Suspense fallback={null}>
          <TypeaheadSearch className="w-full" />
        </Suspense>
      </div>

      {/* Right: auto — actions */}
      <div className="flex-1 flex items-center justify-end gap-2">
        <Suspense fallback={null}>
          <NavbarActions />
        </Suspense>
      </div>
    </header>
  )
}
