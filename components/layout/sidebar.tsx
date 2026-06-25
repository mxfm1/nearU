'use client'

import { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import {
  PanelLeftClose,
  PanelLeft,
  LayoutDashboard,
  Building2,
  Briefcase,
  Calendar,
  Search,
  Mail,
  Settings,
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'Perfil', icon: Building2, href: '/profile' },
  { label: 'Servicios', icon: Briefcase, href: '/services' },
  { label: 'Eventos', icon: Calendar, href: '/events' },
  { label: 'Buscar', icon: Search, href: '/marketplace' },
  { label: 'Contactos', icon: Mail, href: '/contacts' },
  { label: 'Configuración', icon: Settings, href: '/settings' },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const { user, isPending } = useAuth()
  const isLoggedIn = !isPending && !!user

  if (!isLoggedIn) return null

  return (
    <aside
      className={cn(
        'relative flex flex-col border-r border-border bg-sidebar-background text-sidebar-foreground transition-all duration-300',
        collapsed ? 'w-16' : 'w-64',
      )}
    >
      <div className="flex items-center justify-end p-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8"
          aria-label={collapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
        >
          {collapsed
            ? <PanelLeft className="h-4 w-4" />
            : <PanelLeftClose className="h-4 w-4" />
          }
        </Button>
      </div>

      <nav className="flex flex-col gap-1 px-2 pb-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
              collapsed && 'justify-center px-2',
            )}
            title={collapsed ? item.label : undefined}
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
