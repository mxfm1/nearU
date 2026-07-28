import { AuthGuard } from '@/components/auth/auth-guard';

export default function DescubrirLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}
