'use client'

import { useRouter } from 'next/navigation'
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
import { SearchBar } from '@/components/search-bar'
import { Plus, LogOut, User, Mail } from 'lucide-react'

export function NavbarActions() {
  const { user, isPending } = useAuth()
  const router = useRouter()

  function handleSearch(query: string) {
    if (query) {
      router.push(`/search?q=${encodeURIComponent(query)}`)
    }
  }

  return (
    <>
      <SearchBar onSearch={handleSearch} className="max-w-md" />
      <div className="flex-1" />

      {!isPending && !user && (
        <Button variant="default" asChild>
          <Link href="/crear">
            <Plus className="h-4 w-4" />
            Crear
          </Link>
        </Button>
      )}

      {!isPending && user ? (
        <>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/inbox" aria-label="Bandeja de entrada">
              <Mail className="h-5 w-5" />
            </Link>
          </Button>
          <DropdownMenu>
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
              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <User className="mr-2 h-4 w-4" />
                  Perfil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/inbox">
                  <Mail className="mr-2 h-4 w-4" />
                  Bandeja de entrada
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => authClient.signOut()}>
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
