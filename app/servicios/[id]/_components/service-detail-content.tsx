'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { useServiceDetail } from '@/hooks/services/service-queries';
import { profileApi } from '@/lib/profile-api';
import { ServiceDetailEmpty } from './service-detail-empty';
import { ServiceDetailError } from './service-detail-error';
import { ServiceDetailScreen } from './service-detail-screen';
import { ServiceDetailSkeleton } from './service-detail-skeleton';

interface ServiceDetailContentProps {
  id: string;
}

export function ServiceDetailContent({ id }: ServiceDetailContentProps) {
  const serviceQuery = useServiceDetail(id);
  const { user, isPending: authPending } = useAuth();
  const myProfileQuery = useQuery({
    queryKey: ['profile', 'me', user?.id],
    queryFn: () => profileApi.getByUserId(user!.id),
    enabled: !!user?.id,
    select: (res) => res.data,
  });

  if (serviceQuery.isLoading) return <ServiceDetailSkeleton />;
  if (serviceQuery.isError) return <ServiceDetailError onRetry={() => serviceQuery.refetch()} />;
  if (!serviceQuery.data) return <ServiceDetailEmpty />;

  return (
    <ServiceDetailScreen
      service={serviceQuery.data}
      currentUserId={user?.id}
      authPending={authPending}
      myProfile={myProfileQuery.data}
      profilePending={myProfileQuery.isLoading}
      profileError={myProfileQuery.isError}
      onRetryProfile={() => myProfileQuery.refetch()}
    />
  );
}
