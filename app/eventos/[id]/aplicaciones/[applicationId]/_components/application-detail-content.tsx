'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApplicationSection } from './application-section';
import { useApplication } from '@/hooks/applications/applications-queries';
import { useEvent } from '@/hooks/use-event';
import type { ApplicationStatus } from '@/lib/applications-api';
import { toast } from 'react-hot-toast';

interface Props {
  eventId: string;
  applicationId: string;
}

export function ApplicationDetailContent({ eventId, applicationId }: Props) {
  const { data: application, isLoading, isError, refetch } = useApplication(applicationId);
  const { event } = useEvent(eventId);

  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: async (status: ApplicationStatus) => {
      const { applicationsApi } = await import('@/lib/applications-api');
      return applicationsApi.updateApplicationStatus(applicationId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['application-detail', applicationId] });
      queryClient.invalidateQueries({ queryKey: ['event-applications', eventId] });
    },
  });

  function handleStatusChange(status: ApplicationStatus) {
    updateMutation.mutate(status, {
      onSuccess: () => {
        toast.success('Estado actualizado correctamente');
      },
      onError: () => {
        toast.error('Error al actualizar el estado');
      },
    });
  }

  return (
    <ApplicationSection
      application={application ?? null}
      event={event ?? null}
      isPending={isLoading}
      isError={isError}
      onRefetch={refetch}
      onStatusChange={handleStatusChange}
      isStatusPending={updateMutation.isPending}
    />
  );
}
