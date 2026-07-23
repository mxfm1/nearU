import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const API_BASE = process.env.API_URL

export async function requireAuth(): Promise<void> {
  const cookieStore = await cookies()

  let res: Response

  try {
    res = await fetch(`${API_BASE}/api/auth/me`, {
      headers: {
        Cookie: cookieStore.toString(),
      },
      cache: 'no-store',
    })
  } catch (error) {
    console.error('Auth check failed:', error)
    redirect('/')
  }

  if (!res.ok) {
    redirect('/')
  }
}
