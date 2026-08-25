import { SearchX } from 'lucide-react';

export function ExploreSectionEmpty({ message }: { message: string }) {
  return (
    <div className="flex min-h-44 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-muted/30 p-6 text-center">
      <SearchX className="h-6 w-6 text-muted-foreground" />
      <p className="max-w-md text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
