import { requireAuth } from '@/lib/auth-guard';

export default async function DescubrirLayout({ children }: { children: React.ReactNode }) {
  await requireAuth();

  return <>{children}</>;
}
