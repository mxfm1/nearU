'use client'

import { cn } from '@/lib/utils'

interface Step {
  id: string
  label: string
  number: string
}

interface FormSidebarProps {
  title: string
  description: string
  steps: Step[]
  activeStep: string
  onStepClick: (stepId: string) => void
}

export function FormSidebar({
  title,
  description,
  steps,
  activeStep,
  onStepClick,
}: FormSidebarProps) {
  return (
    <aside className="w-full lg:w-[280px] lg:sticky lg:top-24 lg:self-start">
      <h1 className="text-2xl font-semibold text-foreground mb-3">
        {title}
      </h1>
      <p className="text-sm text-muted-foreground leading-relaxed mb-8">
        {description}
      </p>

      <nav className="space-y-1">
        {steps.map((step) => {
          const isActive = step.id === activeStep
          return (
            <button
              key={step.id}
              onClick={() => onStepClick(step.id)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md transition-all duration-200',
                isActive
                  ? 'bg-muted text-foreground border-l-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
            >
              <span className={cn(
                'text-xs font-bold',
                isActive ? 'text-primary' : 'text-muted-foreground/60'
              )}>
                {step.number}
              </span>
              <span className="uppercase tracking-wider text-xs">
                {step.label}
              </span>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
