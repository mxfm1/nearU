'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { authApi } from '@/lib/api-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mail, ArrowLeft, CircleCheck } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

const forgotSchema = z.object({
  email: z.string().email('Ingresá un correo válido'),
})

type ForgotFormValues = z.infer<typeof forgotSchema>

interface ForgotPasswordAlertDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onBackToLogin?: () => void
}

export function ForgotPasswordAlertDialog({
  open,
  onOpenChange,
  onBackToLogin,
}: ForgotPasswordAlertDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: '' },
  })

  async function onSubmit(values: ForgotFormValues) {
    setIsLoading(true)
    setError(null)

    try {
      await authApi.forgotPassword(values.email)
      setSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al enviar el correo')
    } finally {
      setIsLoading(false)
    }
  }

  function handleBack() {
    const email = form.getValues('email')
    form.reset()
    setSent(false)
    setError(null)
    onOpenChange(false)
    if (onBackToLogin) {
      setTimeout(onBackToLogin, 150)
    }
  }

  function handleDialogClose(open: boolean) {
    if (!open) {
      form.reset()
      setSent(false)
      setError(null)
    }
    onOpenChange(open)
  }

  return (
    <AlertDialog open={open} onOpenChange={handleDialogClose}>
      <AlertDialogContent className="sm:max-w-md">
        {!sent ? (
          <>
            <AlertDialogHeader className="sm:text-center">
              <AlertDialogTitle className="text-xl font-bold">
                ¿Olvidaste tu contraseña?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Ingresá tu correo electrónico y te enviaremos un enlace para
                restablecerla.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase tracking-wide text-muted-foreground">
                        Correo Electrónico
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="nombre@ejemplo.com"
                          type="email"
                          autoComplete="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}

                <Button
                  type="submit"
                  className="w-full bg-brand text-brand-foreground hover:bg-brand/90"
                  disabled={isLoading}
                >
                  {isLoading ? 'Enviando...' : 'Enviar enlace'}
                </Button>
              </form>
            </Form>

            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver al inicio de sesión
              </button>
            </div>
          </>
        ) : (
          <>
            <AlertDialogHeader className="sm:text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand/10">
                  <CircleCheck className="h-7 w-7 text-brand" />
                </div>
              </div>
              <AlertDialogTitle className="text-xl font-bold">
                Revisá tu bandeja de entrada
              </AlertDialogTitle>
              <AlertDialogDescription className="mx-auto max-w-sm">
                Si existe una cuenta con ese correo, recibirás un enlace para
                restablecer tu contraseña.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="flex justify-center">
              <AlertDialogCancel asChild>
                <Button
                  variant="outline"
                  onClick={() => {
                    form.reset()
                    setSent(false)
                    setError(null)
                  }}
                >
                  Cerrar
                </Button>
              </AlertDialogCancel>
            </div>
          </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  )
}
