export function EventLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Banner Skeleton */}
      <div className="relative w-full h-[280px] md:h-[400px] bg-muted animate-pulse" />

      {/* Content Skeleton */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-6 md:space-y-8">
            {/* Metrics Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-card p-4 md:p-6 rounded-2xl border border-border"
                >
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-muted mb-2 md:mb-3 animate-pulse" />
                  <div className="h-3 w-16 bg-muted rounded mb-1 animate-pulse" />
                  <div className="h-5 w-12 bg-muted rounded animate-pulse" />
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="bg-card p-6 md:p-8 rounded-2xl md:rounded-3xl border border-border">
              <div className="h-5 w-32 bg-muted rounded mb-4 md:mb-6 animate-pulse" />
              <div className="space-y-2 md:space-y-3">
                <div className="h-4 w-full bg-muted rounded animate-pulse" />
                <div className="h-4 w-5/6 bg-muted rounded animate-pulse" />
                <div className="h-4 w-4/6 bg-muted rounded animate-pulse" />
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-muted/30 p-6 md:p-8 rounded-2xl md:rounded-3xl">
              <div className="h-5 w-40 bg-muted rounded mb-4 md:mb-6 animate-pulse" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 bg-card rounded-xl animate-pulse"
                  >
                    <div className="w-8 h-8 rounded-lg bg-muted shrink-0" />
                    <div className="space-y-1.5 flex-1">
                      <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                      <div className="h-3 w-full bg-muted rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-4 md:space-y-6">
            <div className="bg-card p-6 md:p-8 rounded-2xl md:rounded-3xl border border-border sticky top-20">
              <div className="space-y-4 md:space-y-6">
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                  <div className="h-3 w-full bg-muted rounded animate-pulse" />
                </div>
                <div className="space-y-2">
                  <div className="h-11 w-full bg-muted rounded-xl animate-pulse" />
                  <div className="h-11 w-full bg-muted rounded-xl animate-pulse" />
                </div>
                <div className="pt-4 border-t border-border">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-muted animate-pulse" />
                    <div className="space-y-1.5">
                      <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                      <div className="h-3 w-20 bg-muted rounded animate-pulse" />
                    </div>
                  </div>
                </div>
                <div className="bg-muted p-3 rounded-xl animate-pulse">
                  <div className="h-3 w-full bg-muted rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
