import { getPerfilData } from '@/hooks/profile/use-perfil-data'
import { PerfilDataProvider } from './_components/perfil-data-provider'

export default async function PerfilLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { profile, regiones } = await getPerfilData()

  return (
    <PerfilDataProvider profile={profile} regiones={regiones}>
      {children}
    </PerfilDataProvider>
  )
}
