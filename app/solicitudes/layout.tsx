import { Suspense } from 'react';
import { AuthGuard } from '@/components/auth/auth-guard';

export default function SolicitudesLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <AuthGuard>{children}</AuthGuard>
    </Suspense>
  );
}
