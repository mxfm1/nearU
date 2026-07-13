'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AlertCircle } from 'lucide-react'
import { type Ubicacion } from '@/lib/catalogo-api'

const EMPLOYEE_SIZES = [
  '1-10',
  '10-50',
  '51-200',
  '201-500',
  '500+',
]

interface ProfileDetailsProps {
  locationId: string
  founded: string
  employees: string
  ubicaciones: Ubicacion[]
  onChange: (field: string, value: unknown) => void
  locationError?: string | null
}

export function ProfileDetails({ locationId, founded, employees, ubicaciones, onChange, locationError }: ProfileDetailsProps) {
  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold text-foreground mb-6">Detalles</h2>

        <div className="space-y-4">
          <div>
            <Label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase">
              Ubicación <span className="text-destructive">*</span>
            </Label>
            <Select value={locationId} onValueChange={(v) => onChange('locationId', v)}>
              <SelectTrigger className={locationError ? 'border-destructive focus:ring-destructive/20' : ''}>
                <SelectValue placeholder="Seleccionar ubicación" />
              </SelectTrigger>
              <SelectContent>
                {ubicaciones.map((ubicacion) => (
                  <SelectItem key={ubicacion.id} value={ubicacion.id}>
                    {ubicacion.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {locationError && (
              <div className="flex items-center gap-1 mt-1.5 text-destructive text-xs">
                <AlertCircle className="h-3 w-3" />
                {locationError}
              </div>
            )}
          </div>

          <div>
            <Label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase">
              Año de Fundación
            </Label>
            <Input
              value={founded}
              onChange={(e) => onChange('founded', e.target.value)}
            />
          </div>

          <div>
            <Label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase">
              Tamaño (Empleados)
            </Label>
            <Select value={employees} onValueChange={(v) => onChange('employees', v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EMPLOYEE_SIZES.map((size) => (
                  <SelectItem key={size} value={size}>
                    {size} personas
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase">
              Estado de Verificación
            </Label>
            <Badge className="bg-brand text-white">
              <span className="mr-1">✓</span> Empresa Verificada
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
