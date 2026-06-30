'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Briefcase, Music, UtensilsCrossed } from 'lucide-react'

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
import { Button } from '@/components/ui/button'

import { CrearEventoSchema, type CrearEventoFormValues } from '@/components/forms/schemas'
import { FormSidebar } from './form-sidebar'
import { CategoryCard } from './category-card'
import { ImageUploadZone } from './image-upload-zone'

const steps = [
  { id: 'foundations', label: 'Foundations', number: '01' },
  { id: 'atmosphere', label: 'Atmosphere', number: '02' },
]

const categories = [
  { id: 'vendors', label: 'Vendors', icon: Briefcase },
  { id: 'music', label: 'Music', icon: Music },
  { id: 'catering', label: 'Catering', icon: UtensilsCrossed },
]

export function CrearEventoContent() {
  const [activeStep, setActiveStep] = useState('foundations')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  const form = useForm<CrearEventoFormValues>({
    resolver: zodResolver(CrearEventoSchema),
    defaultValues: {
      eventTitle: '',
      scheduledDate: '',
      commencementTime: '',
      venueLocation: '',
      categories: [],
      longDescription: '',
    },
  })

  const handleFormSubmit = (data: CrearEventoFormValues) => {
    console.log('Evento data:', data)
  }

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) => {
      const newCategories = prev.includes(categoryId)
        ? prev.filter((c) => c !== categoryId)
        : [...prev, categoryId]
      form.setValue('categories', newCategories)
      return newCategories
    })
  }

  return (
    <section className="px-4 pt-24 pb-20 md:pt-32 md:pb-28">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <FormSidebar
            title="Curate an Exquisite Event"
            description="Define the parameters of your next luxury experience. Every detail contributes to the editorial narrative of the occasion."
            steps={steps}
            activeStep={activeStep}
            onStepClick={setActiveStep}
          />

          {/* Form Content */}
          <div className="flex-1">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-12">
                {/* Section: Event Fundamentals */}
                <div className="space-y-6">
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-3">
                    EVENT FUNDAMENTALS
                  </h2>

                  <FormField
                    control={form.control}
                    name="eventTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="E.g., The Midnight Vintageage"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="scheduledDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Scheduled Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="commencementTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Commencement Time</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="venueLocation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Venue Location</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="City, Country or Specific Address"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Section: Classification & Partners */}
                <div className="space-y-6">
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-3">
                    CLASSIFICATION & PARTNERS
                  </h2>

                  <div className="grid grid-cols-3 gap-4">
                    {categories.map((category) => (
                      <CategoryCard
                        key={category.id}
                        icon={category.icon}
                        label={category.label}
                        isSelected={selectedCategories.includes(category.id)}
                        onClick={() => toggleCategory(category.id)}
                      />
                    ))}
                  </div>

                  {form.formState.errors.categories && (
                    <p className="text-sm font-medium text-destructive">
                      {form.formState.errors.categories.message}
                    </p>
                  )}
                </div>

                {/* Section: Narrative & Visuals */}
                <div className="space-y-6">
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-3">
                    NARRATIVE & VISUALS
                  </h2>

                  <FormField
                    control={form.control}
                    name="longDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Long Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Articulate the vision, guest expectations, and editorial flow of the event..."
                            className="min-h-[120px] resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Section: Cover Imagery */}
                <div className="space-y-6">
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-3">
                    COVER IMAGERY
                  </h2>

                  <ImageUploadZone />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-border">
                  <Button type="submit" className="flex-1 sm:flex-none">
                    PUBLISH EVENT
                  </Button>
                  <Button type="button" variant="outline" className="flex-1 sm:flex-none">
                    SAVE AS DRAFT
                  </Button>
                  <Button type="button" variant="ghost" className="flex-1 sm:flex-none">
                    CANCEL
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  )
}
