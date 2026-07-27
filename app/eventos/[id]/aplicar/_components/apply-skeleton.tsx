export function ApplySkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Stepper skeleton */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
              <div className="h-4 w-16 bg-muted rounded animate-pulse hidden sm:block" />
              {i < 3 && <div className="h-px w-12 bg-muted" />}
            </div>
          ))}
        </div>

        {/* Title skeleton */}
        <div className="text-center mb-6">
          <div className="h-8 w-64 bg-muted rounded animate-pulse mx-auto mb-2" />
          <div className="h-4 w-96 bg-muted rounded animate-pulse mx-auto" />
        </div>

        {/* Form skeleton */}
        <div className="space-y-6">
          {/* Row 1: Two fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="h-4 w-32 bg-muted rounded animate-pulse" />
              <div className="h-10 w-full bg-muted rounded animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-24 bg-muted rounded animate-pulse" />
              <div className="h-10 w-full bg-muted rounded animate-pulse" />
            </div>
          </div>

          {/* Row 2: Full width */}
          <div className="space-y-2">
            <div className="h-4 w-20 bg-muted rounded animate-pulse" />
            <div className="h-10 w-full bg-muted rounded animate-pulse" />
          </div>

          {/* Row 3: Textarea */}
          <div className="space-y-2">
            <div className="h-4 w-48 bg-muted rounded animate-pulse" />
            <div className="h-24 w-full bg-muted rounded animate-pulse" />
          </div>

          {/* Row 4: File upload */}
          <div className="space-y-2">
            <div className="h-4 w-32 bg-muted rounded animate-pulse" />
            <div className="h-32 w-full bg-muted rounded animate-pulse" />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <div className="h-10 flex-1 bg-muted rounded animate-pulse" />
            <div className="h-10 w-24 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
