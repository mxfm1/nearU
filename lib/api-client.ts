const BASE_URL = ''; // Next.js rewrite lo resuelve

export type User = {
  id: string
  name: string
  email: string
  emailVerified: boolean
  image: string | null
  createdAt: string
  updatedAt: string
}

type Session = {
  id: string
  userId: string
  expiresAt: string
}

export type ApiResponse<T> = {
  success: boolean
  data?: T
  message?: string
}

export async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${BASE_URL}/api${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error(error.message ?? `HTTP ${res.status}`)
  }

  if (res.status === 204) return undefined as T
  return res.json()
}

export const authApi = {

  sendVerificationEmail: (email: string, callbackURL?: string) =>
    apiFetch<{ success: boolean }>('/auth/send-verification-email', {
      method: 'POST',
      body: JSON.stringify({ email, ...(callbackURL && { callbackURL }) }),
    }),

  signIn: (email: string, password: string) =>
    apiFetch<{ user: User; session: Session }>('/auth/sign-in/email', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  signUp: (name: string, email: string, password: string) =>
    apiFetch<{ user: User; session: Session }>('/auth/sign-up/email', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),

  signOut: () =>
    apiFetch<void>('/auth/sign-out', { method: 'POST' }),

  getMe: () =>
    apiFetch<{ success: boolean; data: User }>('/auth/me'),

  updateMe: (data: { name?: string; image?: string }) =>
    apiFetch<{ success: boolean; data: User }>('/users/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  changePassword: (currentPassword: string, newPassword: string) =>
    apiFetch<{ success: boolean }>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    }),

  changeEmail: (newEmail: string) =>
    apiFetch<{ success: boolean }>('/auth/change-email', {
      method: 'POST',
      body: JSON.stringify({ newEmail }),
    }),

  deleteUser: (userId: string) =>
    apiFetch<void>(`/users/${userId}`, { method: 'DELETE' }),

  forgotPassword: (email: string) =>
    apiFetch<{ success: boolean }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  resetPassword: (token: string, newPassword: string) =>
    apiFetch<{ success: boolean; status: boolean }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    }),

  getUser: (id: string) =>
    apiFetch<{ success: boolean; data: User }>(`/users/${id}`),

  verifyEmail: (token: string) =>
    apiFetch<{ success: boolean }>('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    }),
}
