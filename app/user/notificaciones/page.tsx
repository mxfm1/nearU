'use client'

import { useState } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Pagination } from '@/components/ui/pagination'
import { cn } from '@/lib/utils'

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    title: 'Nuevo ciclo de siembra disponible',
    description: 'Las condiciones climáticas en tu zona son óptimas para iniciar el cultivo de hortalizas de temporada. Revisa nuestra guía actualizada.',
    time: 'Hoy, 09:42',
    icon: '🌱',
    iconBg: 'bg-emerald-100',
    borderColor: 'border-l-emerald-500',
  },
  {
    id: 2,
    title: 'Certificación Orgánica Aprobada',
    description: '¡Felicidades! Tu huerto "Terra Verde" ha completado exitosamente la validación para el sello orgánico de este trimestre.',
    time: 'Ayer, 18:15',
    icon: '✅',
    iconBg: 'bg-green-100',
    borderColor: 'border-l-emerald-500',
  },
  {
    id: 3,
    title: 'Nueva interacción en tu comunidad',
    description: 'María y 4 personas más comentaron tu publicación sobre el compostaje aeróbico en macetas.',
    time: '12 Oct, 10:30',
    icon: '💬',
    iconBg: 'bg-gray-100',
    borderColor: null,
  },
  {
    id: 4,
    title: 'Pedido de semillas confirmado',
    description: 'Tu pedido #4829 ya está en camino. Podrás realizar el seguimiento desde el panel de compras.',
    time: '11 Oct, 14:20',
    icon: '📦',
    iconBg: 'bg-gray-100',
    borderColor: null,
  },
  {
    id: 5,
    title: 'Alerta: Descenso de temperatura',
    description: 'Se prevé una helada para esta noche. Recomendamos proteger los cultivos más sensibles con mantas térmicas.',
    time: '10 Oct, 22:00',
    icon: '⚠️',
    iconBg: 'bg-orange-100',
    borderColor: 'border-l-orange-500',
  },
  {
    id: 6,
    title: 'Tip de la semana: Rotación de cultivos',
    description: 'Aprende por qué nunca debes plantar tomates en el mismo lugar dos años seguidos para mantener el suelo sano.',
    time: '09 Oct, 08:00',
    icon: '💡',
    iconBg: 'bg-yellow-100',
    borderColor: null,
  },
  {
    id: 7,
    title: 'Actualización del sistema',
    description: 'Hemos mejorado la precisión del sensor de humedad. Asegúrate de recalibrar tus dispositivos conectados.',
    time: '08 Oct, 03:00',
    icon: '🔄',
    iconBg: 'bg-gray-100',
    borderColor: null,
  },
  {
    id: 8,
    title: 'Suscripción Premium: Renovación',
    description: 'Tu suscripción anual se renovará automáticamente en 3 días. Gracias por ser parte de Terra.',
    time: '07 Oct, 11:45',
    icon: '⭐',
    iconBg: 'bg-amber-100',
    borderColor: null,
  },
]

const ITEMS_PER_PAGE = 5

export default function NotificacionesPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredNotifications = MOCK_NOTIFICATIONS.filter(
    (notif) =>
      notif.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notif.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const totalPages = Math.ceil(filteredNotifications.length / ITEMS_PER_PAGE)
  const paginatedNotifications = filteredNotifications.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold text-foreground">Notificaciones</h1>

          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar notificaciones..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                className="pl-9"
              />
            </div>
            <Button variant="outline" size="icon" className="h-9 w-9 shrink-0">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
            <Avatar className="h-9 w-9 shrink-0">
              <AvatarFallback className="bg-brand text-white text-sm">U</AvatarFallback>
            </Avatar>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {paginatedNotifications.map((notif) => (
            <div
              key={notif.id}
              className={cn(
                'flex items-start gap-4 p-4 bg-card rounded-xl border border-border hover:shadow-md transition-shadow cursor-pointer',
                notif.borderColor && `border-l-4 ${notif.borderColor}`,
              )}
            >
              <div
                className={cn(
                  'shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg',
                  notif.iconBg,
                )}
              >
                {notif.icon}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground mb-1">{notif.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {notif.description}
                </p>
              </div>

              <span className="shrink-0 text-xs text-muted-foreground whitespace-nowrap">
                {notif.time}
              </span>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            className="mt-8"
          />
        )}
      </div>
    </div>
  )
}
