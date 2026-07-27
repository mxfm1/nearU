'use client';

import { useSearch } from '@/hooks/use-search';
import { HorizontalSearchBar } from './horizontal-search-bar';
import { SearchSkeleton } from './search-skeleton';
import { SearchResults } from './search-results';
import { PaginationBar } from './pagination-bar';
import { SearchEmptyState } from './search-empty-state';
import { SearchErrorState } from './search-error-state';

export function SearchPageContent() {
  const {
    q,
    isLoading,
    isError,
    results,
    totalPages,
    currentPage,
    paginatedResults,
    hasFilters,
    goToPage,
  } = useSearch();

  if (isLoading) return <SearchSkeleton />;

  return (
    <div className="bg-background min-h-screen">
      <section className="px-4 pb-12 pt-8 md:pt-10 md:pb-16">
        <div className="max-w-[1200px] mx-auto">
          <h1 className="text-[40px] font-semibold leading-[1.2] text-foreground mb-4">
            {q ? `Resultados para "${q}"` : 'Encuentra a tu compañero de negocios'}
          </h1>

          <HorizontalSearchBar />

          <div className="mt-8">
            {isError ? (
              <SearchErrorState />
            ) : results.length > 0 ? (
              <>
                <SearchResults
                  results={paginatedResults}
                  totalCount={results.length}
                  hasFilters={hasFilters}
                />
                <PaginationBar
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={goToPage}
                />
              </>
            ) : (
              <SearchEmptyState hasFilters={hasFilters} />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
