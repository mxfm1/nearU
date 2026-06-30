'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/use-auth'
import { useDirtyGuard } from '@/hooks/use-dirty-guard'
import { Button } from '@/components/ui/button'
import { UnsavedChangesDialog } from '@/app/user/perfil/_components/unsaved-changes-dialog'
import {
  PanelLeftClose,
  PanelLeft,
  Home,
  PlusCircle,
  Bell,
  Mail,
  User,
  Settings,
  LogOut,
} from 'lucide-react'

const navItems = [
  { label: 'Inicio', icon: Home, href: '/' },
  { label: 'Publicar', icon: PlusCircle, href: '/crear' },
  { label: 'Notificaciones', icon: Bell, href: '/user/notificaciones' },
  { label: 'Inbox', icon: Mail, href: '/user/inbox' },
]

const bottomItems = [
  { label: 'Ver Perfil', icon: User, href: '/user/perfil' },
  { label: 'Configuración', icon: Settings, href: '/user/configuracion' },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [pendingHref, setPendingHref] = useState<string | null>(null)
  const pathname = usePathname()
  const router = useRouter()
  const { user, loading, logout } = useAuth()
  const { isDirty, dirtyFields, clearDirty } = useDirtyGuard()
  const isLoggedIn = !loading && !!user

  if (!isLoggedIn) return null

  const handleNavClick = (href: string) => (e: React.MouseEvent) => {
    if (isDirty) {
      e.preventDefault()
      setPendingHref(href)
    }
  }

  const handleConfirmNav = () => {
    clearDirty()
    if (pendingHref) {
      router.push(pendingHref)
    }
    setPendingHref(null)
  }

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

      {!collapsed && (
        <div className="px-4 pb-4">
          <h1 className="text-xl font-bold text-brand">NearU</h1>
          <p className="text-xs text-muted-foreground">Mercado B2B</p>
        </div>
      )}

      <nav className="flex flex-col gap-1 px-2 pb-4">
        {navItems.map((item) => {
          const resolvedHref = item.href === '/' && user ? '/descubrir' : item.href
          const isActive = item.href === '/'
            ? pathname === '/' || pathname.startsWith('/descubrir')
            : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={resolvedHref}
              onClick={handleNavClick(resolvedHref)}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-brand/10 text-brand'
                  : 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                collapsed && 'justify-center px-2',
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-1 px-2 pb-4">
        {/* {!collapsed && (
          <Button className="w-full bg-brand hover:bg-brand/90 text-white" asChild>
            <Link href="/crear">
              <Plus className="h-4 w-4" />
              Nueva Publicación
            </Link>
          </Button>
        )} */}

        {bottomItems.map((item) => {
          const isActive = pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleNavClick(item.href)}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-brand/10 text-brand'
                  : 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                collapsed && 'justify-center px-2',
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        })}

        <button
          onClick={() => { logout(); router.push('/') }}
          className={cn(
            'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
            'bg-destructive text-destructive-foreground hover:bg-destructive/90',
            collapsed && 'justify-center px-2',
          )}
          title={collapsed ? 'Cerrar Sesión' : undefined}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Cerrar Sesión</span>}
        </button>
      </div>

      <UnsavedChangesDialog
        open={pendingHref !== null}
        dirtyFields={dirtyFields}
        onConfirm={handleConfirmNav}
        onCancel={() => setPendingHref(null)}
      />
    </aside>
  )
}
