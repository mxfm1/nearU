export function EventApplicationsSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Skeleton */}
      <header className="sticky top-0 z-50 bg-card border-b shadow-sm">
        <nav className="flex justify-between items-center px-4 md:px-8 w-full h-16 max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-16 h-6 bg-muted rounded animate-pulse" />
          </div>
          <div className="w-32 h-8 bg-muted rounded animate-pulse" />
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-8">
        {/* Breadcrumb */}
        <div className="mb-4">
          <div className="w-40 h-5 bg-muted rounded animate-pulse" />
        </div>

        {/* Event Card Skeleton */}
        <section className="bg-card rounded-xl shadow-sm overflow-hidden mb-8 border border-border">
          <div className="flex flex-col md:flex-row items-center p-6 gap-6">
            <div className="w-full md:w-32 h-24 rounded-lg bg-muted animate-pulse shrink-0" />
            <div className="flex-grow space-y-3">
              <div className="h-7 w-64 bg-muted rounded animate-pulse" />
              <div className="h-5 w-48 bg-muted rounded animate-pulse" />
            </div>
            <div className="w-28 h-9 bg-muted rounded animate-pulse" />
          </div>
        </section>

        {/* Filters */}
        <div className="flex justify-between items-end mb-6 gap-4">
          <div className="space-y-2">
            <div className="h-7 w-56 bg-muted rounded animate-pulse" />
            <div className="h-5 w-80 bg-muted rounded animate-pulse" />
          </div>
          <div className="flex items-center gap-4 bg-muted p-2 rounded-xl">
            <div className="w-32 h-6 bg-muted rounded animate-pulse" />
            <div className="w-20 h-6 bg-muted rounded animate-pulse" />
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-card rounded-xl border border-border p-5 flex items-center gap-6"
            >
              <div className="w-20 h-20 rounded-xl bg-muted animate-pulse shrink-0" />
              <div className="flex-grow space-y-2">
                <div className="h-5 w-48 bg-muted rounded animate-pulse" />
                <div className="h-4 w-32 bg-muted rounded animate-pulse" />
              </div>
              <div className="flex items-center gap-6">
                <div className="w-16 h-8 bg-muted rounded animate-pulse" />
                <div className="w-24 h-8 bg-muted rounded animate-pulse" />
                <div className="w-24 h-9 bg-muted rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
