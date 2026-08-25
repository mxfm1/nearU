'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUserSession } from '@/hooks/auth/user-session';

export function GuestGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isPending } = useUserSession();

  useEffect(() => {
    if (!isPending && isAuthenticated) {
      const query = searchParams.toString();
      router.replace(query ? `/descubrir?${query}` : '/descubrir');
    }
  }, [isAuthenticated, isPending, router, searchParams]);

  if (isPending || isAuthenticated) return null;
  return <>{children}</>;
}
