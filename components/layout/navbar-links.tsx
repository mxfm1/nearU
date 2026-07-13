'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/use-auth'

const publicLinks = [
  { label: 'Explorar', href: '/descubrir' },
  { label: 'Proveedores', href: '/search' },
  { label: 'Eventos', href: '/search?type=eventos' },
  { label: 'Recursos', href: '/recursos' },
  { label: 'Sobre NearU', href: '/about' },
]

const privateLinks = [
  { label: 'Descubrir', href: '/descubrir' },
]

export function NavbarLinks() {
  const { user, loading } = useAuth()

  const links = user ? privateLinks : publicLinks

  return (
    <div className="flex items-center gap-6">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
        >
          {link.label}
        </Link>
      ))}
    </div>
  )
}
