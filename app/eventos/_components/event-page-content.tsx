'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import {
  Loader2,
  AlertTriangle,
  MapPin,
  Calendar,
  CalendarCheck,
  ArrowLeft,
  Send,
  Timer,
  User,
  CheckCircle,
  ShieldCheck,
  Info,
  Users,
  MessageCircle,
  Box,
} from 'lucide-react'
import { eventosApi, type EventoDetalle } from '@/lib/eventos-api'
import { profileApi } from '@/lib/profile-api'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface EventPageContentProps {
  id: string
}

function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return 'Sin fecha'
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
}

function formatDateFull(dateString: string | null | undefined): string {
  if (!dateString) return 'Sin fecha'
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function MetricCard({
  icon: Icon,
  label,
  value,
  variant = 'default',
}: {
  icon: React.ElementType
  label: string
  value: string
  variant?: 'default' | 'success' | 'warning' | 'error'
}) {
  const variantStyles = {
    default: 'bg-muted text-muted-foreground',
    success: 'bg-primary/10 text-primary',
    warning: 'bg-amber-50 text-amber-600',
    error: 'bg-red-50 text-red-600',
  }

  return (
    <div className="bg-card p-4 md:p-6 rounded-2xl shadow-sm border border-border flex flex-col items-center text-center">
      <div
        className={cn(
          'w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center mb-2 md:mb-3',
          variantStyles[variant]
        )}
      >
        <Icon className="w-5 h-5 md:w-6 md:h-6" />
      </div>
      <p className="text-[10px] md:text-xs text-muted-foreground uppercase mb-1 font-medium">
        {label}
      </p>
      <p
        className={cn(
          'text-sm md:text-base font-bold',
          variant === 'error' && 'text-red-600',
          variant === 'success' && 'text-primary'
        )}
      >
        {value}
      </p>
    </div>
  )
}

function RequirementItem({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-xl">
      <div className="p-1.5 bg-card rounded-lg shadow-sm shrink-0">
        <Box className="w-4 h-4 text-primary fill-primary" />
      </div>
      <div>
        <h4 className="text-sm font-semibold text-primary">{title}</h4>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
    </div>
  )
}

export function EventPageContent({ id }: EventPageContentProps) {
  const router = useRouter()
  const [showApplyDialog, setShowApplyDialog] = useState(false)

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['evento', id],
    queryFn: () => eventosApi.getById(id),
    enabled: !!id,
  })

  const { user } = useAuth()

  const { data: myProfile } = useQuery({
    queryKey: ['my-profile', user?.id],
    queryFn: () => profileApi.getByUserId(user!.id),
    enabled: !!user?.id,
    select: (res) => res.data,
  })

  const { data: organizerProfile } = useQuery({
    queryKey: ['profile-by-id', data?.data?.profileId],
    queryFn: () => profileApi.getById(data!.data!.profileId!),
    enabled: !!data?.data?.profileId,
    select: (res) => res.data,
  })

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 mx-auto mb-4">
            <AlertTriangle className="h-7 w-7 text-destructive" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Evento no encontrado</h2>
          <p className="text-sm text-muted-foreground mb-6">
            {error instanceof Error ? error.message : 'No se pudo cargar el evento.'}
          </p>
          <Button asChild variant="outline">
            <Link href="/user/publicaciones">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a mis publicaciones
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  const evento = data?.data as (EventoDetalle & { eventStatus?: string }) | undefined
  if (!evento) return null

  const isOwnEvent = !!myProfile && myProfile.id === evento.profileId
  const isOpen = evento.eventStatus === 'published' || evento.eventStatus === undefined

  const requirements = evento.requirements
    ? evento.requirements.split('\n').filter(Boolean)
    : []

  return (
    <div className="min-h-screen bg-background">
      {/* Banner Section */}
      <section className="relative w-full h-[280px] md:h-[400px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: evento.bannerUrl
              ? `url(${evento.bannerUrl})`
              : evento.thumbnailUrl
                ? `url(${evento.thumbnailUrl})`
                : 'linear-gradient(135deg, #003b29 0%, #16503b 100%)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Floating Status Tags */}
        <div className="absolute top-4 right-4 md:top-6 md:right-6 flex gap-2">
          {isOpen && (
            <span className="bg-primary text-white px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              Abierto
            </span>
          )}
          {evento.category && (
            <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm border border-white/20">
              {evento.category.name}
            </span>
          )}
        </div>

        {/* Event Info Overlay */}
        <div className="absolute bottom-6 left-4 right-4 md:bottom-10 md:left-10 md:right-10 text-white max-w-3xl">
          <div className="flex items-center gap-1.5 mb-2 md:mb-3">
            <User className="w-4 h-4 text-primary-fixed" />
            <span className="text-xs font-medium tracking-wider uppercase">
              Evento Verificado B2B
            </span>
          </div>
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight mb-3 md:mb-4">
            {evento.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 md:gap-6 text-white/90 text-sm md:text-base">
            {evento.location && (
              <span className="flex items-center gap-1">
                <Box className="w-4 h-4" />
                {evento.location.name}
              </span>
            )}
            {evento.startAt && (
              <span className="flex items-center gap-1">
                <Box className="w-4 h-4" />
                {formatDateFull(evento.startAt)}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-8 space-y-6 md:space-y-8">
            {/* Metrics Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              <MetricCard
                icon={CalendarCheck}
                label="Fecha Inicio"
                value={formatDate(evento.startAt)}
                variant="success"
              />
              <MetricCard
                icon={Timer}
                label="Cierre Postul."
                value={formatDate(evento.applicationDeadline)}
                variant="error"
              />
              <MetricCard
                icon={Users}
                label="Vacantes"
                value={`${evento.requiredCandidates || 1} Cupos`}
              />
              <MetricCard
                icon={Send}
                label="Postulaciones"
                value="0 Hoy"
              />
            </div>

            {/* Description Section */}
            <div className="bg-card p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-sm border border-border">
              <h3 className="text-base md:text-lg font-semibold text-primary mb-4 md:mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-primary rounded-full hidden md:block" />
                Sobre el Evento
              </h3>
              <div className="text-sm md:text-base text-muted-foreground leading-relaxed space-y-3 md:space-y-4">
                {evento.description ? (
                  evento.description.split('\n').map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))
                ) : (
                  <p className="text-muted-foreground/60 italic">
                    Sin descripción disponible
                  </p>
                )}
              </div>
            </div>

            {/* Requirements Grid */}
            {requirements.length > 0 && (
              <div className="bg-muted/30 p-6 md:p-8 rounded-2xl md:rounded-3xl">
                <h3 className="text-base md:text-lg font-semibold text-primary mb-4 md:mb-6">
                  Requisitos para Postular
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  {requirements.map((req, index) => {
                    const [title, ...descParts] = req.split(':')
                    const description = descParts.join(':').trim()
                    return (
                      <RequirementItem
                        key={index}
                        title={title.trim()}
                        description={description || 'Requisito obligatorio'}
                      />
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-4 space-y-4 md:space-y-6">
            {/* Application Card */}
            <div className="bg-card p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-lg border border-border sticky top-20">
              <div className="space-y-4 md:space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-2">
                    Acción de Postulación
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Asegúrate de revisar todos los requisitos técnicos antes de enviar tu propuesta.
                  </p>
                </div>

                {!isOwnEvent ? (
                  <div className="flex flex-col gap-2 md:gap-3">
                    <Button
                      onClick={() => setShowApplyDialog(true)}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 md:py-4 rounded-xl shadow-md hover:shadow-lg transition-all"
                    >
                      Postular al Evento
                      <Send className="w-4 h-4 ml-2" />
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-2 border-primary text-primary hover:bg-primary/5 font-medium py-3 md:py-4 rounded-xl transition-colors"
                    >
                      Contactar Organizador
                      <MessageCircle className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                ) : (
                  <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl">
                    <p className="text-sm text-primary font-medium text-center">
                      Este es tu evento
                    </p>
                  </div>
                )}

                {/* Organizer Info */}
                <div className="pt-4 border-t border-border">
                  <div className="flex items-center gap-3 mb-3">
                    {organizerProfile?.logoUrl ? (
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border border-border">
                        <img
                          src={organizerProfile.logoUrl}
                          alt={organizerProfile.name ?? 'Logo'}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-bold text-sm md:text-base">
                          {organizerProfile?.name?.charAt(0) || 'O'}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-semibold">
                        {organizerProfile?.name || evento.profile?.name || 'Organizador'}
                      </p>
                      <p className="text-xs text-muted-foreground">Organizador Principal</p>
                    </div>
                  </div>
                  {evento.requiresVerifiedProfile && (
                    <div className="bg-muted p-3 rounded-xl flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
                      <span className="text-xs font-medium text-primary leading-tight">
                        Requiere Perfil Verificado para Postular
                      </span>
                    </div>
                  )}
                </div>

                {/* Selection Process Info */}
                <div className="bg-amber-50 border border-amber-200 p-3 md:p-4 rounded-xl">
                  <div className="flex items-center gap-1.5 text-amber-700 mb-1.5">
                    <Info className="w-3.5 h-3.5" />
                    <span className="text-xs font-semibold uppercase">
                      Proceso de Selección
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-700/80 leading-relaxed">
                    El equipo evaluará las postulaciones en un plazo de 72 horas hábiles.
                    Las entrevistas técnicas se realizarán vía videollamada.
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Details Card */}
            <div className="bg-card p-4 md:p-6 rounded-2xl border border-border">
              <h4 className="text-sm font-semibold text-foreground mb-3 md:mb-4">
                Detalles Adicionales
              </h4>
              <ul className="space-y-2 md:space-y-3">
                <li className="flex justify-between text-xs md:text-sm">
                  <span className="text-muted-foreground">Tipo de Servicio</span>
                  <span className="font-medium">Full Service</span>
                </li>
                <li className="flex justify-between text-xs md:text-sm">
                  <span className="text-muted-foreground">Modalidad Pago</span>
                  <span className="font-medium">30/60 Días</span>
                </li>
                <li className="flex justify-between text-xs md:text-sm">
                  <span className="text-muted-foreground">Presupuesto</span>
                  <span className="font-medium text-primary">Conversable</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Dialog */}
      {!isOwnEvent && (
        <AlertDialog open={showApplyDialog} onOpenChange={setShowApplyDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Querés postularte a este evento?</AlertDialogTitle>
              <AlertDialogDescription>
                Serás redirigido al formulario de postulación. Completá los datos
                solicitados para que el organizador pueda evaluar tu perfil.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => router.push(`/eventos/${id}/aplicar`)}
                className="bg-primary hover:bg-primary/90"
              >
                Continuar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  )
}
