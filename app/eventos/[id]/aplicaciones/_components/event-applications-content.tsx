'use client'

import { useQuery } from '@tanstack/react-query'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Filter, Calendar, MapPin, Star, CheckCircle, Clock, XCircle, MoreVertical } from 'lucide-react'
import { applicationsApi, type ApplicationStatus, type EventApplication } from '@/lib/applications-api'
import { eventosApi } from '@/lib/eventos-api'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface EventApplicationsContentProps {
  eventId: string
  statusFilter: string
  currentPage: number
}

const STATUS_OPTIONS = [
  { value: 'all', label: 'Todos' },
  { value: 'pending', label: 'Pendiente' },
  { value: 'reviewing', label: 'En revisión' },
  { value: 'accepted', label: 'Aprobado' },
  { value: 'rejected', label: 'Rechazado' },
]

function getStatusBadge(status: ApplicationStatus) {
  switch (status) {
    case 'pending':
      return (
        <span className="px-4 py-1.5 rounded-full bg-muted text-secondary font-bold text-sm border border-border">
          Pendiente
        </span>
      )
    case 'reviewing':
      return (
        <span className="px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 font-bold text-sm border border-blue-200">
          En revisión
        </span>
      )
    case 'accepted':
      return (
        <span className="px-4 py-1.5 rounded-full bg-green-100 text-green-700 font-bold text-sm border border-green-200 flex items-center gap-1">
          <CheckCircle className="w-4 h-4" />
          Aprobado
        </span>
      )
    case 'rejected':
      return (
        <span className="px-4 py-1.5 rounded-full bg-red-100 text-red-700 font-bold text-sm border border-red-200 flex items-center gap-1">
          <XCircle className="w-4 h-4" />
          Rechazado
        </span>
      )
    default:
      return null
  }
}

