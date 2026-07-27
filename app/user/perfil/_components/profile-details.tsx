'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AlertCircle } from 'lucide-react';
import { type Region } from '@/lib/catalogo-api';

const EMPLOYEE_SIZES = ['1-10', '10-50', '51-200', '201-500', '500+'];

interface ProfileDetailsProps {
  regionId: string;
  founded: string;
  employees: string;
  regiones: Region[];
  onChange: (field: string, value: unknown) => void;
  locationError?: string | null;
}

export function ProfileDetails({
  regionId,
  founded,
  employees,
  regiones,
  onChange,
  locationError,
}: ProfileDetailsProps) {
  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold text-foreground mb-6">Detalles</h2>

        <div className="space-y-4">
          <div>
            <Label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase">
              Región <span className="text-destructive">*</span>
            </Label>
            <Select value={regionId} onValueChange={(v) => onChange('regionId', v)}>
              <SelectTrigger
                className={locationError ? 'border-destructive focus:ring-destructive/20' : ''}
              >
                <SelectValue placeholder="Seleccionar región" />
              </SelectTrigger>
              <SelectContent>
                {regiones.map((region) => (
                  <SelectItem key={region.id} value={region.id ?? ''}>
                    {region.name}
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
            <Input value={founded} onChange={(e) => onChange('founded', e.target.value)} />
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
  );
}
