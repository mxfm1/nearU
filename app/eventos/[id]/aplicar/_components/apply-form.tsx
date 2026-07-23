'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  Loader2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  CheckCircle,
  ShieldCheck,
  User,
} from 'lucide-react'
import toast from 'react-hot-toast'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'

import { ApplicationFormSchema, type ApplicationFormValues } from '@/components/forms/schemas'
import { applicationsApi } from '@/lib/applications-api'
import type { RuleFieldConfig } from '@/lib/domain/application-rules'

import { ApplyStepper } from './apply-stepper'
import { ApplyPending } from './apply-pending'
import { ApplyResult } from './apply-result'
import type { ApplicationStatus } from '@/lib/applications-api'

interface ApplyFormProps {
  eventId: string
  eventTitle: string
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
}

export function ApplyForm({ eventId, eventTitle }: ApplyFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [applicationId, setApplicationId] = useState<string | null>(null)
  const [applicationStatus, setApplicationStatus] = useState<ApplicationStatus | null>(null)

  // Check if user already has an application for this event
  const { data: existingAppRes, isLoading: checkingExisting } = useQuery({
    queryKey: ['my-application', eventId],
    queryFn: () => applicationsApi.getMyApplicationByEventId(eventId),
    retry: false,
  })

  const existingApplication = existingAppRes?.data

  // If application exists, set step based on status
  useEffect(() => {
    if (existingApplication) {
      setApplicationId(existingApplication.id ?? null)
      setApplicationStatus((existingApplication.status as ApplicationStatus) ?? null)
      if (existingApplication.status === 'pending') {
        setCurrentStep(1)
      } else if (existingApplication.status === 'reviewing') {
        setCurrentStep(2)
      } else if (existingApplication.status === 'accepted' || existingApplication.status === 'rejected') {
        setCurrentStep(3) // Result phase
      } else {
        setCurrentStep(2)
      }
    }
  }, [existingApplication])

  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(ApplicationFormSchema),
    defaultValues: {
      coverLetter: '',
    },
  })

  // Mutation
  const mutation = useMutation({
    mutationFn: (payload: ApplicationFormValues) =>
      applicationsApi.create({
        eventId,
        coverLetter: payload.coverLetter || undefined,
      }),
    onSuccess: (res) => {
      setSubmitError(null)
      setApplicationId(res.data.id ?? null)
      toast.success('¡Postulación enviada con éxito!', {
        duration: 3000,
        icon: '🎉',
      })
      setTimeout(() => {
        setCurrentStep(1)
      }, 2000)
    },
    onError: (error: Error) => {
      setSubmitError(error.message || 'Error al enviar la postulación')
    },
  })

  function handleSubmit(data: ApplicationFormValues) {
    mutation.mutate(data)
  }

  if (checkingExisting) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 lg:py-12">
        {/* Stepper */}
        <motion.div {...fadeInUp} className="mb-8 flex flex-col md:flex-row md:items-center gap-4">
          <Button
            type="button"
            variant="outline"
            className="flex-none self-start md:self-auto"
            asChild
          >
            <Link href={`/eventos/${eventId}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Link>
          </Button>
          <div className="flex-1 w-full">
            <ApplyStepper currentStep={currentStep} applicationStatus={applicationStatus} />
          </div>
        </motion.div>

        {/* Banner: Complete your profile */}
        {currentStep === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="mb-6 p-4 rounded-md bg-amber-50 border border-amber-200"
          >
            <p className="text-sm text-amber-800">
              <span className="font-medium">Tu postulación depende de cómo esté configurado tu perfil.</span>{' '}
              Te recomendamos completarlo para tener una mejor experiencia.
            </p>
          </motion.div>
        )}

        {/* Step 0: Form */}
        {currentStep === 0 && (
          <>
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-center mb-6"
            >
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                Postulación al Evento
              </h1>
              <p className="text-sm text-muted-foreground max-w-lg mx-auto">
                Tus respuestas serán tratadas con reservas y se usarán con ningún otro medio
                que no sea el de contactarte. Lee nuestros{' '}
                <Link href="/terminos" className="text-primary underline">
                  Términos y Condiciones
                </Link>
                .
              </p>
            </motion.div>

            {/* Submit Error */}
            {submitError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 mb-6"
              >
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <p className="text-sm font-medium">{submitError}</p>
              </motion.div>
            )}

            {/* Form */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                <div className="max-w-xl mx-auto">
                  {/* Cover Letter */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                  >
                    <FormField
                      control={form.control}
                      name="coverLetter"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between mb-2">
                            <FormLabel className="text-sm font-medium text-foreground">
                              Carta de presentación (opcional)
                            </FormLabel>

                          </div>
                          <FormControl>
                            <Textarea
                              placeholder="Contanos sobre tu empresa y por qué sos el candidato ideal..."
                              className="min-h-[150px] resize-none"
                              maxLength={400}
                              {...field}
                            />
                          </FormControl>
                          <p className="text-xs text-muted-foreground text-right">
                            Máximo 400 caracteres
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                </div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="flex flex-col sm:flex-row justify-end gap-3 pt-4"
                >
                  <Button
                    type="submit"
                    className="flex-1 sm:flex-none bg-primary text-primary-foreground hover:bg-primary/90"
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        Postularme
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>

                </motion.div>
              </form>
            </Form>
          </>
        )}

        {/* Step 1: Pending / Verification */}
        {currentStep === 1 && (
          <ApplyPending eventId={eventId} />
        )}

        {/* Step 2: Reviewing */}
        {currentStep === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center py-12"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">
              ¡Postulación completada!
            </h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
              Tu postulación fue evaluada. El organizador del evento revisará tu perfil
              y te contactará si sos seleccionado.
            </p>
            <Button variant="outline" asChild>
              <Link href={`/eventos/${eventId}`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al evento
              </Link>
            </Button>
          </motion.div>
        )}

        {/* Step 3: Result (accepted/rejected) */}
        {currentStep === 3 && applicationStatus && (
          <ApplyResult
            status={applicationStatus}
            eventTitle={eventTitle}
            eventId={eventId}
          />
        )}

        {/* Trust Badges - only on step 0 */}
        {currentStep === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12"
          >
            <div className="flex items-center gap-3 text-muted-foreground">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <ShieldCheck className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-foreground">Validación Requerida</p>
                <p className="text-[10px] text-muted-foreground">
                  Proceso de verificación obligatorio
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-foreground">Evaluación Automática</p>
                <p className="text-[10px] text-muted-foreground">
                  Tus respuestas son analizadas por el sistema
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

// --- Individual Rule Field Component ---

interface RuleFieldProps {
  rule: RuleFieldConfig
  form: ReturnType<typeof useForm<ApplicationFormValues>>
}

function RuleField({ rule, form }: RuleFieldProps) {
  const fieldName = `scoringFieldValues.${rule.ruleType}` as keyof ApplicationFormValues

  switch (rule.inputType) {
    case 'toggle':
      return (
        <FormField
          control={form.control}
          name={fieldName}
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border border-border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-sm font-medium text-foreground">
                  {rule.label}
                </FormLabel>
                {rule.description && (
                  <p className="text-xs text-muted-foreground">{rule.description}</p>
                )}
              </div>
              <FormControl>
                <Switch
                  checked={!!field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      )

    case 'number':
      return (
        <FormField
          control={form.control}
          name={fieldName}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-foreground">
                {rule.label}
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  inputMode="numeric"
                  placeholder={rule.placeholder}
                  value={!field.value ? '' : String(field.value)}
                  onChange={(e) => {
                    const val = e.target.value
                    if (val === '') {
                      field.onChange('' as never)
                    } else {
                      const num = Number(val)
                      if (!isNaN(num)) {
                        field.onChange(num as never)
                      }
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )

    case 'text':
    default:
      return (
        <FormField
          control={form.control}
          name={fieldName}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-foreground">
                {rule.label}
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder={rule.placeholder}
                  value={String(field.value ?? '')}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )
  }
}
