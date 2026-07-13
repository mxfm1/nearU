import { Suspense } from 'react'
import { ApplicationScoreForm } from '@/app/crear/evento/[id]/_components/application-score-form'

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
          <h1 className="text-3xl font-bold text-foreground">
            Configuración de Reglas de Puntaje
          </h1>
        </div>

        <Suspense
          fallback={
            <div className="flex items-center justify-center p-8">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          }
        >
          <ApplicationScoreForm eventId={params.id} />
        </Suspense>
      </div>
    </div>
  )
}
