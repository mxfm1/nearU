export function ApplicationScoreSkeleton() {
  return (
    <div className="space-y-6">
      {/* Event Header Skeleton */}
      <div className="flex items-center gap-4 p-4 bg-card rounded-lg border border-border">
        <div className="w-16 h-16 rounded-lg bg-muted animate-pulse flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-20 bg-muted rounded animate-pulse" />
          <div className="h-5 w-48 bg-muted rounded animate-pulse" />
        </div>
        <div className="h-10 w-28 bg-muted rounded-lg animate-pulse" />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Sidebar Skeleton */}
        <aside className="w-full lg:w-[280px] space-y-4">
          <div className="space-y-2">
            <div className="h-5 w-36 bg-muted rounded animate-pulse" />
            <div className="h-4 w-full bg-muted rounded animate-pulse" />
            <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
          </div>
          <div className="h-10 w-full bg-muted rounded-lg animate-pulse" />
          <div className="h-24 w-full bg-muted rounded-lg animate-pulse" />
        </aside>

        {/* Right Content Skeleton */}
        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-5 w-32 bg-muted rounded animate-pulse" />
            <div className="h-6 w-20 bg-muted rounded-full animate-pulse" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-card rounded-lg border border-border">
                <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                  <div className="h-3 w-48 bg-muted rounded animate-pulse" />
                </div>
                <div className="h-10 w-20 bg-muted rounded animate-pulse" />
                <div className="h-8 w-8 bg-muted rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons Skeleton */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
        <div className="h-10 w-40 bg-muted rounded-lg animate-pulse" />
        <div className="h-10 w-36 bg-muted rounded-lg animate-pulse" />
      </div>
    </div>
  )
}
