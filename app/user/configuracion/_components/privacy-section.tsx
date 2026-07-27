'use client';

import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Toggle } from './toggle';

interface PrivacySectionProps {
  profileVisibility: 'public' | 'followers';
  onProfileVisibilityChange: (value: 'public' | 'followers') => void;
  shareData: boolean;
  onShareDataChange: (value: boolean) => void;
}

export function PrivacySection({
  profileVisibility,
  onProfileVisibilityChange,
  shareData,
  onShareDataChange,
}: PrivacySectionProps) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-foreground mb-1">Privacidad</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Controla la visibilidad y el uso de tus datos.
      </p>

      <Card>
        <CardContent className="p-6 space-y-6">
          <div>
            <Label className="text-sm font-medium text-foreground mb-3 block">
              ¿Quién puede ver mi perfil?
            </Label>
            <div className="flex gap-3">
              <button
                onClick={() => onProfileVisibilityChange('public')}
                className={`flex-1 flex items-center gap-3 p-4 rounded-lg border-2 transition-colors ${
                  profileVisibility === 'public'
                    ? 'border-brand bg-brand/5'
                    : 'border-border hover:border-muted-foreground/30'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    profileVisibility === 'public' ? 'border-brand' : 'border-muted-foreground'
                  }`}
                >
                  {profileVisibility === 'public' && (
                    <div className="w-2 h-2 rounded-full bg-brand" />
                  )}
                </div>
                <div className="text-left">
                  <p className="font-medium text-foreground">Público</p>
                  <p className="text-xs text-muted-foreground">Cualquiera puede ver tu perfil</p>
                </div>
              </button>
              <button
                onClick={() => onProfileVisibilityChange('followers')}
                className={`flex-1 flex items-center gap-3 p-4 rounded-lg border-2 transition-colors ${
                  profileVisibility === 'followers'
                    ? 'border-brand bg-brand/5'
                    : 'border-border hover:border-muted-foreground/30'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    profileVisibility === 'followers' ? 'border-brand' : 'border-muted-foreground'
                  }`}
                >
                  {profileVisibility === 'followers' && (
                    <div className="w-2 h-2 rounded-full bg-brand" />
                  )}
                </div>
                <div className="text-left">
                  <p className="font-medium text-foreground">Solo Seguidores</p>
                  <p className="text-xs text-muted-foreground">Acceso restringido a tu círculo</p>
                </div>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Compartir datos de uso</p>
              <p className="text-sm text-muted-foreground">
                Permitir a nearU analizar la navegación para mejorar el servicio.
              </p>
            </div>
            <Toggle checked={shareData} onChange={onShareDataChange} />
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
