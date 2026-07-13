'use client'

import { useEffect, useMemo, useCallback, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, Loader2, AlertTriangle, MapPin } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/use-auth'
import { useDirtyGuard } from '@/hooks/use-dirty-guard'
import { profileApi, type Profile, type UpdateProfileData } from '@/lib/profile-api'
import { catalogoApi, type Ubicacion } from '@/lib/catalogo-api'
import { ProfileBanner } from './_components/profile-banner'
import { ProfileLogo } from './_components/profile-logo'
import { GeneralInfo } from './_components/general-info'
import { ProfileDetails } from './_components/profile-details'
import { DigitalPresence } from './_components/digital-presence'

// Zod schema for profile validation - locationId is required
const profileUpdateSchema = z.object({
  locationId: z.string().min(1, 'La ubicación de la empresa es obligatoria'),
})

interface Draft extends Omit<Profile, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'location'> {
  locationId: string
  verified?: boolean
}

type DraftKey = keyof Draft

const ALL_FIELDS: DraftKey[] = [
  'bannerUrl', 'logoUrl', 'name', 'industry', 'description', 'tags',
  'locationId', 'founded', 'employees', 'website', 'whatsapp', 'socialLinks',
]

function computeDirtyFields(draft: Draft | null, snapshot: Draft | null): string[] {
  if (!draft || !snapshot) return []
  return ALL_FIELDS.filter((field) => {
    return JSON.stringify(draft[field]) !== JSON.stringify(snapshot[field])
  })
}

const normalizeTag = (t: unknown): string =>
  typeof t === 'string' ? t : (t as { name?: string })?.name ?? String(t)

const normalizeField = (v: unknown): string =>
  typeof v === 'string' ? v : (v as { name?: string })?.name ?? String(v)

const toId = (v: unknown): string => {
  if (typeof v === 'string') return v
  if (v && typeof v === 'object' && 'id' in v) return (v as { id: string }).id
  return ''
}

