'use client';

import { useState } from 'react';
import { Mail, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ProfileAvatar } from './profile-avatar';
import { ChangeEmailDialog } from './change-email-dialog';
import { authApi } from '@/lib/api-client';
import type { User } from '@/lib/api-client';

interface AccountSectionProps {
  user: User;
}

export function AccountSection({ user }: AccountSectionProps) {
  const [isSending, setIsSending] = useState(false);
  const [feedback, setFeedback] = useState<'idle' | 'success' | 'error'>('idle');

  const isVerified = user.emailVerified;

  async function handleSendVerification() {
    setIsSending(true);
    setFeedback('idle');

    try {
      await authApi.sendVerificationEmail(user.email, window.location.origin);
      setFeedback('success');
      setTimeout(() => setFeedback('idle'), 5000);
    } catch {
      setFeedback('error');
    } finally {
      setIsSending(false);
    }
  }

  return (
    <section>
      <h2 className="text-lg font-semibold text-foreground mb-1">Cuenta</h2>
      {/* <p className="text-sm text-muted-foreground mb-4">Información personal y perfil público.</p> */}

      <div>
        <div className="">
          <div className="flex items-start gap-6">
            {/* <ProfileAvatar image={user.image} name={user.name} />

            <div>
              <p className="font-medium text-foreground">Cambiar foto de perfil</p>
              <p className="text-xs text-muted-foreground">Recomendado: 400x400px, JPG & PNG.</p>
            </div> */}
          </div>

          <div className="mt-6">
            <Label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase">
              Correo electrónico
            </Label>
            <div className="flex items-center gap-3">
              <div className="flex-1 flex items-center gap-2 px-3 py-2 border border-border rounded-md bg-background">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-foreground">{user.email}</span>
              </div>

              {isVerified ? (
                <Badge variant="outline" className="text-[10px] border-brand text-brand shrink-0">
                  EMAIL VERIFICADO
                </Badge>
              ) : feedback === 'success' ? (
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 shrink-0">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Enviado</span>
                </div>
              ) : feedback === 'error' ? (
                <div className="flex items-center gap-1.5 text-xs text-destructive shrink-0">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>Error al enviar</span>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="shrink-0"
                  onClick={handleSendVerification}
                  disabled={isSending}
                >
                  {isSending ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    'Verificar email'
                  )}
                </Button>
              )}

              {/* <ChangeEmailDialog currentEmail={user.email}>
                <Button variant="outline" size="sm" className="shrink-0">
                  Cambiar email
                </Button>
              </ChangeEmailDialog> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
