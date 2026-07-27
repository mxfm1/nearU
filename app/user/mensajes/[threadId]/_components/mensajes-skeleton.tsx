export function MensajesSkeleton() {
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-5xl mx-auto">
      {/* Header Skeleton */}
      <div className="px-4 md:px-6 py-4 bg-card border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-muted animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 w-32 bg-muted rounded animate-pulse" />
            <div className="h-3 w-24 bg-muted rounded animate-pulse" />
          </div>
        </div>
        <div className="h-9 w-24 bg-muted rounded-full animate-pulse" />
      </div>

      {/* Messages Skeleton */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-muted/20 flex flex-col gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className={`flex gap-3 max-w-[85%] ${i % 2 === 1 ? 'self-end' : ''}`}>
            {i % 2 === 0 && (
              <div className="w-8 h-8 rounded-full bg-muted animate-pulse shrink-0" />
            )}
            <div className="flex flex-col gap-1">
              <div
                className={`p-3 md:p-4 rounded-2xl ${
                  i % 2 === 1 ? 'bg-primary/20 rounded-br-none' : 'bg-card rounded-bl-none'
                }`}
              >
                <div className="h-4 w-48 md:w-64 bg-muted rounded animate-pulse" />
              </div>
              <div className="h-2 w-12 bg-muted rounded animate-pulse ml-1" />
            </div>
          </div>
        ))}
      </div>

      {/* Input Skeleton */}
      <div className="p-3 md:p-4 bg-card border-t border-border">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
          <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
          <div className="flex-1 h-10 bg-muted rounded-full animate-pulse" />
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-muted animate-pulse" />
        </div>
      </div>
    </div>
  );
}
