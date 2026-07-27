'use client';

import { useProfile } from '@/hooks/profile/profile-queries';
import { useRegiones } from '@/hooks/catalogo/catalogo-queries';
import { ProfileEditPage } from './_components/profile-edit-page';
import { ProfileLoading } from './_components/errors/profile-loading';
import { ProfileError } from './_components/errors/profile-error';

export default function ProfilePage() {
  const profileQuery = useProfile();
  const regionesQuery = useRegiones();

  console.log('profile data', profileQuery.data);
  console.log('regiones', regionesQuery.data);

  const isPending = profileQuery.isPending || regionesQuery.isPending;
  const isError = profileQuery.isError || regionesQuery.isError;

  if (isPending) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <ProfileLoading />
        </div>
      </div>
    );
  }

  if (isError) {
    const error = profileQuery.error ?? regionesQuery.error;
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <ProfileError
            error={error instanceof Error ? error : new Error('Error desconocido')}
            onRetry={() => {
              profileQuery.refetch();
              regionesQuery.refetch();
            }}
          />
        </div>
      </div>
    );
  }

  if (!profileQuery.data) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <ProfileError error={new Error('Perfil no encontrado')} onRetry={() => {}} />
        </div>
      </div>
    );
  }

  return <ProfileEditPage profile={profileQuery.data} regiones={regionesQuery.data ?? []} />;
}
