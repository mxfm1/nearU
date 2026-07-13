export function EventLoadingSkeleton() {
  return (
    <div className="animate-pulse w-full min-h-screen" role="status" aria-label="Loading">
      <section className="px-4 pt-24 pb-20 md:pt-32 md:pb-28">
        <div className="max-w-4xl mx-auto">
          <div className="aspect-video w-full bg-muted rounded-lg mb-8" />
          <div className="h-8 w-3/4 bg-muted rounded mb-4" />
          <div className="h-4 w-1/3 bg-muted rounded mb-2" />
          <div className="h-4 w-1/4 bg-muted rounded mb-8" />
          <div className="space-y-2">
            <div className="h-4 w-full bg-muted rounded" />
            <div className="h-4 w-5/6 bg-muted rounded" />
            <div className="h-4 w-4/6 bg-muted rounded" />
          </div>
        </div>
      </section>
    </div>
  )
}
