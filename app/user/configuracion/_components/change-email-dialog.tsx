'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, CircleCheck, AlertTriangle } from 'lucide-react'
import { authApi } from '@/lib/api-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

const changeEmailSchema = z.object({
  newEmail: z.string().email('Ingresá un correo válido'),
})

type ChangeEmailFormValues = z.infer<typeof changeEmailSchema>

type Step = 'form' | 'success' | 'error'

interface ChangeEmailDialogProps {
  currentEmail: string
  children?: React.ReactNode
}

export function ChangeEmailDialog({ currentEmail, children }: ChangeEmailDialogProps) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<Step>('form')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previousEmail, setPreviousEmail] = useState(currentEmail)

  const form = useForm<ChangeEmailFormValues>({
    resolver: zodResolver(changeEmailSchema),
    defaultValues: { newEmail: '' },
  })

  async function onSubmit(values: ChangeEmailFormValues) {
    setIsLoading(true)
    setError(null)

    try {
      await authApi.changeEmail(values.newEmail)
      setPreviousEmail(values.newEmail)
      setStep('success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cambiar el correo')
      setStep('error')
    } finally {
      setIsLoading(false)
    }
  }

  function handleOpenChange(open: boolean) {
    setOpen(open)
    if (!open) {
      setTimeout(() => {
        setStep('form')
        setError(null)
        form.reset()
      }, 200)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        {step === 'form' && (
          <>
            <DialogHeader>
              <DialogTitle>Cambiar correo electrónico</DialogTitle>
              <DialogDescription>
                Ingresá tu nuevo correo. Te enviaremos un link de verificación.
              </DialogDescription>
            </DialogHeader>

            <div className="flex items-center gap-2 px-3 py-2 border border-border rounded-md bg-muted/50">
              <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-sm text-muted-foreground">{currentEmail}</span>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="newEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase tracking-wide text-muted-foreground">
                        Nuevo correo
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="nuevo@email.com"
                          type="email"
                          autoComplete="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {error && <p className="text-sm text-destructive">{error}</p>}

                <Button
                  type="submit"
                  className="w-full bg-brand text-brand-foreground hover:bg-brand/90"
                  disabled={isLoading}
                >
                  {isLoading ? 'Enviando...' : 'Enviar verificación'}
                </Button>
              </form>
            </Form>
          </>
        )}

        {step === 'success' && (
          <div className="flex flex-col items-center text-center py-4">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand/10">
              <CircleCheck className="h-8 w-8 text-brand" />
            </div>
            <DialogTitle className="mb-2">Correo enviado</DialogTitle>
            <DialogDescription className="mb-6">
              Te enviamos un link de verificación a{' '}
              <span className="font-medium text-foreground">{previousEmail}</span>.
              Hacé clic en el enlace para confirmar el cambio.
            </DialogDescription>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleOpenChange(false)}
            >
              Entendido
            </Button>
          </div>
        )}

        {step === 'error' && (
          <div className="flex flex-col items-center text-center py-4">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            <DialogTitle className="mb-2">Error</DialogTitle>
            <DialogDescription className="mb-6">
              {error ?? 'No se pudo cambiar el correo. Intentalo de nuevo.'}
            </DialogDescription>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setStep('form')}
            >
              Intentar de nuevo
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
