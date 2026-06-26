import { Suspense } from 'react'
import { SearchPageContent } from '@/components/search/search-page-content'
import { SearchSkeleton } from '@/components/search/search-skeleton'

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchSkeleton />}>
      <SearchPageContent />
    </Suspense>
  )
}
