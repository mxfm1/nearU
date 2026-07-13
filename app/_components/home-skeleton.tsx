export function HomeSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section Skeleton */}
      <section className="bg-gradient-hero pt-20 pb-12 sm:pt-24 sm:pb-16 md:pt-32 md:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left content */}
            <div className="space-y-5 sm:space-y-6">
              <div className="space-y-2">
                <div className="h-8 sm:h-10 md:h-12 w-3/4 bg-muted rounded-lg animate-pulse" />
                <div className="h-8 sm:h-10 md:h-12 w-1/2 bg-muted rounded-lg animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="h-4 sm:h-5 w-full bg-muted rounded animate-pulse" />
                <div className="h-4 sm:h-5 w-4/5 bg-muted rounded animate-pulse" />
              </div>
              
              {/* Search bar skeleton */}
              <div className="h-12 sm:h-14 w-full bg-card rounded-full border border-border shadow-search animate-pulse" />
              
              {/* Category pills skeleton */}
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-8 sm:h-10 w-20 sm:w-24 bg-card rounded-full border border-border animate-pulse" />
                ))}
              </div>
            </div>
            
            {/* Right image skeleton */}
            <div className="relative order-first lg:order-last">
              <div className="aspect-[4/5] sm:aspect-[3/2] bg-muted rounded-xl animate-pulse" />
              <div className="absolute top-4 sm:top-8 -left-2 sm:-left-4 bg-card rounded-xl p-3 sm:p-4 shadow-float animate-pulse">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex -space-x-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-muted border-2 border-card" />
                    ))}
                  </div>
                  <div>
                    <div className="h-3 sm:h-4 w-10 sm:w-12 bg-muted rounded animate-pulse" />
                    <div className="h-2.5 sm:h-3 w-16 sm:w-24 bg-muted rounded animate-pulse mt-1" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section Skeleton */}
      <section className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-card rounded-xl border border-border p-4 sm:p-6 shadow-sm">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-50 rounded-full animate-pulse shrink-0" />
                  <div>
                    <div className="h-6 sm:h-8 w-16 sm:w-20 bg-muted rounded animate-pulse" />
                    <div className="h-3 sm:h-4 w-24 sm:w-32 bg-muted rounded animate-pulse mt-1.5 sm:mt-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Grid Skeleton */}
      <section className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-2 sm:gap-4 mb-6 sm:mb-8">
            <div>
              <div className="h-6 sm:h-8 w-48 sm:w-64 bg-muted rounded-lg animate-pulse mb-1 sm:mb-2" />
              <div className="h-3 sm:h-4 w-64 sm:w-96 bg-muted rounded animate-pulse" />
            </div>
            <div className="h-3 sm:h-4 w-20 sm:w-24 bg-muted rounded animate-pulse" />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="aspect-[4/3] sm:aspect-[3/2] bg-muted rounded-xl animate-pulse" />
            ))}
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-square bg-muted rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Skeleton */}
      <section className="py-12 sm:py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <div className="h-6 sm:h-8 w-48 sm:w-64 bg-muted rounded-lg animate-pulse mx-auto mb-3 sm:mb-4" />
            <div className="h-3 sm:h-4 w-64 sm:w-96 bg-muted rounded animate-pulse mx-auto" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-brand-50 rounded-full animate-pulse mx-auto mb-3 sm:mb-4" />
                <div className="h-5 sm:h-6 w-24 sm:w-32 bg-muted rounded animate-pulse mx-auto mb-2" />
                <div className="h-3 sm:h-4 w-48 sm:w-64 bg-muted rounded animate-pulse mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section Skeleton */}
      <section className="py-8 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-brand rounded-2xl p-6 sm:p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full animate-pulse shrink-0" />
                <div>
                  <div className="h-5 sm:h-6 w-48 sm:w-64 bg-white/20 rounded animate-pulse mb-1.5 sm:mb-2" />
                  <div className="h-3 sm:h-4 w-64 sm:w-96 bg-white/20 rounded animate-pulse" />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full md:w-auto">
                <div className="h-10 sm:h-12 w-full sm:w-48 bg-white rounded-lg animate-pulse" />
                <div className="h-10 sm:h-12 w-full sm:w-48 bg-white/20 rounded-lg animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Skeleton */}
      <footer className="bg-[#0F2318] py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            <div className="space-y-4 sm:col-span-2 md:col-span-3 lg:col-span-1">
              <div className="h-6 sm:h-8 w-24 sm:w-32 bg-white/20 rounded animate-pulse" />
              <div className="h-3 sm:h-4 w-48 sm:w-64 bg-white/20 rounded animate-pulse" />
              <div className="flex gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="w-7 h-7 sm:w-8 sm:h-8 bg-white/20 rounded-full animate-pulse" />
                ))}
              </div>
            </div>
            <div className="hidden sm:block sm:col-span-2 md:col-span-3 lg:col-span-1">
              <div className="h-4 w-24 bg-white/20 rounded animate-pulse mb-4" />
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="h-3 w-32 bg-white/20 rounded animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