export default function ProfileEditPage() {
  const { user } = useAuth()
  const router = useRouter()
  const queryClient = useQueryClient()
  const { setDirty, clearDirty } = useDirtyGuard()

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: () => profileApi.getByUserId(user!.id),
    enabled: !!user,
  })

  const profile: Profile | null = data?.data ?? null

  const { data: ubicacionesData } = useQuery({
    queryKey: ['ubicaciones'],
    queryFn: () => catalogoApi.ubicaciones(),
  })

  const ubicaciones: Ubicacion[] = ubicacionesData?.data ?? []

  const [draft, setDraft] = useState<Draft | null>(null)
  const [initialDraft, setInitialDraft] = useState<Draft | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)

  // Initialize draft and snapshot when profile loads
  useEffect(() => {
    if (profile) {
      const initial: Draft = {
        bannerUrl: profile.bannerUrl,
        logoUrl: profile.logoUrl,
        name: profile.name,
        industry: normalizeField(profile.industry),
        description: profile.description,
        tags: (profile.tags ?? []).map(normalizeTag),
        locationId: toId(profile.location),
        founded: profile.founded,
        employees: profile.employees,
        website: profile.website,
        whatsapp: profile.whatsapp,
        socialLinks: profile.socialLinks,
      }
      setDraft(initial)
      setInitialDraft(structuredClone(initial))
    }
  }, [profile])

  // Compute dirty fields and notify the dirty guard
  const dirtyFields = useMemo(
    () => computeDirtyFields(draft, initialDraft),
    [draft, initialDraft],
  )

  useEffect(() => {
    setDirty(dirtyFields)
  }, [dirtyFields, setDirty])

  // beforeunload for browser refresh/close
  useEffect(() => {
    if (dirtyFields.length === 0) return
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault()
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [dirtyFields])

  const saveMutation = useMutation({
    mutationFn: (payload: UpdateProfileData) => profileApi.updateMine(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] })
      clearDirty()
    },
  })

  const handleChange = useCallback((field: string, value: unknown) => {
    setDraft((prev) => (prev ? { ...prev, [field]: value } : prev))
    // Clear location error when user selects a location
    if (field === 'locationId' && value) {
      setLocationError(null)
    }
  }, [])

  const handleBannerChange = useCallback((url: string | null) => {
    handleChange('bannerUrl', url)
  }, [handleChange])

  const handleLogoChange = useCallback((url: string | null) => {
    handleChange('logoUrl', url)
  }, [handleChange])

  const handleSave = async () => {
    if (!draft) return

    // Clear previous error
    setLocationError(null)

    // Validate with Zod
    const result = profileUpdateSchema.safeParse(draft)
    if (!result.success) {
      const errorMessage = result.error.errors[0]?.message || 'Validation failed'
      if (errorMessage.includes('ubicación')) {
        setLocationError(errorMessage)
      }
      return
    }

    saveMutation.mutate(draft)
  }

  // --- Loading state ---
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 mx-auto mb-4 animate-spin text-brand" />
          <p className="text-sm text-muted-foreground">Cargando perfil...</p>
        </div>
      </div>
    )
  }

  // --- Error state ---
  if (isError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="mb-4 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-7 w-7 text-destructive" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Error al cargar el perfil</h2>
          <p className="text-sm text-muted-foreground mb-6">
            {error instanceof Error ? error.message : 'No se pudo cargar la información del perfil.'}
          </p>
          <Button
            className="bg-brand text-brand-foreground hover:bg-brand/90"
            onClick={() => router.refresh()}
          >
            Intentar de nuevo
          </Button>
        </div>
      </div>
    )
  }

  // --- No user state ---
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h2 className="text-xl font-bold text-foreground mb-2">Iniciá sesión</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Necesitás iniciar sesión para editar tu perfil.
          </p>
          <Button asChild className="bg-brand text-brand-foreground hover:bg-brand/90">
            <Link href="/auth/login">Iniciar sesión</Link>
          </Button>
        </div>
      </div>
    )
  }

  // --- No profile state ---
  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h2 className="text-xl font-bold text-foreground mb-2">Perfil no encontrado</h2>
          <p className="text-sm text-muted-foreground mb-6">
            No se encontró un perfil asociado a esta cuenta.
          </p>
          <Button asChild className="bg-brand text-brand-foreground hover:bg-brand/90">
            <Link href="/">Volver al inicio</Link>
          </Button>
        </div>
      </div>
    )
  }

  const isSaving = saveMutation.isPending

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <h1 className="text-2xl font-bold text-foreground">Editar Perfil de Empresa</h1>
          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Input placeholder="Buscar..." className="pl-9" />
            </div>
          </div>
        </div>

        <Button asChild className="mb-6 bg-brand hover:bg-brand/90 text-white">
          <Link href="/user/perfil-preview">
            <Eye className="h-4 w-4 mr-2" />
            Ver Perfil
          </Link>
        </Button>

        {/* Banner */}
        <ProfileBanner bannerUrl={draft?.bannerUrl ?? null} onChange={handleBannerChange} />

        {/* Logo + Company Name */}
        <ProfileLogo
          logoUrl={draft?.logoUrl ?? null}
          companyName={draft?.name ?? ''}
          onChange={handleLogoChange}
        />

        {/* General Info + Details grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            {draft && (
              <GeneralInfo
                name={draft.name}
                industry={draft.industry}
                description={draft.description}
                tags={draft.tags}
                onChange={handleChange}
              />
            )}
          </div>

          <div>
            {draft && (
              <ProfileDetails
                locationId={draft.locationId}
                founded={draft.founded}
                employees={draft.employees}
                ubicaciones={ubicaciones}
                onChange={handleChange}
                locationError={locationError}
              />
            )}
          </div>
        </div>

        {/* Digital Presence */}
        {draft && (
          <DigitalPresence
            website={draft.website}
            whatsapp={draft.whatsapp}
            socialLinks={draft.socialLinks}
            onChange={handleChange}
          />
        )}

        {/* Action buttons */}
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm text-muted-foreground">
            {dirtyFields.length > 0 && (
              <span className="text-amber-600">
                {dirtyFields.length} campo{dirtyFields.length !== 1 ? 's' : ''} sin guardar
              </span>
            )}
            {saveMutation.isError && (
              <span className="text-destructive ml-4">
                Error al guardar: {saveMutation.error instanceof Error ? saveMutation.error.message : 'Error desconocido'}
              </span>
            )}
            {locationError && (
              <span className="text-destructive ml-4 flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {locationError}
              </span>
            )}
            {saveMutation.isSuccess && (
              <span className="text-emerald-600 ml-4">✓ Cambios guardados</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" asChild>
              <Link href="/user/perfil-preview">Cancelar</Link>
            </Button>
            <Button
              className="bg-brand hover:bg-brand/90 text-white"
              disabled={dirtyFields.length === 0 && !locationError || isSaving}
              onClick={handleSave}
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                'Guardar Cambios'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
