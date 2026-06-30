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

const EMPLOYEE_SIZES = [
  '1-10',
  '10-50',
  '51-200',
  '201-500',
  '500+',
]

interface ProfileDetailsProps {
  location: string
  founded: string
  employees: string
  onChange: (field: string, value: unknown) => void
}

export function ProfileDetails({ location, founded, employees, onChange }: ProfileDetailsProps) {
  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold text-foreground mb-6">Detalles</h2>

        <div className="space-y-4">
          <div>
            <Label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase">
              Ubicación
            </Label>
            <Input
              value={location}
              onChange={(e) => onChange('location', e.target.value)}
            />
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
