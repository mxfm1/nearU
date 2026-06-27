import { cn } from '@/lib/utils'

export function ServicioSkeleton() {
  return (
    <div className="animate-pulse w-full min-h-screen" role="status" aria-label="Loading">
      <section className="px-4 pt-24 pb-20 md:pt-32 md:pb-28">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Sidebar skeleton */}
            <div className="w-full lg:w-[280px]">
              <div className="h-7 w-48 bg-muted rounded mb-3" />
              <div className="space-y-2 mb-8">
                <div className="h-4 w-full bg-muted rounded" />
                <div className="h-4 w-3/4 bg-muted rounded" />
              </div>
              <div className="space-y-2">
                <div className="h-10 w-full bg-muted rounded" />
                <div className="h-10 w-full bg-muted rounded" />
                <div className="h-10 w-full bg-muted rounded" />
              </div>
            </div>

            {/* Form content skeleton */}
            <div className="flex-1 space-y-12">
              {/* Section 1 */}
              <div className="space-y-6">
                <div className="h-4 w-36 bg-muted rounded" />
                <div className="h-10 w-full bg-muted rounded" />
                <div className="h-10 w-full bg-muted rounded" />
                <div className="h-10 w-full bg-muted rounded" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-10 w-full bg-muted rounded" />
                  <div className="h-10 w-full bg-muted rounded" />
                </div>
              </div>

              {/* Section 2 */}
              <div className="space-y-6">
                <div className="h-4 w-44 bg-muted rounded" />
                <div className="h-32 w-full bg-muted rounded" />
                <div className="grid grid-cols-4 gap-4">
                  <div className="aspect-square bg-muted rounded" />
                  <div className="aspect-square bg-muted rounded" />
                  <div className="aspect-square bg-muted rounded" />
                  <div className="aspect-square bg-muted rounded" />
                </div>
              </div>

              {/* Section 3 */}
              <div className="space-y-6">
                <div className="h-4 w-40 bg-muted rounded" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-10 w-full bg-muted rounded" />
                  <div className="h-10 w-full bg-muted rounded" />
                  <div className="h-10 w-full bg-muted rounded" />
                  <div className="h-10 w-full bg-muted rounded" />
                  <div className="h-10 w-full bg-muted rounded" />
                  <div className="h-10 w-full bg-muted rounded" />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-6 border-t border-border">
                <div className="h-10 w-32 bg-muted rounded" />
                <div className="h-10 w-40 bg-muted rounded" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
