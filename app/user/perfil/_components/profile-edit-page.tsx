'use client';

import { useEffect, useMemo, useCallback, useState, useRef } from 'react';
import Link from 'next/link';
import { Eye, Loader2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { useDirtyGuard } from '@/hooks/use-dirty-guard';
import { useRequests } from '@/hooks/requests/request-queries';
import { profileApi } from '@/lib/profile-api';
import {
  getLatestProfileVerificationRequest,
  getProfileVerificationState,
} from '@/lib/requests-utils';
import type { Profile } from '@/lib/profile-api';
import type { Region } from '@/lib/catalogo-api';
import { ProfileContent } from './profile-content';
import { ProfileValidationRequestDialog } from './profile-validation-request-dialog';
import { ProfileVerificationStateScreen } from './profile-verification-state-screen';

const profileUpdateSchema = z.object({
  regionId: z.string().min(1, 'La región de la empresa es obligatoria'),
});

interface Draft {
  bannerUrl: string | null;
  logoUrl: string | null;
  name: string | null;
  description: string | null;
  tags: string[];
  regionId: string;
  founded: string;
  employees: string;
  website: string | null;
  whatsapp: string | null;
  socialLinks: { id?: string; platform?: string; url?: string; orden?: number }[];
}

const ALL_FIELDS = [
  'bannerUrl',
  'logoUrl',
  'name',
  'description',
  'tags',
  'regionId',
  'founded',
  'employees',
  'website',
  'whatsapp',
  'socialLinks',
];

function computeDirtyFields(draft: Draft | null, snapshot: Draft | null): string[] {
  if (!draft || !snapshot) return [];
  return ALL_FIELDS.filter((field) => {
    return (
      JSON.stringify(draft[field as keyof Draft]) !== JSON.stringify(snapshot[field as keyof Draft])
    );
  });
}

function draftFromProfile(profile: Profile): Draft {
  return {
    bannerUrl: profile.bannerUrl ?? null,
    logoUrl: profile.logoUrl ?? null,
    name: profile.name ?? null,
    description: profile.description ?? null,
    tags: profile.tags ?? [],
    regionId: (profile as { region?: { id?: string } }).region?.id ?? '',
    founded: profile.founded ?? '',
    employees:
      profile.employees === null || profile.employees === undefined
        ? ''
        : String(profile.employees),
    website: profile.website ?? null,
    whatsapp: profile.whatsapp ?? null,
    socialLinks: profile.socialLinks ?? [],
  };
}

function draftToPayload(draft: Draft) {
  const { regionId, ...rest } = draft;
  return {
    ...rest,
    regionId: regionId,
    employees: rest.employees ? Number(rest.employees) : null,
    name: rest.name ?? undefined,
    description: rest.description ?? undefined,
    bannerUrl: rest.bannerUrl ?? undefined,
    logoUrl: rest.logoUrl ?? undefined,
    website: rest.website ?? undefined,
    whatsapp: rest.whatsapp ?? undefined,
  };
}

interface ProfileEditPageProps {
  profile: Profile;
  regiones: Region[];
}

export function ProfileEditPage({ profile, regiones }: ProfileEditPageProps) {
  const queryClient = useQueryClient();
  const { setDirty, clearDirty } = useDirtyGuard();
  const requestsQuery = useRequests();

  const [draft, setDraft] = useState<Draft>(() => draftFromProfile(profile));
  const [initialDraft, setInitialDraft] = useState<Draft>(() =>
    structuredClone(draftFromProfile(profile))
  );
  const draftRef = useRef(draft);
  draftRef.current = draft;
  const [locationError, setLocationError] = useState<string | null>(null);
  const [validationDialogOpen, setValidationDialogOpen] = useState(false);

  const dirtyFields = useMemo(() => computeDirtyFields(draft, initialDraft), [draft, initialDraft]);

  useEffect(() => {
    setDirty(dirtyFields);
  }, [dirtyFields, setDirty]);

  useEffect(() => {
    if (dirtyFields.length === 0) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirtyFields]);

  const saveMutation = useMutation({
    mutationFn: (payload: Draft) => profileApi.updateMine(draftToPayload(payload)),
    onSuccess: () => {
      const savedDraft = draftRef.current;
      setDraft(savedDraft);
      setInitialDraft(structuredClone(savedDraft));
      queryClient.invalidateQueries({ queryKey: ['profile-edit'] });
      clearDirty();
    },
    onError: (err) => {
      console.error('[SAVE ERROR]', err);
    },
  });

  const handleChange = useCallback((field: string, value: unknown) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
    if (field === 'regionId' && value) {
      setLocationError(null);
    }
  }, []);

  const handleSave = useCallback(() => {
    setLocationError(null);

    const currentDraft = draftRef.current;
    const result = profileUpdateSchema.safeParse({ regionId: currentDraft.regionId });
    if (!result.success) {
      const errorMessage = result.error.errors[0]?.message || 'Validation failed';
      if (errorMessage.includes('región')) {
        setLocationError(errorMessage);
      }
      return;
    }

    saveMutation.mutate(currentDraft);
  }, [saveMutation]);

  const isSaving = saveMutation.isPending;
  const requests = requestsQuery.data?.data ?? [];
  const latestProfileVerificationRequest = getLatestProfileVerificationRequest(requests);
  const verificationState = getProfileVerificationState(requests, profile.isVerified);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between gap-4 mb-8">
          <h1 className="text-2xl font-bold text-foreground">Editar Perfil de Empresa</h1>
          {/* <div className="relative w-64">
            <Input placeholder="Buscar..." className="pl-9" />
          </div> */}
          <Button asChild className="bg-brand hover:bg-brand/90 text-white">
            <Link href="/user/perfil-preview">
              <Eye className="h-4 w-4 mr-2" />
              Ver Perfil
            </Link>
          </Button>
        </div>

        {verificationState !== 'none' && !requestsQuery.isLoading ? (
          <ProfileVerificationStateScreen
            state={verificationState}
            request={latestProfileVerificationRequest}
            onRetryRequest={() => setValidationDialogOpen(true)}
          />
        ) : null}

        <ProfileContent
          data={draft}
          regiones={regiones}
          onChange={handleChange}
          locationError={locationError}
          isVerified={profile.isVerified}
          verificationState={verificationState}
          isVerificationStateLoading={requestsQuery.isLoading}
          onValidateProfile={() => setValidationDialogOpen(true)}
        />

        <div className="flex items-center justify-between gap-3 mt-8 pt-6 border-t">
          <div className="text-sm text-muted-foreground">
            {dirtyFields.length > 0 && (
              <span className="text-amber-600">
                {dirtyFields.length} campo{dirtyFields.length !== 1 ? 's' : ''} sin guardar
              </span>
            )}
            {saveMutation.isError && (
              <span className="text-destructive ml-4">Error al guardar</span>
            )}
            {locationError && (
              <span className="text-destructive ml-4 flex items-center gap-1">{locationError}</span>
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
              disabled={(dirtyFields.length === 0 && !locationError) || isSaving}
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

        <ProfileValidationRequestDialog
          open={validationDialogOpen}
          onOpenChange={setValidationDialogOpen}
        />
      </div>
    </div>
  );
}
