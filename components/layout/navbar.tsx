import Link from 'next/link';
import { Suspense } from 'react';
import { NavbarActions } from './navbar-actions';
import { NavbarLinks } from './navbar-links';
import { MobileMenu } from './mobile-menu';
import { TypeaheadSearch } from '@/components/typeahead-search';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 flex h-14 sm:h-16 items-center border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 lg:px-8">
      {/* Left: Logo */}
      <Link href="/" className="flex items-center gap-2">
        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary rounded-full flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-xs sm:text-sm">N</span>
        </div>
        <span className="font-bold text-base sm:text-lg text-text-primary">NearU</span>
      </Link>

      {/* Center: Search bar + Navigation links */}
      <div className="hidden md:flex flex-1 items-center justify-center gap-6 ml-6">
        <TypeaheadSearch className="w-full max-w-md" />
        <NavbarLinks />
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 sm:gap-3 ml-auto">
        <Suspense fallback={null}>
          <NavbarActions />
        </Suspense>
        <MobileMenu />
      </div>
    </header>
  );
}
