'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { Loader2, AlertTriangle, MapPin, Tag, Calendar, ArrowLeft, Send } from 'lucide-react'
import { eventosApi } from '@/lib/eventos-api'
import { profileApi } from '@/lib/profile-api'
import { useAuth } from '@/hooks/use-auth'
import { ServiceStatusBadge } from '@/components/ui/service-status-badge'
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

interface EventPageContentProps {
  id: string
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

  if (isLoading) {
    return (
      <section className="px-4 pt-24 pb-20 md:pt-32 md:pb-28">
        <div className="max-w-4xl mx-auto flex items-center justify-center min-h-[40vh]">
          <Loader2 className="h-8 w-8 animate-spin text-brand" />
        </div>
      </section>
    )
  }

  if (isError) {
    return (
      <section className="px-4 pt-24 pb-20 md:pt-32 md:pb-28">
        <div className="max-w-4xl mx-auto text-center">
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
      </section>
    )
  }

  const evento = data?.data
  if (!evento) return null

  const isOwnEvent = !!myProfile && myProfile.id === evento.profileId

  return (
    <section className="px-4 pt-24 pb-20 md:pt-32 md:pb-28">
      <div className="max-w-4xl mx-auto">
        {/* Back link */}
        <Link
          href="/user/publicaciones"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a mis publicaciones
        </Link>

        {/* Thumbnail */}
        {evento.thumbnailUrl && (
          <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted mb-8 relative">
            <Image
              src={evento.thumbnailUrl}
              alt={evento.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-foreground">{evento.title}</h1>
              <ServiceStatusBadge status={evento.eventStatus} />
            </div>
            <p className="text-sm text-muted-foreground">
              Creado el {new Date(evento.createdAt).toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
          {!isOwnEvent && (
            <Button
              onClick={() => setShowApplyDialog(true)}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Send className="h-4 w-4 mr-2" />
              Postularme
            </Button>
          )}
        </div>

        {/* Meta info */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8">
          {evento.startAt && (
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {new Date(evento.startAt).toLocaleDateString('es-ES', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          )}
          {evento.location && (
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              {evento.location.name}
            </span>
          )}
          {evento.category && (
            <span className="flex items-center gap-1.5">
              <Tag className="h-4 w-4" />
              {evento.category.name}
            </span>
          )}
        </div>

        {/* Description */}
        {evento.description && (
          <div className="prose prose-sm max-w-none text-muted-foreground">
            <p>{evento.description}</p>
          </div>
        )}
      </div>

      {/* Apply Dialog */}
      {!isOwnEvent && (
        <AlertDialog open={showApplyDialog} onOpenChange={setShowApplyDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Querés postularte a este evento?</AlertDialogTitle>
              <AlertDialogDescription>
                Serás redirigido al formulario de postulación. Completá los datos solicitados
                para que el organizador pueda evaluar tu perfil.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => router.push(`/eventos/${id}/aplicar`)}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Continuar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </section>
  )
}
