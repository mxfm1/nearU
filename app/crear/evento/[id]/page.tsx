import { Suspense } from 'react'
import { ApplicationScoreForm } from './_components/application-score-form'
import { ApplicationScoreSkeleton } from './_components/application-score-skeleton'

interface ScoreRulesPageProps {
  params: {
    id: string
  }
}

export default function ScoreRulesPage({ params }: ScoreRulesPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-brand">
            Configuración de Reglas de Puntaje
          </h1>
        </div>

        <Suspense fallback={<ApplicationScoreSkeleton />}>
          <ApplicationScoreForm eventId={params.id} />
        </Suspense>
      </div>
    </div>
  )
}
