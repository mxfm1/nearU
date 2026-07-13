import { Suspense } from 'react'
import { ApplyContent } from './_components/apply-content'
import { ApplySkeleton } from './_components/apply-skeleton'

interface ApplyPageProps {
  params: Promise<{ id: string }>
}

export default async function ApplyPage({ params }: ApplyPageProps) {
  const { id } = await params

  return (
    <Suspense fallback={<ApplySkeleton />}>
      <ApplyContent eventId={id} />
    </Suspense>
  )
}
