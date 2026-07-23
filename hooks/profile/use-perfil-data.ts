import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { profileApi, type Profile } from '@/lib/profile-api'
import type { paths } from '@/types/contracts/api-contracts-types'

const API_URL = process.env.API_URL || ''

type User = NonNullable<
  paths['/api/auth/me']['get']['responses']['200']['content']['application/json']['data']
>['user']

export interface PerfilData {
  profile: Profile
}

export async function getPerfilData(): Promise<PerfilData> {
  // const cookieStore = await cookies()
  // const cookieHeader = cookieStore.toString()

  // const userRes = await fetch(`${API_URL}/api/auth/me`, {
  //   headers: { Cookie: cookieHeader },
  //   cache: 'no-store',
  // })

  // const response = await userRes.json()

  // if (!userRes.ok) {
  //   const text = await userRes.text()
  //   console.error('[/api/auth/me] no ok:', userRes.status, text)
  //   redirect('/')
  // }

  // if (!response.success) {
  //   return redirect("/")
  // }

  // if (!response.data) {
  //   return redirect("/no-user")
  // }

  // console.error('userData:', JSON.stringify(response))
  // if (!user?.id) {
  //   console.error('user undefined, userData:', userData)
  //   redirect('/')
  // }

  // const profileRes = await profileApi.getByUserId(user.id)
  // const profile: Profile = profileRes.data

  return { profile: {} as Profile }
}
