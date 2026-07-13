import { Suspense } from 'react'
import { HomeSkeleton } from './_components/home-skeleton'
import { HomeContent } from './_components/home-content'

export default function HomePage() {
  return (
    <Suspense fallback={<HomeSkeleton />}>
      <HomeContent />
    </Suspense>
  )
}
