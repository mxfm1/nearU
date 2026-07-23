export function ApplicationDetailSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card border-b shadow-sm">
        <nav className="flex justify-between items-center px-4 md:px-8 w-full h-16 max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-16 h-6 bg-muted rounded animate-pulse" />
          </div>
          <div className="w-44 h-8 bg-muted rounded animate-pulse" />
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-8">
        <div className="mb-6">
          <div className="w-56 h-5 bg-muted rounded animate-pulse" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Applicant Card */}
            <section className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="p-6 border-b border-border">
                <div className="h-7 w-48 bg-muted rounded animate-pulse" />
              </div>
              <div className="p-6">
                <div className="flex items-start gap-6">
                  <div className="w-24 h-24 rounded-xl bg-muted animate-pulse shrink-0" />
                  <div className="flex-grow space-y-3">
                    <div className="h-8 w-64 bg-muted rounded animate-pulse" />
                    <div className="h-6 w-48 bg-muted rounded animate-pulse" />
                  </div>
                </div>
              </div>
            </section>

            {/* Cover Letter */}
            <section className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="p-6 border-b border-border">
                <div className="h-7 w-48 bg-muted rounded animate-pulse" />
              </div>
              <div className="p-6 space-y-2">
                <div className="h-4 w-full bg-muted rounded animate-pulse" />
                <div className="h-4 w-full bg-muted rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="p-6 border-b border-border">
                <div className="h-7 w-48 bg-muted rounded animate-pulse" />
              </div>
              <div className="p-6 space-y-4">
                <div className="h-12 w-full bg-muted rounded animate-pulse" />
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-9 bg-muted rounded animate-pulse" />
                  <div className="h-9 bg-muted rounded animate-pulse" />
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
