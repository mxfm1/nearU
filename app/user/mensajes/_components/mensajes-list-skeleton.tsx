export function MensajesListSkeleton() {
  return (
    <div className="flex flex-col h-full">
      {/* Header Skeleton */}
      <div className="px-4 md:px-6 pt-6 pb-4">
        <div className="flex justify-between items-end mb-4">
          <div>
            <div className="h-8 w-32 bg-muted rounded animate-pulse mb-2" />
            <div className="h-4 w-48 bg-muted rounded animate-pulse" />
          </div>
          <div className="flex gap-2">
            <div className="w-9 h-9 bg-muted rounded-lg animate-pulse" />
            <div className="w-9 h-9 bg-muted rounded-lg animate-pulse" />
          </div>
        </div>

        {/* Tabs Skeleton */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex bg-muted/50 p-1 rounded-xl w-full md:w-auto">
            <div className="flex-1 md:flex-none px-6 py-2 rounded-lg">
              <div className="h-5 w-12 bg-muted rounded animate-pulse mx-auto" />
            </div>
            <div className="flex-1 md:flex-none px-6 py-2 rounded-lg">
              <div className="h-5 w-16 bg-muted rounded animate-pulse mx-auto" />
            </div>
            <div className="flex-1 md:flex-none px-6 py-2 rounded-lg">
              <div className="h-5 w-14 bg-muted rounded animate-pulse mx-auto" />
            </div>
          </div>
          <div className="w-full md:w-80 h-10 bg-muted rounded-lg animate-pulse" />
        </div>
      </div>

      {/* List Skeleton */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 pb-6 space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div 
            key={i} 
            className="flex items-center gap-4 p-4 md:p-5 bg-card rounded-xl"
          >
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-muted animate-pulse shrink-0" />
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex justify-between">
                <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                <div className="h-3 w-16 bg-muted rounded animate-pulse" />
              </div>
              <div className="h-3 w-48 bg-muted rounded animate-pulse" />
              <div className="flex gap-2 mt-2">
                <div className="h-5 w-28 bg-muted rounded-full animate-pulse" />
              </div>
            </div>
            <div className="flex flex-col items-end gap-3">
              <div className="w-5 h-5 bg-muted rounded animate-pulse" />
              {i < 2 && <div className="w-2 h-2 bg-muted rounded-full animate-pulse" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
