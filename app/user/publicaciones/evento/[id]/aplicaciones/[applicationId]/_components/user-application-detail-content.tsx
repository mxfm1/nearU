'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle, XCircle, Clock, Star, Globe, Calendar, MapPin, Info, ExternalLink, BadgeCheck } from 'lucide-react'
import { applicationsApi, type ApplicationStatus } from '@/lib/applications-api'
import { eventosApi } from '@/lib/eventos-api'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

interface UserApplicationDetailContentProps {
  eventId: string
  applicationId: string
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeOut' as const },
}

function getStatusConfig(status: ApplicationStatus) {
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
      return { label: status, bg: 'bg-muted', text: 'text-muted-foreground', border: 'border-border', icon: Clock }
  }
}

function ScoreCircle({ score, maxScore }: { score: number; maxScore: number }) {
  const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0
  const radius = 58
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className="relative flex items-center justify-center">
      <svg className="w-32 h-32 transform -rotate-90">
        <circle className="text-muted" cx="64" cy="64" fill="transparent" r={radius} stroke="currentColor" strokeWidth="8" />
        <circle className="text-primary" cx="64" cy="64" fill="transparent" r={radius} stroke="currentColor" strokeWidth="8" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-bold text-primary leading-none">{score}</span>
        <span className="text-xs text-muted-foreground">de {maxScore}</span>
      </div>
    </div>
  )
}

