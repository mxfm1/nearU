import { motion } from 'framer-motion';

export function ExploreSectionSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
    >
      {Array.from({ length: 3 }, (_, index) => (
        <div key={index} className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="aspect-video animate-pulse bg-muted" />
          <div className="space-y-3 p-4">
            <div className="h-6 w-2/3 animate-pulse rounded bg-muted" />
            <div className="h-4 w-full animate-pulse rounded bg-muted" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
          </div>
        </div>
      ))}
    </motion.div>
  );
}
