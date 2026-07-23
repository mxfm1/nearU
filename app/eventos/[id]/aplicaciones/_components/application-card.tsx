'use client'

import { useRouter } from 'next/navigation'
import { MapPin, Star, CheckCircle } from 'lucide-react'
import { applicationsApi, type ApplicationStatus, type EventApplication } from '@/lib/applications-api'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ApplicationCardProps {
  application: EventApplication
}

function getStatusBadge(status?: string) {
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
          Rechazado
        </span>
      )
    default:
      return null
  }
}

export function ApplicationCard({ application }: ApplicationCardProps) {
  const router = useRouter()
  const maxScore = application.score?.maxPossible || 100
  const totalScore = application.score?.totalScore || 0
  const scorePercentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0

  return (
    <div
      onClick={() => router.push(`/eventos/${application.eventId}/aplicaciones/${application.id}`)}
      className="group bg-card rounded-xl shadow-sm hover:shadow-md transition-all border border-border flex flex-col md:flex-row items-center p-5 gap-6 cursor-pointer"
    >
      {/* Profile Image */}
      <div className="relative w-20 h-20 rounded-xl bg-muted overflow-hidden border border-border shrink-0">
        {application.applicantProfile?.logoUrl ? (
          <img
            src={application.applicantProfile.logoUrl}
            alt={application.applicantProfile?.name || 'Perfil'}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold text-xl">
            {application.applicantProfile?.name?.[0]?.toUpperCase() || '?'}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-grow flex flex-col md:flex-row md:items-center gap-6 w-full">
        <div className="flex-grow">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-lg text-foreground">
              {application.applicantProfile?.name || 'Sin nombre'}
            </h3>
            {application.applicantProfile?.isVerified && (
              <span className="text-primary" title="Verificado">
                <CheckCircle className="w-5 h-5 fill-primary/20" />
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {application.applicantProfile?.categories?.map((category) => (
              <span
                key={category}
                className="bg-muted px-3 py-0.5 rounded-full text-sm text-muted-foreground flex items-center gap-1"
              >
                {category}
              </span>
            ))}
            {application.applicantProfile?.region && (
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
