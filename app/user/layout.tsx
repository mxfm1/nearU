import { Suspense } from 'react';
import { AuthGuard } from '@/components/auth/auth-guard';

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <AuthGuard>{children}</AuthGuard>
    </Suspense>
  );
}
