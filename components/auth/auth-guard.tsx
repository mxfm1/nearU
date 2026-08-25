'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUserSession } from '@/hooks/auth/user-session';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export function AuthGuard({ children, fallback, redirectTo = '/' }: AuthGuardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isPending } = useUserSession();

  useEffect(() => {
    if (!isPending && !isAuthenticated) {
      const query = searchParams.toString();
      router.replace(query ? `${redirectTo}?${query}` : redirectTo);
    }
  }, [isPending, isAuthenticated, redirectTo, router, searchParams]);

  if (isPending) {
    return fallback ?? <AuthGuardSkeleton />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

function AuthGuardSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="h-10 w-10 rounded-full bg-muted animate-spin" />
        <p className="text-muted-foreground text-sm">Verificando sesión...</p>
      </div>
    </div>
  );
}
