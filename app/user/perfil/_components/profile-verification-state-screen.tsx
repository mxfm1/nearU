'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  Flag,
  HelpCircle,
  Home,
  MessageSquareText,
  ShieldCheck,
  X,
  XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { ProfileVerificationState } from '@/lib/requests-utils';
import type { UserRequest } from '@/types/contracts/requests';

interface ProfileVerificationStateScreenProps {
  state: Exclude<ProfileVerificationState, 'none'>;
  request: UserRequest | null;
  onRetryRequest: () => void;
}

const STATE_COPY: Record<
  Exclude<ProfileVerificationState, 'none'>,
  {
    title: string;
    description: string;
    icon: typeof Clock;
    tone: string;
    iconTone: string;
  }
> = {
  in_process: {
    title: 'Tu solicitud está en proceso',
    description:
      'Nuestro equipo administrativo está revisando tu perfil. Te notificaremos en un plazo de 24-48 horas.',
    icon: Clock,
    tone: 'from-amber-500 to-orange-500',
    iconTone: 'border-amber-200 bg-amber-50 text-amber-700',
  },
  approved: {
    title: 'Perfil validado',
    description:
      'Felicitaciones. Tu perfil fue revisado y aprobado por nuestro equipo. Ya contás con la insignia de empresa verificada.',
    icon: CheckCircle2,
    tone: 'from-emerald-700 to-lime-500',
    iconTone: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  },
  rejected: {
    title: 'Solicitud rechazada',
    description:
      'No pudimos aprobar tu solicitud de validación en este momento. Revisá el comentario de administración y volvé a intentarlo cuando corrijas la información.',
    icon: XCircle,
    tone: 'from-red-700 to-orange-500',
    iconTone: 'border-red-200 bg-red-50 text-red-700',
  },
};

function formatDate(value?: string | null): string | null {
  if (!value) return null;
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
}

export function ProfileVerificationStateScreen({
  state,
  request,
  onRetryRequest,
}: ProfileVerificationStateScreenProps) {
  const copy = STATE_COPY[state];
  const Icon = copy.icon;
  const createdAt = formatDate(request?.createdAt);
  const reviewedAt = formatDate(request?.reviewedAt);

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className="mb-8"
    >
      <Card className="overflow-hidden border-border/80 shadow-sm">
        <div className={cn('h-2 bg-gradient-to-r', copy.tone)} />
        <CardContent className="p-5 md:p-8">
          <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
            <ProgressTracker state={state} />

            <div
              className={cn(
                'relative mb-6 mt-8 flex h-24 w-24 items-center justify-center rounded-full border shadow-sm',
                copy.iconTone
              )}
            >
              {state === 'in_process' ? (
                <span className="absolute inset-0 rounded-full border-2 border-amber-400 opacity-40 animate-ping" />
              ) : null}
              <Icon className="relative z-10 h-12 w-12" />
            </div>

            <h2 className="text-2xl font-bold text-foreground md:text-3xl">{copy.title}</h2>
            <p className="mt-3 max-w-xl text-base leading-7 text-muted-foreground">
              {copy.description}
            </p>

            {state === 'approved' ? <VerifiedBadge /> : null}
            {state === 'rejected' ? <RejectedFeedback request={request} /> : null}

            <div className="mt-6 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              {state === 'in_process' ? (
                <Button asChild className="bg-brand text-white hover:bg-brand/90">
                  <Link href="/descubrir">
                    <Home className="h-4 w-4" />
                    Volver al inicio
                  </Link>
                </Button>
              ) : null}
              {state === 'approved' ? (
                <Button asChild className="bg-brand text-white hover:bg-brand/90">
                  <Link href="/user/perfil-preview">
                    Ir a mi perfil
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              ) : null}
              {state === 'rejected' ? (
                <Button
                  type="button"
                  className="bg-emerald-700 text-white hover:bg-emerald-800"
                  onClick={onRetryRequest}
                >
                  <ShieldCheck className="h-4 w-4" />
                  Editar perfil y volver a intentar
                </Button>
              ) : null}
            </div>

            <div className="mt-8 grid w-full gap-3 text-left md:grid-cols-2">
              <InfoCard
                icon={HelpCircle}
                title={state === 'rejected' ? '¿Qué deberías revisar?' : '¿Qué estamos revisando?'}
                description={
                  state === 'rejected'
                    ? 'Corregí los puntos observados y enviá una nueva solicitud cuando tu perfil esté listo.'
                    : 'La información pública de tu empresa, datos de contacto, presencia digital y consistencia del perfil.'
                }
              />
              <InfoCard
                icon={MessageSquareText}
                title="Seguimiento"
                description={
                  reviewedAt
                    ? `Revisada el ${reviewedAt}.`
                    : createdAt
                      ? `Solicitud enviada el ${createdAt}.`
                      : 'Vas a recibir novedades desde notificaciones.'
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.section>
  );
}

function ProgressTracker({ state }: { state: Exclude<ProfileVerificationState, 'none'> }) {
  const steps = [
    { key: 'sent', label: 'Enviada', icon: Check },
    { key: 'review', label: 'En revisión', icon: Clock },
    { key: 'result', label: 'Resultado', icon: Flag },
  ] as const;

  const resultDone = state === 'approved' || state === 'rejected';

  return (
    <div className="w-full max-w-xl">
      <div className="relative flex items-start justify-between">
        <div className="absolute left-6 right-6 top-5 h-1 rounded-full bg-muted" />
        <div
          className={cn(
            'absolute left-6 top-5 h-1 rounded-full bg-brand transition-all',
            state === 'in_process' ? 'w-[calc(50%-1.5rem)]' : 'right-6'
          )}
        />
        {steps.map((step, index) => {
          const StepIcon = step.icon;
          const completed = index === 0 || index === 1 || resultDone;
          const isRejectedResult = step.key === 'result' && state === 'rejected';
          const isCurrentReview = step.key === 'review' && state === 'in_process';

          return (
            <div key={step.key} className="relative z-10 flex w-24 flex-col items-center gap-2">
              <div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full shadow-sm',
                  isRejectedResult
                    ? 'bg-destructive text-destructive-foreground ring-4 ring-destructive/15'
                    : completed
                      ? 'bg-brand text-white'
                      : 'bg-muted text-muted-foreground',
                  isCurrentReview && 'ring-4 ring-brand/15'
                )}
              >
                {isRejectedResult ? <X className="h-5 w-5" /> : <StepIcon className="h-5 w-5" />}
              </div>
              <span
                className={cn(
                  'text-center text-xs font-semibold',
                  isRejectedResult
                    ? 'text-destructive'
                    : completed
                      ? 'text-brand'
                      : 'text-muted-foreground'
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function VerifiedBadge() {
  return (
    <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm">
      <ShieldCheck className="h-4 w-4" />
      Empresa verificada
    </div>
  );
}

function RejectedFeedback({ request }: { request: UserRequest | null }) {
  return (
    <div className="mt-6 w-full max-w-xl rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-left">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
        <div>
          <h3 className="text-sm font-semibold text-destructive">Motivo del rechazo</h3>
          <p className="mt-1 text-sm leading-6 text-destructive/85">
            {request?.reviewerComment ||
              'Administración rechazó la solicitud, pero no dejó un comentario específico.'}
          </p>
        </div>
      </div>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof HelpCircle;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border bg-card p-4 shadow-sm">
      <div className="rounded-md bg-muted p-2 text-brand">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
