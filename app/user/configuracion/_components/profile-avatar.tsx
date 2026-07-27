'use client';

import { User } from 'lucide-react';

interface ProfileAvatarProps {
  /** URL de la imagen del usuario. Si es undefined/null, muestra un fallback de usuario vacío. */
  image?: string | null;
  /** Nombre del usuario para el atributo alt */
  name?: string;
}

/**
 * Avatar de perfil con hover para cambiar foto.
 * Si no recibe `image`, muestra un icono de usuario vacío (sin configurar).
 */
export function ProfileAvatar({ image, name }: ProfileAvatarProps) {
  return (
    <div className="relative group cursor-pointer">
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center overflow-hidden">
        {image ? (
          <img src={image} alt={name ?? 'Foto de perfil'} className="w-full h-full object-cover" />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-muted-foreground">
            <User className="h-8 w-8" />
          </div>
        )}
      </div>
      <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <span className="text-white text-xs font-medium">Cambiar</span>
      </div>
    </div>
  );
}
