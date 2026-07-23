import type { Region } from '@/lib/catalogo-api'
import type { Profile } from '@/lib/profile-api'

export interface PerfilData {
  profile: Profile
  regiones: Region[]
}
