'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/use-auth'

export function NavbarLinks() {
  const { user, loading } = useAuth()

  if (loading || !user) return null

  return (
    <Link
      href="/descubrir"
      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
    >
      Descubrir
    </Link>
  )
}
