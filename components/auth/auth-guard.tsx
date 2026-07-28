'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserSession } from '@/hooks/auth/user-session';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const router = useRouter();
  const { isAuthenticated, isPending, user, session } = useUserSession();

  console.log("user", user, session)

  useEffect(() => {
    if (!isPending && !isAuthenticated) {
      router.push('/');
    }
  }, [isPending, isAuthenticated, router]);

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
