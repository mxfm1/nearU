'use client'

import { useEffect, useMemo, useCallback, useState } from 'react'
import Link from 'next/link'
import { Eye, Loader2 } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useDirtyGuard } from '@/hooks/use-dirty-guard'
import { profileApi } from '@/lib/profile-api'
import { ProfileContent } from './_components/profile-content'
import { usePerfilData } from './_components/perfil-data-provider'

const profileUpdateSchema = z.object({
  regionId: z.string().min(1, 'La región de la empresa es obligatoria'),
})

interface Draft {
  bannerUrl: string | null
  logoUrl: string | null
  name: string | null
  description: string | null
  tags: string[]
  location: string
  founded: string
  employees: string
  website: string | null
  whatsapp: string | null
  socialLinks: { id?: string; platform?: string; url?: string; orden?: number }[]
}

const ALL_FIELDS = [
  'bannerUrl', 'logoUrl', 'name', 'description', 'tags',
  'location', 'founded', 'employees', 'website', 'whatsapp', 'socialLinks',
]

function computeDirtyFields(draft: Draft | null, snapshot: Draft | null): string[] {
  if (!draft || !snapshot) return []
  return ALL_FIELDS.filter((field) => {
    return JSON.stringify(draft[field as keyof Draft]) !== JSON.stringify(snapshot[field as keyof Draft])
  })
}

export default function ProfileEditPage() {
  const { profile, regiones } = usePerfilData()
  const queryClient = useQueryClient()
  const { setDirty, clearDirty } = useDirtyGuard()

  const [draft, setDraft] = useState<Draft | null>(null)
  const [initialDraft, setInitialDraft] = useState<Draft | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)

  useEffect(() => {
    if (profile) {
      const initial: Draft = {
        bannerUrl: profile.bannerUrl ?? null,
        logoUrl: profile.logoUrl ?? null,
        name: profile.name ?? null,
        description: profile.description ?? null,
        tags: profile.tags ?? [],
        location: (profile as { location?: string }).location ?? '',
        founded: profile.founded ?? '',
        employees: profile.employees ?? '',
        website: profile.website ?? null,
        whatsapp: profile.whatsapp ?? null,
        socialLinks: profile.socialLinks ?? [],
      }
      setDraft(initial)
      setInitialDraft(structuredClone(initial))
    }
  }, [profile])

  const dirtyFields = useMemo(
    () => computeDirtyFields(draft, initialDraft),
    [draft, initialDraft],
  )

  useEffect(() => {
    setDirty(dirtyFields)
  }, [dirtyFields, setDirty])

  useEffect(() => {
    if (dirtyFields.length === 0) return
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault()
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [dirtyFields])

  const saveMutation = useMutation({
    mutationFn: (payload: Draft) => profileApi.updateMine(payload as never),
    onSuccess: (res) => {
      if (res.data) {
        setDraft({
          bannerUrl: res.data.bannerUrl ?? null,
          logoUrl: res.data.logoUrl ?? null,
          name: res.data.name ?? null,
          description: res.data.description ?? null,
          tags: res.data.tags ?? [],
          location: (res.data as { location?: string }).location ?? '',
          founded: res.data.founded ?? '',
          employees: res.data.employees ?? '',
          website: res.data.website ?? null,
          whatsapp: res.data.whatsapp ?? null,
          socialLinks: res.data.socialLinks ?? [],
        })
        setInitialDraft({
          bannerUrl: res.data.bannerUrl ?? null,
          logoUrl: res.data.logoUrl ?? null,
          name: res.data.name ?? null,
          description: res.data.description ?? null,
          tags: res.data.tags ?? [],
          location: (res.data as { location?: string }).location ?? '',
          founded: res.data.founded ?? '',
          employees: res.data.employees ?? '',
          website: res.data.website ?? null,
          whatsapp: res.data.whatsapp ?? null,
          socialLinks: res.data.socialLinks ?? [],
        })
      }
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      clearDirty()
    },
  })

  const handleChange = useCallback((field: string, value: unknown) => {
    setDraft((prev) => (prev ? { ...prev, [field]: value } : prev))
    if (field === 'location' && value) {
      setLocationError(null)
    }
  }, [])

  const handleSave = async () => {
    if (!draft) return

    setLocationError(null)

    const result = profileUpdateSchema.safeParse({ regionId: draft.location })
    if (!result.success) {
      const errorMessage = result.error.errors[0]?.message || 'Validation failed'
      if (errorMessage.includes('región')) {
        setLocationError(errorMessage)
      }
      return
    }

    saveMutation.mutate(draft)
  }

  const isSaving = saveMutation.isPending

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between gap-4 mb-8">
          <h1 className="text-2xl font-bold text-foreground">Editar Perfil de Empresa</h1>
          <div className="relative w-64">
            <Input placeholder="Buscar..." className="pl-9" />
          </div>
        </div>

        <Button asChild className="mb-6 bg-brand hover:bg-brand/90 text-white">
          <Link href="/user/perfil-preview">
            <Eye className="h-4 w-4 mr-2" />
            Ver Perfil
          </Link>
        </Button>

        <ProfileContent
          profile={profile}
          regiones={regiones}
          onChange={handleChange}
          locationError={locationError}
        />

        <div className="flex items-center justify-between gap-3 mt-8 pt-6 border-t">
          <div className="text-sm text-muted-foreground">
            {dirtyFields.length > 0 && (
              <span className="text-amber-600">
                {dirtyFields.length} campo{dirtyFields.length !== 1 ? 's' : ''} sin guardar
              </span>
            )}
            {saveMutation.isError && (
              <span className="text-destructive ml-4">
                Error al guardar
              </span>
            )}
            {locationError && (
              <span className="text-destructive ml-4 flex items-center gap-1">
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
