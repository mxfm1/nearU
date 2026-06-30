'use client'

import { HelpCircle, Moon, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface ConfigHeaderProps {
  /** URL de la imagen del usuario para el avatar del header */
  userImage?: string | null
  /** Inicial del usuario para el fallback del avatar */
  userName?: string
}

export function ConfigHeader({ userImage, userName }: ConfigHeaderProps) {
  const initial = userName?.charAt(0).toUpperCase() ?? '?'

  return (
    <div className="flex items-start justify-between mb-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Configuración de Usuario</h1>
        <p className="text-muted-foreground mt-1">
          Gestiona tu perfil, seguridad y preferencias.
        </p>
      </div>
      <div className="flex items-center gap-2">
        {/* <Button variant="ghost" size="icon" className="h-9 w-9">
          <HelpCircle className="h-5 w-5 text-muted-foreground" />
        </Button>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Moon className="h-5 w-5 text-muted-foreground" />
        </Button> */}
        <Avatar className="h-9 w-9">
          {userImage ? (
            <img src={userImage} alt={userName ?? 'Avatar'} className="h-full w-full object-cover" />
          ) : (
            <AvatarFallback className="bg-muted text-muted-foreground">
              <User className="h-4 w-4" />
            </AvatarFallback>
          )}
        </Avatar>
      </div>
    </div>
  )
}
