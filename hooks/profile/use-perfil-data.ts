import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { catalogoApi, type Region } from '@/lib/catalogo-api'
import { profileApi, type Profile } from '@/lib/profile-api'
import type { paths } from '@/types/contracts/api-contracts-types'

const API_URL = process.env.API_URL || ''

type User = NonNullable<
  paths['/api/auth/me']['get']['responses']['200']['content']['application/json']['data']
>['user']

export interface PerfilData {
  profile: Profile
  regiones: Region[]
}

export async function getPerfilData(): Promise<PerfilData> {
  const cookieStore = await cookies()
  const cookieHeader = cookieStore.toString()

  const [userRes, regionesRes] = await Promise.all([
    fetch(`${API_URL}/api/auth/me`, {
      headers: { Cookie: cookieHeader },
      cache: 'no-store',
    }),
    catalogoApi.regiones(),
  ])

  if (!userRes.ok) {
    redirect('/')
  }

  const userData = await userRes.json()
  const user: User = userData.data?.user

  if (!user?.id) {
    redirect('/')
  }

  const profileRes = await profileApi.getByUserId(user.id)
  const profile: Profile = profileRes.data

  const regiones: Region[] = regionesRes.data ?? []

  return { profile, regiones }
}
