import { Suspense } from 'react';
import { SearchPageContent } from './_components/search-page-content';
import { SearchSkeleton } from './_components/search-skeleton';

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchSkeleton />}>
      <SearchPageContent />
    </Suspense>
  );
}
