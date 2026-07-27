export function SearchSkeleton() {
  return (
    <div className="bg-background min-h-screen">
      <div className="px-4 pt-28 pb-12 md:pt-36 md:pb-16">
        <div className="max-w-[1200px] mx-auto space-y-8">
          <div className="h-12 bg-muted rounded-md animate-pulse max-w-2xl" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-card rounded-lg overflow-hidden">
                <div className="aspect-[4/3] bg-muted animate-pulse" />
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-muted rounded animate-pulse w-3/4" />
                  <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
                  <div className="h-4 bg-muted rounded animate-pulse w-1/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
