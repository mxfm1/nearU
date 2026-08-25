'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { AlertCircle, CheckCircle2, Clock, Loader2, ShieldCheck, XCircle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useRequests, useProfileVerificationChecklist } from '@/hooks/requests/request-queries';
import { useCreateRequest } from '@/hooks/requests/request-mutations';
import {
  getActiveProfileVerificationRequest,
  getProfileVerificationRequirementsChecklist,
  getProfileVerificationRequestErrorMessage,
  PROFILE_VERIFICATION_ACTIVE_MESSAGE,
} from '@/lib/requests-utils';
import type { ProfileVerificationChecklist } from '@/types/contracts/requests';
import { cn } from '@/lib/utils';

interface ProfileValidationRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileValidationRequestDialog({
  open,
  onOpenChange,
}: ProfileValidationRequestDialogProps) {
  const [message, setMessage] = useState('');
  const [dialogError, setDialogError] = useState<string | null>(null);
  const [requirementsErrorChecklist, setRequirementsErrorChecklist] =
    useState<ProfileVerificationChecklist | null>(null);
  const requestsQuery = useRequests();
  const checklistQuery = useProfileVerificationChecklist(open);
  const createRequestMutation = useCreateRequest();

  const activeVerificationRequest = getActiveProfileVerificationRequest(
    requestsQuery.data?.data ?? []
  );
  const hasActiveVerificationRequest = Boolean(activeVerificationRequest);
  const isLoadingInitial = requestsQuery.isLoading || checklistQuery.isLoading;
  const isSending = createRequestMutation.isPending;
  const checklist = requirementsErrorChecklist ?? checklistQuery.data?.data;
  const canSubmit = !hasActiveVerificationRequest && !isSending && !isLoadingInitial;

  useEffect(() => {
    if (!open) return;
    setDialogError(null);
    setRequirementsErrorChecklist(null);
    requestsQuery.refetch();
    checklistQuery.refetch();
    // Refetch on every opening; dependency narrowing avoids a loop on query object identity.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (hasActiveVerificationRequest) {
      setDialogError(PROFILE_VERIFICATION_ACTIVE_MESSAGE);
    }
  }, [hasActiveVerificationRequest]);

  function handleOpenChange(nextOpen: boolean) {
    if (isSending) return;
    onOpenChange(nextOpen);
    if (!nextOpen) {
      setMessage('');
      setDialogError(null);
      setRequirementsErrorChecklist(null);
    }
  }

  function handleSubmit() {
    setDialogError(null);

    if (hasActiveVerificationRequest) {
      setDialogError(PROFILE_VERIFICATION_ACTIVE_MESSAGE);
      return;
    }

    createRequestMutation.mutate(
      {
        type: 'profile_verification',
        title: 'Solicitud de verificación de perfil',
        description: message.trim() || null,
      },
      {
        onSuccess: () => {
          toast.success('Solicitud de validación enviada correctamente');
          setMessage('');
          handleOpenChange(false);
        },
        onError: (error) => {
          setRequirementsErrorChecklist(getProfileVerificationRequirementsChecklist(error));
          setDialogError(getProfileVerificationRequestErrorMessage(error));
        },
      }
    );
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="gap-0 overflow-hidden p-0 sm:max-w-lg">
        <AlertDialogHeader className="border-b px-6 pb-4 pt-6">
          <div className="mb-2 flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <AlertDialogTitle className="text-xl">Validar mi perfil</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-base">
            Completá el proceso de validación para destacar tu perfil y acceder a mejores
            oportunidades.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="max-h-[min(620px,calc(100vh-14rem))] space-y-5 overflow-y-auto px-6 py-5">
          {isLoadingInitial ? (
            <div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin text-brand" />
              Consultando requisitos y solicitudes activas...
            </div>
          ) : null}

          {requestsQuery.isError || checklistQuery.isError ? (
            <div className="flex items-start gap-3 rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <p className="font-medium">No pudimos consultar el estado de validación.</p>
                <p className="mt-1 text-destructive/80">
                  Intentá de nuevo antes de enviar la solicitud.
                </p>
              </div>
            </div>
          ) : null}

          {dialogError ? (
            <div className="flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              <span>{dialogError}</span>
            </div>
          ) : null}

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Requisitos de validación</h3>
            <div className="space-y-2">
              {(checklist?.checks ?? []).map((check) => (
                <div
                  key={check.key}
                  className={cn(
                    'flex items-start gap-3 rounded-lg border p-3',
                    check.passed
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                      : check.required
                        ? 'border-amber-200 bg-amber-50 text-amber-900'
                        : 'border-border bg-muted/30 text-muted-foreground'
                  )}
                >
                  {check.passed ? (
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                  ) : check.required ? (
                    <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                  ) : (
                    <Clock className="mt-0.5 h-5 w-5 shrink-0" />
                  )}
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium">{check.label}</p>
                      {!check.required ? (
                        <span className="text-xs opacity-70">Opcional</span>
                      ) : null}
                    </div>
                    <p className="mt-1 text-xs opacity-80">{check.message || check.description}</p>
                  </div>
                </div>
              ))}
              {!isLoadingInitial && !checklist?.checks.length ? (
                <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                  No hay requisitos disponibles para mostrar.
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg border border-orange-200 bg-orange-50 p-4 text-sm text-orange-800">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <p>
              El proceso de validación puede tardar hasta 48 horas hábiles una vez enviada la
              solicitud.
            </p>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="profile-validation-message"
              className="text-sm font-medium text-foreground"
            >
              Mensaje para administración{' '}
              <span className="font-normal text-muted-foreground">(Opcional)</span>
            </label>
            <Textarea
              id="profile-validation-message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Explicá por qué deberíamos validar tu perfil..."
              className="min-h-[96px] resize-none"
              disabled={hasActiveVerificationRequest || isSending}
            />
          </div>
        </div>

        <AlertDialogFooter className="border-t bg-muted/20 px-6 py-4">
          <AlertDialogCancel disabled={isSending}>Cancelar</AlertDialogCancel>
          <Button
            type="button"
            disabled={!canSubmit}
            onClick={handleSubmit}
            className="bg-emerald-700 text-white hover:bg-emerald-800"
          >
            {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Enviar solicitud
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
