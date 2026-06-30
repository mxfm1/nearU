'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react'
import { authApi } from '@/lib/api-client'
import { Button } from '@/components/ui/button'

interface VerifyEmailFormProps {
  token: string
}

export function VerifyEmailForm({ token }: VerifyEmailFormProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  async function handleVerify() {
    setStatus('loading')
    setError(null)

    try {
      await authApi.verifyEmail(token)
      setStatus('success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al verificar el email')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-muted/50 via-background to-muted/30 p-4">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-lg">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
              <CheckCircle2 className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h1 className="mb-2 text-2xl font-bold tracking-tight">¡Email verificado!</h1>
            <p className="mb-8 text-sm text-muted-foreground">
              Gracias por validar tu correo electrónico. Ya podés disfrutar de todas las funcionalidades de NearU.
            </p>
            <Button asChild className="w-full bg-brand text-brand-foreground hover:bg-brand/90">
              <Link href="/">Ir al inicio</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-muted/50 via-background to-muted/30 p-4">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-lg">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-7 w-7 text-destructive" />
            </div>
            <h1 className="mb-2 text-2xl font-bold tracking-tight">Error de verificación</h1>
            <p className="mb-8 text-sm text-muted-foreground">
              {error ?? 'No se pudo verificar tu email. El enlace puede haber expirado.'}
            </p>
            <div className="flex w-full flex-col gap-3">
              <Button
                className="w-full bg-brand text-brand-foreground hover:bg-brand/90"
                onClick={handleVerify}
              >
                Intentar de nuevo
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/">Volver al inicio</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-muted/50 via-background to-muted/30 p-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-lg">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand/10">
            <svg
              className="h-7 w-7 text-brand"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
              />
            </svg>
          </div>
          <h1 className="mb-2 text-2xl font-bold tracking-tight">Verifica tu email</h1>
          <p className="mb-8 text-sm text-muted-foreground">
            Hace clic en el botón para confirmar tu dirección de correo electrónico.
          </p>
          <Button
            className="w-full bg-brand text-brand-foreground hover:bg-brand/90"
            disabled={status === 'loading'}
            onClick={handleVerify}
          >
            {status === 'loading' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {status === 'loading' ? 'Verificando...' : 'Verificar email'}
          </Button>
        </div>
      </div>
    </div>
  )
}
