'use client'

import { Lock, Shield, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { authApi } from '@/lib/api-client'
import { useAuth } from '@/hooks'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'

export function SecuritySection() {

  const [buttonCooldown, setButtonCooldown] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)

  const { user, loading } = useAuth()

  const handlePasswordChange = async () => {
    if (buttonCooldown > 0 || isLoading) return

    setIsLoading(true)
    try {
      await authApi.forgotPassword(user.email)
      toast.success('Se ha enviado un enlace a tu correo electrónico.')
      setIsEmailSent(true)
      setButtonCooldown(60)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al enviar el correo')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (buttonCooldown === 0) return

    const interval = setInterval(() => {
      setButtonCooldown((value) => value - 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [buttonCooldown])

  return (
    <section>
      <h2 className="text-lg font-semibold text-foreground mb-1">Seguridad</h2>
      <p className="text-sm text-muted-foreground mb-4">Gestiona los accesos y sesiones activas.</p>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <Lock className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium text-foreground">Cambiar Contraseña</p>
                <p className="text-xs text-muted-foreground">
                  Se enviará un enlace de recuperación a tu email.
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handlePasswordChange} disabled={isLoading || buttonCooldown > 0}>
              {isLoading
                ? "Enviando..."
                : buttonCooldown > 0
                  ? `Reenviar en ${buttonCooldown}s`
                  : "Enviar enlace"}
            </Button>
          </div>

          {/* <div className="flex items-center justify-between p-4 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <Shield className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium text-foreground">Sesiones Activas</p>
                <p className="text-xs text-muted-foreground">
                  2 dispositivos conectados actualmente.
                </p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div> */}
        </CardContent>
      </Card>
    </section>
  )
}
