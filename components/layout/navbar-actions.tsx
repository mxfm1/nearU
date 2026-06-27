'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/use-auth'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Plus, LogOut, User, Mail } from 'lucide-react'
import { NotificationDropdown } from './notification-dropdown'

export function NavbarActions() {
  const { user, isPending } = useAuth()

  return (
    <>
      {!isPending && user && (
        <Button variant="default" asChild>
          <Link href="/crear">
            <Plus className="h-4 w-4" />
            Crear
          </Link>
        </Button>
      )}

      {!isPending && user ? (
        <>
          <NotificationDropdown />
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">
                    {user?.name?.charAt(0)?.toUpperCase() ?? 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{user?.name ?? 'Usuario'}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className='hover:cursor-pointer'>
                <Link href="/user/perfil">
                  <User className="mr-2 h-4 w-4" />
                  Perfil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className='hover:cursor-pointer'>
                <Link href="/user/inbox">
                  <Mail className="mr-2 h-4 w-4" />
                  Bandeja de entrada
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className='hover:cursor-pointer'>
                <Link href="/user/servicios">
                  <User className="mr-2 h-4 w-4" />
                  Mis publicaciones
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className='hover:cursor-pointer bg-red-500 hover:bg-red-500/80! text-white hover:text-white' onClick={() => authClient.signOut()}>
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar Sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ) : !isPending ? (
        <>
          <Button variant="ghost" asChild>
            <Link href="/login">Iniciar Sesión</Link>
          </Button>
          <Button variant="default" asChild>
            <Link href="/register">Registrarse</Link>
          </Button>
        </>
      ) : null}
    </>
  )
}
