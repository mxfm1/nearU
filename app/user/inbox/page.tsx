import { Suspense } from 'react'
import { InboxContent } from './_components/inbox-content'
import { InboxSkeleton } from './_components/inbox-skeleton'

export default function InboxPage() {
  return (
    <Suspense fallback={<InboxSkeleton />}>
      <InboxContent />
    </Suspense>
  )
}
