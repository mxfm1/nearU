'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
  Loader2,
  AlertCircle,
  Plus,
  ChevronDown,
  Info,
  ExternalLink,
  Calendar,
  CheckCircle,
} from 'lucide-react'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'

import {
  ScoringRulesFormSchema,
  type ScoringRuleFormValues,
  type ScoringRulesFormValues,
} from '@/components/forms/schemas'
import { scoringRulesApi, type ScoringRuleOption } from '@/lib/scoring-rules-api'
import { eventosApi, type EventoDetalle } from '@/lib/eventos-api'
import { getRuleName, getRuleDescription, getRuleIcon, getRuleColors } from '@/lib/domain/rules'
import { RuleCard } from './rule-card'

// --- Props ---

interface ApplicationScoreFormProps {
  eventId: string
}

// --- Main Component ---

export function ApplicationScoreForm({ eventId }: ApplicationScoreFormProps) {
  const [showRuleSelector, setShowRuleSelector] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Fetch event details
  const { data: eventRes, isLoading: eventLoading } = useQuery({
    queryKey: ['evento', eventId],
    queryFn: () => eventosApi.getById(eventId),
  })

  // Fetch available rules (cached)
  const { data: availableRulesRes, isLoading: rulesLoading } = useQuery({
    queryKey: ['scoring-rules', 'available'],
    queryFn: () => scoringRulesApi.getAvailableRules(),
  })

  // Fetch current rules for this event
  const { data: currentRulesRes, isLoading: currentLoading } = useQuery({
    queryKey: ['scoring-rules', eventId],
    queryFn: () => scoringRulesApi.getByEventId(eventId),
  })

  const event = eventRes?.data
  const availableRules = availableRulesRes?.data ?? []
  const currentRules = currentRulesRes?.data ?? []

  // Build catalog lookup map from ruleType → catalog entry
  const catalogMap = new Map(availableRules.map((r) => [r.ruleType, r]))

  // Form
  const form = useForm<ScoringRulesFormValues>({
    resolver: zodResolver(ScoringRulesFormSchema),
    defaultValues: {
      rules: [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'rules',
  })

  // Watch rules for validation
  const watchedRules = form.watch('rules')

  // Compute total weight
  const totalWeight = watchedRules.reduce((sum, rule) => sum + (Number(rule.weight) || 0), 0)

  // Initialize form with current rules
  useEffect(() => {
    if (currentRules.length > 0 && fields.length === 0) {
      currentRules.forEach((rule) => {
        append({
          ruleType: rule.ruleType,
          weight: rule.weight,
          config: rule.config,
        })
      })
    }
  }, [currentRules, fields.length, append])

  // Clear submit error when rules change
  useEffect(() => {
    if (submitError && watchedRules.length > 0) {
      setSubmitError(null)
    }
  }, [watchedRules.length, submitError])

  // Mutation
  const mutation = useMutation({
    mutationFn: (payload: { ruleType: string; weight: number }[]) =>
      scoringRulesApi.create(eventId, payload),
    onSuccess: () => {
      setSubmitError(null)
    },
    onError: (error: Error) => {
      setSubmitError(error.message || 'Error al guardar las reglas')
    },
  })

  // Handlers
  function handleAddRule(ruleType: string) {
    append({ ruleType, weight: 1, config: null })
    setShowRuleSelector(false)
    setSubmitError(null)
  }

  function handleDiscard() {
    form.reset({
      rules: currentRules.map((r) => ({
        ruleType: r.ruleType,
        weight: r.weight,
        config: r.config,
      })),
    })
    setSubmitError(null)
  }

  function handleSubmit() {
    const formRules = form.getValues('rules')
    if (formRules.length === 0) {
      setSubmitError('Debe agregar al menos una regla de puntaje')
      return
    }
    const payload = formRules.map((r) => ({
      ruleType: String(r.ruleType),
      weight: Number(r.weight),
    }))
    mutation.mutate(payload)
  }

  // Get available rules that aren't added yet
  const addedRuleTypes = fields.map((f) => f.ruleType)
  const availableToAdd = availableRules.filter(
    (rule) => !addedRuleTypes.includes(rule.ruleType)
  )

  // Loading state
  if (eventLoading || currentLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Event Header Card */}
      {event && (
        <div className="flex items-center gap-4 p-4 bg-card rounded-lg border border-border">
          {/* Event Thumbnail */}
          <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
            {event.thumbnailUrl ? (
              <Image
                src={event.thumbnailUrl}
                alt={event.title ?? ""}
                fill
                className="object-cover"
                sizes="64px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Calendar className="h-6 w-6 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Event Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                EVENTO ACTIVO
              </span>
            </div>
            <h3 className="font-semibold text-foreground truncate">{event.title}</h3>
          </div>

          {/* Ver Evento Button */}
          <Link
            href={`/eventos/${event.id}`}
            target="_blank"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground border border-border rounded-lg hover:bg-muted transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            Ver Evento
          </Link>
        </div>
      )}

      {/* Submit Error Banner */}
      {submitError && (
        <div className="flex items-center gap-3 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm font-medium">{submitError}</p>
        </div>
      )}

      {/* API Error */}
      {mutation.isError && !submitError && (
        <div className="flex items-center gap-3 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm font-medium">
            {mutation.error instanceof Error
              ? mutation.error.message
              : 'Error al guardar las reglas'}
          </p>
        </div>
      )}

      {/* Success Banner */}
      {mutation.isSuccess && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-lg bg-emerald-50 border border-emerald-200">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
            <p className="text-sm font-medium text-emerald-700">
              Tus cambios fueron guardados exitosamente
            </p>
          </div>
          <div className="flex items-center gap-2 sm:ml-auto">
            <Link
              href="/descubrir"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-emerald-700 bg-emerald-100 rounded-lg hover:bg-emerald-200 transition-colors"
            >
              Volver al inicio
            </Link>
            <Link
              href="/user/publicaciones"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Ir a mis publicaciones
            </Link>
          </div>
        </div>
      )}

      <Form {...form}>
        <div className="space-y-6">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Sidebar */}
            <aside className="w-full lg:w-[280px] lg:sticky lg:top-24 lg:self-start space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-2">
                  Reglas de Seleccion
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Define cómo se clasificarán automáticamente los aplicantes. Asigna
                  puntajes positivos o negativos a diferentes criterios para priorizar a los
                  mejores candidatos.
                </p>
                <p className="text-xs text-muted-foreground mt-2 italic">
                  El puntaje de ponderación fluctúa entre 0 y 100.
                </p>
              </div>

              {/* Add Rule Button */}
              <div className="relative">
                <Button
                  type="button"
                  className="w-full justify-between bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => setShowRuleSelector(!showRuleSelector)}
                >
                  <span className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Agregar Nueva Regla
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${showRuleSelector ? 'rotate-180' : ''
                      }`}
                  />
                </Button>

                {/* Rule Selector Dropdown */}
                {showRuleSelector && (
                  <div className="absolute z-10 w-full mt-1 bg-background border border-border rounded-lg shadow-lg">
                    {availableToAdd.length > 0 ? (
                      availableToAdd.map((rule) => {
                        const Icon = getRuleIcon(rule.ruleType)
                        const { bgColor, borderColor } = getRuleColors(rule.ruleType)
                        return (
                          <button
                            key={rule.ruleType}
                            type="button"
                            className="w-full flex items-center gap-3 p-3 text-left hover:bg-muted transition-colors first:rounded-t-lg last:rounded-b-lg"
                            onClick={() => handleAddRule(rule.ruleType)}
                          >
                            <div className="flex-shrink-0">
                              {Icon ? (
                                <Icon className="h-5 w-5" />
                              ) : (
                                <div className="h-5 w-5 rounded-full bg-gray-300" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-foreground">{rule.name}</p>
                              <p className="text-sm text-muted-foreground truncate">
                                {rule.description}
                              </p>
                            </div>
                          </button>
                        )
                      })
                    ) : (
                      <div className="p-3 text-center text-sm text-muted-foreground">
                        Todas las reglas ya fueron agregadas
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Info Banner */}
              <div className="flex items-start gap-3 p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700">
                <Info className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm">
                  Los puntajes se suman en tiempo real cuando un proveedor aplica a
                  tu evento. Un puntaje mayor asegura que aparezca en la parte
                  superior de tu lista de revisados.
                </p>
              </div>
            </aside>

            {/* Right Content - Active Rules */}
            <div className="flex-1 space-y-4">
              {/* Rules Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">
                  Reglas Configuradas
                </h3>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-muted text-muted-foreground">
                  {fields.length} {fields.length === 1 ? 'Regla' : 'Reglas'}
                </span>
              </div>

              {/* Rules List */}
              <div className="space-y-3">
                {fields.map((field, index) => {
                  const catalogEntry = catalogMap.get(field.ruleType)
                  return (
                    <RuleCard
                      key={field.id}
                      index={index}
                      ruleType={field.ruleType}
                      catalogDescription={catalogEntry?.description}
                      form={form}
                      fields={fields}
                      remove={remove}
                    />
                  )
                })}

                {fields.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-lg">
                    <p>No hay reglas configuradas. Agregue una regla para comenzar.</p>
                  </div>
                )}
              </div>

              {/* Total Weight Info */}
              {fields.length > 0 && (
                <div className={`flex items-start gap-3 p-4 rounded-lg border ${totalWeight === 100
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                    : 'bg-amber-50 border-amber-200 text-amber-700'
                  }`}>
                  <Info className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p>
                      La suma de los puntajes debe ser <strong>100</strong>. Actualmente
                      suman <strong>{totalWeight}</strong>.
                    </p>
                    {totalWeight === 100 && (
                      <p className="mt-1 text-emerald-600 font-medium">
                        Los puntajes están correctamente distribuidos.
                      </p>
                    )}
                    {totalWeight > 100 && (
                      <p className="mt-1 text-amber-600 font-medium">
                        El total supera 100. Reducí el puntaje de alguna regla.
                      </p>
                    )}
                    {totalWeight < 100 && (
                      <p className="mt-1 text-amber-600 font-medium">
                        El total es menor a 100. Aumentá el puntaje de alguna regla.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              className="flex-1 sm:flex-none"
              onClick={handleDiscard}
              disabled={mutation.isPending}
            >
              Descartar Cambios
            </Button>
            <Button
              type="button"
              className="flex-1 sm:flex-none"
              onClick={handleSubmit}
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Guardando...
                </>
              ) : (
                'Guardar Cambios'
              )}
            </Button>
          </div>
        </div>
      </Form>
    </div>
  )
}