function ApplicationCard({ application }: { application: EventApplication }) {
  const router = useRouter()
  const maxScore = application.score?.maxPossible || 100
  const totalScore = application.score?.totalScore || 0
  const scorePercentage = Math.round((totalScore / maxScore) * 100)

  return (
    <div
      onClick={() => router.push(`/eventos/${application.eventId}/aplicaciones/${application.id}`)}
      className="group bg-card rounded-xl shadow-sm hover:shadow-md transition-all border border-border flex flex-col md:flex-row items-center p-5 gap-6 cursor-pointer"
    >
      {/* Profile Image */}
      <div className="relative w-20 h-20 rounded-xl bg-muted overflow-hidden border border-border shrink-0">
        {application.applicantProfile.imageUrl ? (
          <img
            src={application.applicantProfile.imageUrl}
            alt={application.applicantProfile.name || 'Perfil'}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold text-xl">
            {application.applicantProfile.name?.[0]?.toUpperCase() || '?'}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-grow flex flex-col md:flex-row md:items-center gap-6 w-full">
        <div className="flex-grow">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-lg text-foreground">
              {application.applicantProfile.name || 'Sin nombre'}
            </h3>
            {application.applicantProfile.isVerified && (
              <span className="text-primary" title="Verificado">
                <CheckCircle className="w-5 h-5 fill-primary/20" />
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {application.applicantProfile.categories.map((category) => (
              <span
                key={category}
                className="bg-muted px-3 py-0.5 rounded-full text-sm text-muted-foreground flex items-center gap-1"
              >
                {category}
              </span>
            ))}
            {application.applicantProfile.region && (
              <span className="bg-muted px-3 py-0.5 rounded-full text-sm text-muted-foreground flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {application.applicantProfile.region}
              </span>
            )}
          </div>
        </div>

        {/* Stats & Actions */}
        <div className="flex items-center gap-8 md:gap-6 justify-between md:justify-end shrink-0 w-full md:w-auto">
          {/* Score */}
          <div className="text-center">
            <span className="block text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Puntuación
            </span>
            <div
              className={cn(
                'flex items-center justify-center gap-1 px-3 py-1 rounded-lg font-bold',
                scorePercentage >= 80
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              <Star className={cn('w-4 h-4', scorePercentage >= 80 && 'fill-amber-500')} />
              {totalScore} pts
            </div>
          </div>

          {/* Status */}
          <div className="text-center">
            <span className="block text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Estado
            </span>
            {getStatusBadge(application.status)}
          </div>

          {/* Action Button */}
          <div className="flex items-center">
            <Button size="sm" className="shadow-sm">
              Gestionar
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function EventApplicationsContent({
  eventId,
  statusFilter,
  currentPage,
}: EventApplicationsContentProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Fetch event details
  const { data: eventRes, isLoading: eventLoading } = useQuery({
    queryKey: ['evento', eventId],
    queryFn: () => eventosApi.getById(eventId),
  })

  // Fetch applications
  const { data: applicationsRes, isLoading: applicationsLoading } = useQuery({
    queryKey: ['event-applications', eventId, statusFilter, currentPage],
    queryFn: () =>
      applicationsApi.getEventApplications(eventId, {
        status: statusFilter as ApplicationStatus | 'all',
        page: currentPage,
        limit: 10,
      }),
  })

  const event = eventRes?.data
  const applications = applicationsRes?.data?.applications || []
  const total = applicationsRes?.data?.total || 0
  const totalPages = applicationsRes?.data?.totalPages || 1

  const handleStatusChange = (newStatus: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (newStatus === 'all') {
      params.delete('status')
    } else {
      params.set('status', newStatus)
    }
    params.delete('page')
    router.push(`?${params.toString()}`)
  }

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(newPage))
    router.push(`?${params.toString()}`)
  }

  if (eventLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* TopNavBar */}
      <header className="sticky top-0 z-50 bg-card border-b shadow-sm">
        <nav className="flex justify-between items-center px-4 md:px-8 w-full h-16 max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            <Link href="/" className="font-bold text-xl text-primary">
              NearU
            </Link>
          </div>
          <Button variant="ghost" asChild>
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Inicio
            </Link>
          </Button>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-8">
        {/* Breadcrumb */}
        <div className="mb-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Volver a mis publicaciones</span>
          </button>
        </div>

        {/* Event Overview Card */}
        {event && (
          <section className="bg-card rounded-xl shadow-sm overflow-hidden mb-8 border border-border">
            <div className="flex flex-col md:flex-row items-center p-6 gap-6">
              <div className="w-full md:w-32 h-24 rounded-lg overflow-hidden shrink-0 bg-muted">
                {event.thumbnailUrl ? (
                  <img
                    src={event.thumbnailUrl}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary/10">
                    <span className="text-3xl">📅</span>
                  </div>
                )}
              </div>
              <div className="flex-grow text-center md:text-left">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-1">
                  <h1 className="text-2xl font-bold text-primary">{event.title}</h1>
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                    Activo
                  </span>
                </div>
                <p className="text-muted-foreground flex items-center justify-center md:justify-start gap-4">
                  {event.startAt && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(event.startAt).toLocaleDateString('es-CL', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  )}
                  {event.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {event.location}
                    </span>
                  )}
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" size="sm">
                  Editar Evento
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* Main Content Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-1">Aplicaciones del Evento</h2>
            <p className="text-muted-foreground">
              Listado de proveedores postulados ordenados por calificación de confianza.
            </p>
          </div>
          <div className="flex items-center gap-4 bg-muted p-2 rounded-xl border">
            <div className="flex items-center gap-2 px-3 border-r border-border">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Filtrar:</span>
              <select
                value={statusFilter}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="bg-transparent border-none focus:ring-0 font-bold text-primary p-0 pr-6 text-sm cursor-pointer"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="px-3">
              <span className="text-sm text-muted-foreground">
                <strong className="text-primary">{total}</strong> Aplicaciones
              </span>
            </div>
          </div>
        </div>

        {/* Application List */}
        {applicationsLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-card rounded-xl border border-border p-5 flex items-center gap-6 animate-pulse"
              >
                <div className="w-20 h-20 rounded-xl bg-muted" />
                <div className="flex-grow space-y-2">
                  <div className="h-5 w-48 bg-muted rounded" />
                  <div className="h-4 w-32 bg-muted rounded" />
                </div>
                <div className="w-24 h-8 bg-muted rounded" />
              </div>
            ))}
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-xl border border-border">
            <p className="text-muted-foreground">
              No hay aplicaciones {statusFilter !== 'all' ? `con estado "${statusFilter}"` : ''} para este evento.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((application) => (
              <ApplicationCard key={application.id} application={application} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex flex-col md:flex-row items-center justify-between bg-card p-4 rounded-xl border border-border">
            <span className="text-sm text-muted-foreground mb-4 md:mb-0">
              Mostrando <strong>{(currentPage - 1) * 10 + 1}</strong> -{' '}
              <strong>{Math.min(currentPage * 10, total)}</strong> de <strong>{total}</strong> aplicaciones
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  return page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1
                })
                .map((page, index, array) => (
                  <span key={page}>
                    {index > 0 && array[index - 1] !== page - 1 && (
                      <span className="text-muted-foreground px-2">...</span>
                    )}
                    <Button
                      variant={page === currentPage ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </Button>
                  </span>
                ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
