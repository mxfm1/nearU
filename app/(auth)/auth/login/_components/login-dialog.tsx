'use client'

import { useState, useRef, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mail, Eye, EyeOff } from 'lucide-react'
import { ForgotPasswordAlertDialog } from './forgot-password-alert-dialog'
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

const loginSchema = z.object({
  email: z.string().email('Ingresá un correo válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

type LoginFormValues = z.infer<typeof loginSchema>

interface LoginDialogProps {
  children?: ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  defaultOpen?: boolean
}

export function LoginDialog({
  children,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  defaultOpen,
}: LoginDialogProps) {
  const router = useRouter()
  const { login } = useAuth()
  const [internalOpen, setInternalOpen] = useState(defaultOpen ?? false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [forgotOpen, setForgotOpen] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const closeSource = useRef<'user' | 'programmatic'>('user')

  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen

  const setOpen = (value: boolean) => {
    if (!isControlled) {
      setInternalOpen(value)
    }
    controlledOnOpenChange?.(value)
    if (defaultOpen && !value && closeSource.current === 'user') {
      router.push('/')
    }
    closeSource.current = 'user'
  }

  const handleForgotPassword = () => {
    closeSource.current = 'programmatic'
    setOpen(false)
    setTimeout(() => setForgotOpen(true), 150)
  }

  const handleBackToLogin = () => {
    setForgotOpen(false)
    setTimeout(() => setOpen(true), 150)
  }

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(values: LoginFormValues) {
    setIsLoading(true)
    setError(null)

    try {
      await login(values.email, values.password)
      setOpen(false)
      router.push('/descubrir')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Credenciales inválidas')
      setIsLoading(false)
    }
  }

  async function handleGoogleLogin() {
    // TODO: implementar Google OAuth cuando la API lo soporte
  }

  return (
    <>
    <Dialog open={open} onOpenChange={setOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="sm:text-center">
          <DialogTitle className="text-2xl font-bold">
            Bienvenido de nuevo
          </DialogTitle>
          <DialogDescription>
            Inicia sesión en tu cuenta
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-xs uppercase tracking-wide text-muted-foreground">
                      Contraseña
                    </FormLabel>
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        className="pr-9"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
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
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </form>
        </Form>

        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">o</span>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={handleGoogleLogin}
          disabled={isLoading}
        >
          <Mail className="mr-2 h-4 w-4" />
          Continuar con Google
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          ¿No tienes cuenta?{' '}
          <Link
            href="/auth/register"
            onClick={() => {
              closeSource.current = 'programmatic'
              setOpen(false)
            }}
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Crear una cuenta
          </Link>
        </p>
      </DialogContent>
    </Dialog>

    <ForgotPasswordAlertDialog
      open={forgotOpen}
      onOpenChange={setForgotOpen}
      onBackToLogin={handleBackToLogin}
    />
  </>
  )
}
