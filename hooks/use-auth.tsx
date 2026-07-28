'use client';

import { createContext, useContext, useCallback, type ReactNode } from 'react';
import { useUserSession } from '@/hooks/auth/user-session';
import { authApi, type User as AppUser } from '@/lib/api-client';

type BetterAuthUser = NonNullable<ReturnType<typeof useUserSession>['user']>;

function normalizeUser(user: BetterAuthUser): AppUser {
  return {
    id: user.id,
    email: user.email,
    emailVerified: user.emailVerified,
    name: user.name,
    image: user.image ?? null,
    createdAt: user.createdAt instanceof Date ? user.createdAt.toISOString() : user.createdAt,
    updatedAt: user.updatedAt instanceof Date ? user.updatedAt.toISOString() : user.updatedAt,
  };
}

export type AuthContextType = {
  user: AppUser | null;
  isPending: boolean;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user: betterAuthUser, isPending, isAuthenticated, refetch } = useUserSession();

  const login = useCallback(async (email: string, password: string) => {
    await authApi.signIn(email, password);
    await refetch();
  }, [refetch]);

  const register = useCallback(async (name: string, email: string, password: string) => {
    await authApi.signUp(name, email, password);
    await authApi.signIn(email, password);
    await refetch();
  }, [refetch]);

  const logout = useCallback(async () => {
    await authApi.signOut();
    await refetch();
  }, [refetch]);

  const normalizedUser = betterAuthUser ? normalizeUser(betterAuthUser) : null;

  return (
    <AuthContext.Provider value={{ user: normalizedUser, isPending, loading: isPending, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
