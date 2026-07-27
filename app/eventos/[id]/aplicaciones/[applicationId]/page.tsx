'use client';

import { Suspense, use } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';
import { ApplicationSection } from './_components/application-section';
import { ApplicationDetailSkeleton } from './_components/application-detail-skeleton';
import { useApplication } from '@/hooks/applications/applications-queries';
import { useEvent } from '@/hooks/use-event';
import type { ApplicationStatus } from '@/lib/applications-api';
import { toast } from 'react-hot-toast';

interface PageProps {
  params: Promise<{ id: string; applicationId: string }>;
}

export default function ApplicationDetailPage({ params }: PageProps) {
  return (
    <Suspense fallback={<ApplicationDetailSkeleton />}>
      <ApplicationDetailPageClient params={params} />
    </Suspense>
  );
}

function ApplicationDetailPageClient({ params }: PageProps) {
  const { id: eventId, applicationId } = use(params);
  const queryClient = useQueryClient();

  const { data: application, isLoading, isError, refetch } = useApplication(applicationId);
  const { event } = useEvent(eventId);

  const updateMutation = useMutation({
    mutationFn: async (status: ApplicationStatus) => {
      const { applicationsApi } = await import('@/lib/applications-api');
      return applicationsApi.updateApplicationStatus(applicationId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['application-detail', applicationId] });
      queryClient.invalidateQueries({ queryKey: ['event-applications', eventId] });
      toast.success('Estado actualizado correctamente');
    },
    onError: () => {
      toast.error('Error al actualizar el estado');
    },
  });

  function handleStatusChange(status: ApplicationStatus) {
    updateMutation.mutate(status);
  }

  return (
    <ApplicationSection
      application={application ?? null}
      event={event}
      isPending={isLoading}
      isError={isError}
      onRefetch={refetch}
      onStatusChange={handleStatusChange}
      isStatusPending={updateMutation.isPending}
    />
  );
}
