'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const INDUSTRIES = [
  'Agricultura Orgánica',
  'Arquitectura',
  'Consultoría',
  'Energía',
  'Educación',
  'Tecnología',
]

interface GeneralInfoProps {
  name: string
  industry: string
  description: string
  tags: string[]
  onChange: (field: string, value: unknown) => void
}

export function GeneralInfo({ name, industry, description, tags, onChange }: GeneralInfoProps) {
  const [newTag, setNewTag] = useState('')

  const handleAddTag = () => {
    const trimmed = newTag.trim()
    if (trimmed && !tags.includes(trimmed)) {
      onChange('tags', [...tags, trimmed])
      setNewTag('')
    }
  }

  const handleRemoveTag = (tag: string) => {
    onChange('tags', tags.filter((t) => t !== tag))
  }

  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-lg">⚙️</span>
          <h2 className="text-lg font-semibold text-foreground">Información General</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <Label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase">
              Nombre de la Empresa
            </Label>
            <Input
              value={name}
              onChange={(e) => onChange('name', e.target.value)}
            />
          </div>
          <div>
            <Label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase">
              Rubro / Industria
            </Label>
            <Select value={industry} onValueChange={(v) => onChange('industry', v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {INDUSTRIES.map((ind) => (
                  <SelectItem key={ind} value={ind}>
                    {ind}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mb-4">
          <Label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase">
            Descripción de la Empresa
          </Label>
          <Textarea
            rows={4}
            value={description}
            onChange={(e) => onChange('description', e.target.value)}
          />
        </div>

        <div>
          <Label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase">
            Etiquetas / Keywords
          </Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="bg-brand/10 text-brand hover:bg-brand/20"
              >
                {tag}
                <button onClick={() => handleRemoveTag(tag)} className="ml-1 hover:text-destructive">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Agregar..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              className="flex-1"
            />
            <Button type="button" variant="outline" onClick={handleAddTag}>
              Agregar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
