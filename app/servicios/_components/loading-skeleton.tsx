import { cn } from '@/lib/utils'

export function LoadingSkeleton() {
  return (
    <div className="animate-pulse w-full" role="status" aria-label="Cargando">
      <div className="w-full aspect-[3/1] sm:aspect-[4/1] md:aspect-[5/1] bg-muted" />

      <div className="mt-16 sm:mt-20 px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-4">
            <div className="h-5 w-24 rounded-full bg-muted" />
            <div className="space-y-2">
              <div className="h-4 w-32 rounded bg-muted" />
              <div className="h-8 w-3/4 rounded bg-muted" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-full rounded bg-muted" />
              <div className="h-4 w-5/6 rounded bg-muted" />
              <div className="h-4 w-4/6 rounded bg-muted" />
            </div>
            <div className="h-4 w-40 rounded bg-muted" />
          </div>

          <div className="lg:col-span-5">
            <div className="p-4 sm:p-6 border rounded-xl bg-card space-y-4">
              <div className="h-6 w-24 rounded bg-muted" />
              <div className="space-y-3">
                <div className="h-4 w-full rounded bg-muted" />
                <div className="h-4 w-3/4 rounded bg-muted" />
                <div className="h-4 w-1/2 rounded bg-muted" />
              </div>
              <div className="h-10 w-full rounded bg-muted" />
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 mt-8 space-y-4">
        <div className="h-6 w-48 rounded bg-muted" />
        <div className="flex gap-4">
          {Array.from({ length: 4 }, (_, i) => (
            <div
              key={i}
              className={cn(
                'flex-shrink-0 w-[280px] sm:w-[320px]',
                'aspect-video rounded-lg bg-muted',
              )}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
