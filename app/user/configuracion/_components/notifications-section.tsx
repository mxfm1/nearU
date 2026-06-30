'use client'

import { Mail, Smartphone } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Toggle } from './toggle'

export interface EmailNotifications {
  newEvents: boolean
  quotes: boolean
  authorize: boolean
}

export interface PushNotifications {
  reminders: boolean
}

interface NotificationsSectionProps {
  emailNotifications: EmailNotifications
  onEmailNotificationsChange: (value: EmailNotifications) => void
  pushNotifications: PushNotifications
  onPushNotificationsChange: (value: PushNotifications) => void
}

export function NotificationsSection({
  emailNotifications,
  onEmailNotificationsChange,
  pushNotifications,
  onPushNotificationsChange,
}: NotificationsSectionProps) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-foreground mb-1">Notificaciones</h2>
      <p className="text-sm text-muted-foreground mb-4">Configura las alertas que recibes.</p>

      <Card>
        <CardContent className="p-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <Label className="text-xs font-medium text-muted-foreground uppercase">
                Correo Electrónico
              </Label>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-foreground">Nuevos Eventos</p>
                <Toggle
                  checked={emailNotifications.newEvents}
                  onChange={(v) => onEmailNotificationsChange({ ...emailNotifications, newEvents: v })}
                />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-foreground">Notificaciones de Cotizaciones</p>
                <Toggle
                  checked={emailNotifications.quotes}
                  onChange={(v) => onEmailNotificationsChange({ ...emailNotifications, quotes: v })}
                />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-foreground">Autorizar notificaciones por email</p>
                  <Toggle
                    checked={emailNotifications.authorize}
                    onChange={(v) => onEmailNotificationsChange({ ...emailNotifications, authorize: v })}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1 ml-0">
                  Importante: Desactivar esta opción impedirá recibir confirmaciones de tus eventos.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-6">
            <div className="flex items-center gap-2 mb-4">
              <Smartphone className="h-4 w-4 text-muted-foreground" />
              <Label className="text-xs font-medium text-muted-foreground uppercase">
                Notificaciones Push
              </Label>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-foreground">Recordatorios de Eventos</p>
              <Toggle
                checked={pushNotifications.reminders}
                onChange={(v) => onPushNotificationsChange({ ...pushNotifications, reminders: v })}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
