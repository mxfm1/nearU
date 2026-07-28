import { authClient } from "@/lib/better-auth-client";

export function useUserSession() {
    const session = authClient.useSession()
    return {
        user: session.data?.user,
        session: session.data?.session,
        isPending: session.isPending,
        error: session.error,
        isAuthenticated: !!session.data?.user,
        refetch: session.refetch,
    }
}