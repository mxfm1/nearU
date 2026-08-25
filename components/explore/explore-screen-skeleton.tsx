export function ExploreScreenSkeleton({
  filtersPlacement = 'sidebar',
}: {
  filtersPlacement?: 'sidebar' | 'top';
}) {
  if (filtersPlacement === 'top') {
    return (
      <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="space-y-4">
          <div className="h-14 w-full max-w-4xl animate-pulse rounded-full bg-muted" />
          <div className="h-64 animate-pulse rounded-xl bg-muted sm:h-56" />
        </div>
        <div className="h-9 w-2/3 animate-pulse rounded bg-muted" />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="h-72 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="h-[520px] animate-pulse rounded-xl bg-muted lg:col-span-1" />
        <div className="space-y-8 lg:col-span-4">
          <div className="h-14 w-full max-w-3xl animate-pulse rounded-full bg-muted" />
          <div className="h-9 w-2/3 animate-pulse rounded bg-muted" />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => (
              <div key={index} className="h-72 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
