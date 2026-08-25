import { Suspense } from 'react';
import { AuthGuard } from '@/components/auth/auth-guard';

export default function DescubrirLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <AuthGuard redirectTo="/explorar">{children}</AuthGuard>
    </Suspense>
  );
}
