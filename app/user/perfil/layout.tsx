import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { profileApi, type Profile } from '@/lib/profile-api';

const API_URL = process.env.API_URL || '';

export default async function PerfilLayout({ children }: { children: React.ReactNode }) {
  // const cookieStore = await cookies()
  // const cookieHeader = cookieStore.toString()

  // const userRes = await fetch(`${API_URL}/api/auth/me`, {
  //   headers: { Cookie: cookieHeader },
  //   cache: 'no-store',
  // })

  // if (!userRes.ok) {
  //   redirect('/')
  // }

  // const userData = await userRes.json()
  // const userId: string = userData.data?.id

  // if (!userId) {
  //   redirect('/')
  // }

  // const profileRes = await profileApi.getByUserId(userId)
  // const profile: Profile = profileRes.data

  return <>{children}</>;
}
