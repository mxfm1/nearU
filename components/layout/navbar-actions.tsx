'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
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
import { LoginDialog } from '@/app/(auth)/auth/login/_components/login-dialog'

export function NavbarActions() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()

  return (
    <>
      {!loading && user && (
        <Button variant="default" asChild>
          <Link href="/crear">
            <Plus className="h-4 w-4" />
            Crear
          </Link>
        </Button>
      )}

      {!loading && user ? (
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
              <DropdownMenuItem className='hover:cursor-pointer bg-red-500 hover:bg-red-500/80! text-white hover:text-white' onClick={() => { logout(); router.push('/') }}>
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar Sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ) : !loading ? (
        <>
          <LoginDialog
          >
            <LoginDialog>
              <Button variant="ghost">Iniciar Sesión</Button>
            </LoginDialog>
          </LoginDialog>
          <Button variant="default" asChild>
            <Link href="/auth/register">Registrarse</Link>
          </Button>
        </>
      ) : null}
    </>
  )
}
