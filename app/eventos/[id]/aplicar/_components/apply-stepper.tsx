'use client';

import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ApplicationStatus } from '@/lib/applications-api';

type StepStatus = 'completed' | 'current' | 'upcoming';

const steps = [
  { number: '01', label: 'Formulario', sublabel: 'Completado' },
  { number: '02', label: 'Análisis', sublabel: 'Evaluando' },
  { number: '03', label: 'Resultado', sublabel: 'Pendiente' },
];

interface ApplyStepperProps {
  currentStep: number;
  applicationStatus?: ApplicationStatus | null;
}

function getStepStatus(stepIndex: number, currentStep: number): StepStatus {
  if (stepIndex < currentStep) return 'completed';
  if (stepIndex === currentStep) return 'current';
  return 'upcoming';
}

export function ApplyStepper({ currentStep, applicationStatus }: ApplyStepperProps) {
  const isRejected = applicationStatus === 'rejected';
  const isAccepted = applicationStatus === 'accepted';
  const hasResult = isRejected || isAccepted;

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4">
      {steps.map((step, index) => {
        const status = getStepStatus(index, currentStep);

        // Update sublabel based on status
        let sublabel = step.sublabel;
        if (index === 2 && hasResult) {
          sublabel = isAccepted ? 'Aprobado' : 'No seleccionado';
        }

        return (
          <div key={step.number} className="flex items-center gap-2 sm:gap-4">
            {/* Step */}
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors',
                  status === 'completed' &&
                    !(index === 2 && isRejected) &&
                    'bg-primary text-primary-foreground',
                  status === 'completed' &&
                    index === 2 &&
                    isRejected &&
                    'bg-destructive text-destructive-foreground',
                  status === 'current' && !isRejected && 'bg-primary text-primary-foreground',
                  status === 'current' &&
                    isRejected &&
                    'bg-destructive text-destructive-foreground',
                  status === 'upcoming' && 'bg-muted text-muted-foreground'
                )}
              >
                {status === 'completed' ? (
                  index === 2 && isRejected ? (
                    <X className="h-4 w-4" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )
                ) : index === 2 && isRejected ? (
                  <X className="h-4 w-4" />
                ) : (
                  step.number
                )}
              </div>
              <div className="hidden sm:block">
                <span
                  className={cn(
                    'text-xs sm:text-sm font-medium block',
                    status === 'current' && isRejected
                      ? 'text-destructive'
                      : status === 'current'
                        ? 'text-foreground'
                        : 'text-muted-foreground'
                  )}
                >
                  {step.label}
                </span>
                <span
                  className={cn(
                    'text-[10px] sm:text-xs block',
                    status === 'completed' && !(index === 2 && isRejected) && 'text-primary',
                    status === 'completed' &&
                      index === 2 &&
                      isRejected &&
                      'text-destructive font-bold',
                    status === 'current' && isRejected && 'text-destructive font-bold',
                    status === 'current' && !isRejected && 'text-muted-foreground',
                    status === 'upcoming' && 'text-muted-foreground/60'
                  )}
                >
                  {sublabel}
                </span>
              </div>
            </div>

            {/* Connector */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'h-px w-8 sm:w-12',
                  index < currentStep
                    ? isRejected && index === 1
                      ? 'bg-destructive'
                      : 'bg-primary'
                    : 'bg-border'
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
