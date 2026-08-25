import { Suspense } from 'react';
import { GuestGuard } from '@/components/auth/guest-guard';

export default function ExplorarLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <GuestGuard>{children}</GuestGuard>
    </Suspense>
  );
}
