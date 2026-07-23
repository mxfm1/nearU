'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, XCircle, Clock, Star, MapPin } from 'lucide-react'
import { type ApplicationStatus, type Application } from '@/lib/applications-api'
import type { EventoDetalle } from '@/lib/eventos-api'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ApplicationSectionProps {
  application: Application | null
  event: EventoDetalle | null
  isPending: boolean
  isError: boolean
  onRefetch: () => void
  onStatusChange: (status: ApplicationStatus) => void
  isStatusPending: boolean
}

function getStatusConfig(status?: string) {
  switch (status) {
    case 'pending':
      return { label: 'Pendiente', bg: 'bg-muted', text: 'text-muted-foreground', border: 'border-border', icon: Clock }
    case 'reviewing':
      return { label: 'En revisión', bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200', icon: Clock }
    case 'accepted':
      return { label: 'Aprobado', bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200', icon: CheckCircle }
    case 'rejected':
      return { label: 'Rechazado', bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', icon: XCircle }
    default:
      return { label: status || 'Desconocido', bg: 'bg-muted', text: 'text-muted-foreground', border: 'border-border', icon: Clock }
  }
}

function LoadingState() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  )
}

function ErrorState({ onRefetch }: { onRefetch: () => void }) {
  const router = useRouter()
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-bold mb-2">Error al cargar</h2>
        <Button variant="outline" onClick={onRefetch}>
          Reintentar
        </Button>
      </div>
    </div>
  )
}

function EmptyState() {
  const router = useRouter()
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-bold mb-2">Aplicación no encontrada</h2>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
      </div>
    </div>
  )
}

export function ApplicationSection({
  application,
  event,
  isPending,
  isError,
  onRefetch,
  onStatusChange,
  isStatusPending,
}: ApplicationSectionProps) {
  const router = useRouter()

  if (isPending) return <LoadingState />
  if (isError) return <ErrorState onRefetch={onRefetch} />
  if (!application) return <EmptyState />

  const statusConfig = getStatusConfig(application.status)
  const StatusIcon = statusConfig.icon
  const maxScore = application.score?.maxPossible || 100
  const totalScore = application.score?.totalScore || 0

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card border-b shadow-sm">
        <nav className="flex justify-between items-center px-4 md:px-8 w-full h-16 max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            <Link href="/" className="font-bold text-xl text-primary">
              NearU
            </Link>
          </div>
          <Button variant="ghost" asChild>
            <Link href={`/eventos/${application.eventId}/aplicaciones`}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a aplicaciones
            </Link>
          </Button>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-8">
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Volver a aplicaciones del evento</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Applicant Info Card */}
            <section className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="p-6 border-b border-border">
                <h2 className="text-xl font-bold">Información del Postulante</h2>
              </div>
              <div className="p-6">
                <div className="flex items-start gap-6">
                  <div className="w-24 h-24 rounded-xl bg-muted overflow-hidden shrink-0">
                    {application.applicantProfile?.logoUrl ? (
                      <img
                        src={application.applicantProfile.logoUrl}
                        alt={application.applicantProfile?.name || 'Perfil'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold text-3xl">
                        {application.applicantProfile?.name?.[0]?.toUpperCase() || '?'}
                      </div>
                    )}
                  </div>

                  <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-2xl font-bold">
                        {application.applicantProfile?.name || 'Sin nombre'}
                      </h3>
                      {application.applicantProfile?.isVerified && (
                        <span className="text-primary" title="Verificado">
                          <CheckCircle className="w-6 h-6 fill-primary/20" />
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {application.applicantProfile?.categories?.map((category) => (
                        <span key={category} className="bg-muted px-3 py-1 rounded-full text-sm">
                          {category}
                        </span>
                      ))}
                    </div>

                    {application.applicantProfile?.region && (
                      <p className="text-muted-foreground flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {application.applicantProfile.region}
                      </p>
                    )}
                  </div>

                  <div className="text-center">
                    <span className="block text-xs text-muted-foreground uppercase tracking-wider mb-1">
                      Puntuación
                    </span>
                    <div className={cn(
                      'flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-bold text-lg',
                      totalScore >= 80 ? 'bg-amber-100 text-amber-700' : 'bg-muted'
                    )}>
                      <Star className={cn('w-5 h-5', totalScore >= 80 && 'fill-amber-500')} />
                      {totalScore}/{maxScore}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Cover Letter */}
            {application.coverLetter && (
              <section className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="p-6 border-b border-border">
                  <h2 className="text-xl font-bold">Carta de Presentación</h2>
                </div>
                <div className="p-6">
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {application.coverLetter}
                  </p>
                </div>
              </section>
            )}

            {/* Portfolio URLs */}
            {application.portfolioUrls && application.portfolioUrls.length > 0 && (
              <section className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="p-6 border-b border-border">
                  <h2 className="text-xl font-bold">Portfolio</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-2">
                    {application.portfolioUrls.map((url, index) => (
                      <a
                        key={index}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-primary hover:underline"
                      >
                        {url}
                      </a>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* Sidebar - Right Column */}
          <div className="space-y-6">
            {/* Status Card */}
            <section className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="p-6 border-b border-border">
                <h2 className="text-xl font-bold">Estado</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className={cn('flex items-center gap-2 px-4 py-3 rounded-lg border', statusConfig.bg, statusConfig.text, statusConfig.border)}>
                  <StatusIcon className="w-5 h-5" />
                  <span className="font-semibold">{statusConfig.label}</span>
                </div>

                <p className="text-sm text-muted-foreground">
                  Fecha de postulación: {application.createdAt ? new Date(application.createdAt).toLocaleDateString('es-CL') : 'N/A'}
                </p>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Cambiar estado:</p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={application.status === 'pending' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => onStatusChange('pending')}
                      disabled={isStatusPending}
                    >
                      Pendiente
                    </Button>
                    <Button
                      variant={application.status === 'reviewing' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => onStatusChange('reviewing')}
                      disabled={isStatusPending}
                    >
                      Revisión
                    </Button>
                    <Button
                      variant={application.status === 'accepted' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => onStatusChange('accepted')}
                      disabled={isStatusPending}
                    >
                      Aprobado
                    </Button>
                    <Button
                      variant={application.status === 'rejected' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => onStatusChange('rejected')}
                      disabled={isStatusPending}
                    >
                      Rechazado
                    </Button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
