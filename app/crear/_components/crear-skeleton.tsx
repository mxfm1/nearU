import { cn } from '@/lib/utils';

export function CrearSkeleton() {
  return (
    <div className="animate-pulse w-full min-h-screen" role="status" aria-label="Loading">
      <section className="px-4 pt-24 pb-20 md:pt-32 md:pb-28">
        <div className="max-w-4xl mx-auto">
          {/* Header skeleton */}
          <div className="text-center mb-12">
            <div className="h-12 w-64 bg-muted rounded-lg mx-auto mb-4" />
            <div className="space-y-2 max-w-2xl mx-auto">
              <div className="h-5 w-full bg-muted rounded mx-auto" />
              <div className="h-5 w-3/4 bg-muted rounded mx-auto" />
            </div>
          </div>

          {/* Cards skeleton */}
          <div className="flex flex-col md:flex-row gap-6 mb-12">
            <div className="flex-1 p-8 rounded-xl border bg-card">
              <div className="w-10 h-10 rounded-lg border bg-muted mb-6" />
              <div className="h-7 w-32 bg-muted rounded mb-3" />
              <div className="h-5 w-48 bg-muted rounded mb-8" />
              <div className="h-4 w-28 bg-muted rounded" />
            </div>
            <div className="flex-1 p-8 rounded-xl border bg-card">
              <div className="w-10 h-10 rounded-lg border bg-muted mb-6" />
              <div className="h-7 w-32 bg-muted rounded mb-3" />
              <div className="h-5 w-56 bg-muted rounded mb-8" />
              <div className="h-4 w-28 bg-muted rounded" />
            </div>
          </div>

          {/* Bottom guidance skeleton */}
          <div className="text-center">
            <div className="h-4 w-64 bg-muted rounded mx-auto" />
          </div>
        </div>
      </section>
    </div>
  );
}