export function UserApplicationDetailContent({ eventId, applicationId }: UserApplicationDetailContentProps) {
  const router = useRouter()
  const queryClient = useQueryClient()

  const { data: eventRes } = useQuery({
    queryKey: ['evento', eventId],
    queryFn: () => eventosApi.getById(eventId),
  })

  const { data: applicationRes, isLoading } = useQuery({
    queryKey: ['application-detail', applicationId],
    queryFn: () => applicationsApi.getById(applicationId),
  })

  const updateMutation = useMutation({
    mutationFn: (status: ApplicationStatus) => applicationsApi.updateApplicationStatus(applicationId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['application-detail', applicationId] })
      queryClient.invalidateQueries({ queryKey: ['event-applications', eventId] })
      toast.success('Estado actualizado')
    },
    onError: () => toast.error('Error al actualizar el estado'),
  })

  const event = eventRes?.data
  const application = applicationRes?.data
  const statusConfig = application?.status ? getStatusConfig(application.status as ApplicationStatus) : null

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Aplicación no encontrada</h2>
          <Button variant="outline" onClick={() => router.back()}><ArrowLeft className="w-4 h-4 mr-2" />Volver</Button>
        </div>
      </div>
    )
  }

  const maxScore = application.score?.maxPossible || 100
  const totalScore = application.score?.totalScore || 0

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card border-b shadow-sm">
        <nav className="flex justify-between items-center px-4 md:px-8 w-full h-16 max-w-6xl mx-auto">
          <Link href="/user/publicaciones" className="font-bold text-xl text-primary">NearU</Link>
          <Button variant="ghost" asChild>
            <Link href={`/user/publicaciones/evento/${eventId}/aplicaciones`}><ArrowLeft className="w-4 h-4 mr-2" />Volver a aplicaciones</Link>
          </Button>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-8 py-8 pb-32">
        <motion.div {...fadeInUp} className="mb-8">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Volver al listado de postulaciones</span>
          </button>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content Area */}
          <div className="flex-grow space-y-6">
            <motion.div {...fadeInUp} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h1 className="text-2xl md:text-3xl font-bold text-primary">Detalle de la Postulación</h1>
              
              {/* Status Badge */}
              {statusConfig && (
                <div className={cn('inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm border-2', statusConfig.bg, statusConfig.text, statusConfig.border)}>
                  {application.status === 'pending' && <Clock className="w-4 h-4" />}
                  {application.status === 'reviewing' && <Clock className="w-4 h-4" />}
                  {application.status === 'accepted' && <CheckCircle className="w-4 h-4" />}
                  {application.status === 'rejected' && <XCircle className="w-4 h-4" />}
                  {statusConfig.label}
                </div>
              )}
            </motion.div>

            {/* Applicant Company Summary Card */}
            <motion.div {...fadeInUp} className="bg-card rounded-xl p-6 shadow-sm flex flex-col md:flex-row items-center gap-6 border">
              <div className="w-24 h-24 rounded-lg bg-muted overflow-hidden border shrink-0">
                {(application.applicantProfile as any)?.logoUrl || (application.applicantProfile as any)?.imageUrl ? (
                  <img src={(application.applicantProfile as any)?.logoUrl || (application.applicantProfile as any)?.imageUrl} alt={application.applicantProfile?.name || ''} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold text-3xl">
                    {application.applicantProfile?.name?.[0]?.toUpperCase() || '?'}
                  </div>
                )}
              </div>
              <div className="flex-grow text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
                  <h2 className="text-xl md:text-2xl font-bold">{application.applicantProfile?.name || 'Sin nombre'}</h2>
                  {(application.applicantProfile as any)?.isVerified && (
                    <BadgeCheck className="w-5 h-5 text-primary mx-auto md:mx-0" />
                  )}
                </div>
                <div className="flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-1 text-muted-foreground">
                  <span className="flex items-center gap-1">
                    {(application.applicantProfile as any)?.categories?.[0] || (application.applicantProfile as any)?.industry || 'Proveedor'}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {application.region || (application.applicantProfile as any)?.region || 'Chile'}
                  </span>
                </div>
              </div>
              <Button variant="outline" className="shrink-0">
                Ver Perfil de la Empresa
              </Button>
            </motion.div>

            {/* Detailed Information Section */}
            <motion.div {...fadeInUp} className="bg-card rounded-xl p-8 shadow-sm border">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  Información de la postulación
                </h3>
                <span className="text-sm text-muted-foreground">
                  Recibido el {application.createdAt ? new Date(application.createdAt).toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Fecha no disponible'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Nombre</p>
                  <p className="text-base text-foreground">{application.applicantProfile?.name || 'No disponible'}</p>
                </div>
                {/* <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Región</p>
                  <p className="text-base text-foreground">{application.applicantProfile?.region || 'No disponible'}</p>
                </div> */}
                <div className="md:col-span-2 space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Descripción</p>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    {application.coverLetter || 'El proveedor no incluyó una carta de presentación.'}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div {...fadeInUp} className="bg-card rounded-xl p-6 shadow-sm border flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="hidden md:flex flex-col">
                <p className="text-sm text-muted-foreground">Evaluando postulación de:</p>
                <p className="text-lg font-semibold leading-tight">{application.applicantProfile?.name || 'Proveedor'}</p>
              </div>
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="flex-1 sm:flex-none px-8 py-3 rounded-lg border-2"
                  onClick={() => updateMutation.mutate('rejected')}
                  disabled={updateMutation.isPending}
                >
                  Rechazar Postulación
                </Button>
                <Button
                  className="flex-1 sm:flex-none px-12 py-3 rounded-lg bg-primary text-white shadow-md"
                  onClick={() => updateMutation.mutate('accepted')}
                  disabled={updateMutation.isPending}
                >
                  Aceptar Postulación
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Scoring Sidebar */}
          <aside className="w-full lg:w-80 shrink-0 space-y-6">
            <motion.div {...fadeInUp} className="bg-card rounded-xl p-6 shadow-sm border border-primary/10">
              <h3 className="text-lg font-semibold text-primary mb-6">Puntuación NearU</h3>

              <div className="flex flex-col items-center mb-8">
                <ScoreCircle score={totalScore} maxScore={maxScore} />
                <p className="mt-4 text-sm text-primary bg-primary/10 px-3 py-1 rounded-full italic">
                  Puntos obtenidos
                </p>
              </div>

              <div className="space-y-4">
                {application.score?.breakdown ? (
                  application.score.breakdown.length > 0 ? (
                    application.score.breakdown.map((item: any, idx: number) => {
                      const itemPercentage = item.pointsPossible > 0 ? (item.pointsEarned / item.pointsPossible) * 100 : 0
                      return (
                        <div key={idx} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">{item.ruleType || `Criterio ${idx + 1}`}</span>
                            <span className="text-sm font-medium text-primary">{item.pointsEarned}/{item.pointsPossible}</span>
                          </div>
                          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: `${itemPercentage}%` }}></div>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-sm text-muted-foreground">No hay criterios de evaluación configurados para este evento.</p>
                    </div>
                  )
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Puntuación Total</span>
                      <span className="text-sm font-medium text-primary">{totalScore}/{maxScore}</span>
                    </div>
                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${(totalScore / maxScore) * 100}%` }}></div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/10">
                <p className="text-sm text-primary font-medium mb-1 flex items-center gap-1">
                  Detalles
                </p>
                <p className="text-xs text-muted-foreground italic">
                  La postulación ha sido evaluada automáticamente por el sistema de scoring de NearU en base a los parámetros elegidos al crear el evento.
                </p>
              </div>
            </motion.div>

            {/* Event Info */}
            {/* {event && (
              <motion.div {...fadeInUp} className="bg-card rounded-xl p-6 shadow-sm border">
                <h3 className="text-lg font-semibold text-primary mb-4">Información del Evento</h3>
                <div className="space-y-3">
                  <p className="font-medium">{event.title}</p>
                  {event.startAt && (
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(event.startAt).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  )}
                  {event.location && (
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {typeof event.location === 'string' ? event.location : event.location?.name}
                    </p>
                  )}
                </div>
              </motion.div>
            )} */}
          </aside>
        </div>
      </main>
    </div>
  )
}
