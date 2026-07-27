'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Mail, ArrowLeft } from 'lucide-react';

export function ConfirmAccess() {
  const [isResending, setIsResending] = useState(false);

  async function handleResend() {
    setIsResending(true);
    // TODO: Implement resend verification email
    setTimeout(() => setIsResending(false), 2000);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-muted/50 via-background to-muted/30 p-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-lg">
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand/10">
              <Mail className="h-8 w-8 text-brand" />
            </div>

            <h1 className="mb-3 text-2xl font-bold tracking-tight">Revisa tu Bandeja de Entrada</h1>

            <p className="mb-8 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Se ha enviado un enlace de acceso seguro a tu correo electrónico.{' '}
              <span className="font-medium text-foreground">
                Por favor, haz clic en el enlace para verificar tu cuenta y continuar.
              </span>
            </p>

            <Button
              className="w-full bg-brand text-brand-foreground hover:bg-brand/90"
              onClick={() => window.open('mailto:', '_blank')}
            >
              Abrir correo
            </Button>

            <div className="mt-6 text-sm text-muted-foreground">
              ¿No recibiste el correo?{' '}
              <button
                onClick={handleResend}
                disabled={isResending}
                className="font-medium text-foreground underline-offset-4 hover:underline disabled:opacity-50"
              >
                {isResending ? 'Reenviando...' : 'Reenviar'}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
