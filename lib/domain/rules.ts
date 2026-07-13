import { ShieldCheck, MapPin, Crown, Briefcase, FileCheck, Star, Users, Building2, Globe, Award, HelpCircle, Link, FileText } from 'lucide-react'
import type { ComponentType } from 'react'

// --- Rule Metadata ---

export type RuleMetadata = {
  name: string
  description: string
  icon: ComponentType<{ className?: string }>
  bgColor: string
  borderColor: string
}

// --- Rule Type Mapping ---

const rulesMap: Record<string, RuleMetadata> = {
  KYC_VERIFIED: {
    name: 'KYC Verificado',
    description: 'Empresa con verificación de identidad completada',
    icon: ShieldCheck,
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
  },
  VERIFIED_PROFILE: {
    name: 'Perfil Verificado',
    description: 'La empresa completó el proceso de verificación empresarial',
    icon: FileCheck,
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
  },
  SAME_REGION: {
    name: 'Misma Región',
    description: 'Proveedor ubicado en la misma región que el evento',
    icon: MapPin,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  PREMIUM_MEMBER: {
    name: 'Miembro Premium',
    description: 'Proveedor con membresía premium activa',
    icon: Crown,
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
  },
  IS_PREMIUM_COMPANY: {
    name: 'Empresa Premium',
    description: 'Empresa con suscripción premium activa',
    icon: Crown,
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
  },
  HAS_PORTFOLIO: {
    name: 'Portafolio Activo',
    description: 'Proveedor con portafolio de trabajos completado',
    icon: Briefcase,
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
  },
  COMPLETED_PROJECTS: {
    name: 'Proyectos Completados',
    description: 'Proveedor con historial de proyectos finalizados',
    icon: Star,
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
  },
  TEAM_SIZE: {
    name: 'Equipo Calificado',
    description: 'Proveedor con equipo de trabajo suficiente',
    icon: Users,
    bgColor: 'bg-cyan-50',
    borderColor: 'border-cyan-200',
  },
  COMPANY_VERIFIED: {
    name: 'Empresa Verificada',
    description: 'Empresa verificada por el sistema',
    icon: Building2,
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-200',
  },
  INTERNATIONAL: {
    name: 'Cobertura Internacional',
    description: 'Proveedor con capacidad de operación internacional',
    icon: Globe,
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
  },
  CERTIFIED: {
    name: 'Certificación',
    description: 'Proveedor con certificaciones relevantes',
    icon: Award,
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
  },
  HAS_SOCIAL_LINKS: {
    name: 'Redes Sociales',
    description: 'Proveedor con perfiles de redes sociales vinculados',
    icon: Globe,
    bgColor: 'bg-sky-50',
    borderColor: 'border-sky-200',
  },
  HAS_WEBSITE: {
    name: 'Sitio Web',
    description: 'Posee sitio web corporativo',
    icon: Link,
    bgColor: 'bg-violet-50',
    borderColor: 'border-violet-200',
  },
  HAS_COMPANY_DESCRIPTION: {
    name: 'Descripción Empresarial',
    description: 'Posee descripción empresarial suficientemente completa',
    icon: FileText,
    bgColor: 'bg-slate-50',
    borderColor: 'border-slate-200',
  },
}

// --- Helper Functions ---

function formatRuleType(ruleType: string): string {
  return ruleType
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

export function getRuleMetadata(ruleType: string): RuleMetadata | undefined {
  return rulesMap[ruleType]
}

export function getRuleName(ruleType: string): string {
  return rulesMap[ruleType]?.name ?? formatRuleType(ruleType)
}

export function getRuleDescription(ruleType: string): string {
  return rulesMap[ruleType]?.description ?? 'Regla personalizada'
}

export function getRuleIcon(ruleType: string) {
  return rulesMap[ruleType]?.icon ?? HelpCircle
}

export function getRuleColors(ruleType: string): { bgColor: string; borderColor: string } {
  const rule = rulesMap[ruleType]
  return {
    bgColor: rule?.bgColor ?? 'bg-gray-50',
    borderColor: rule?.borderColor ?? 'border-gray-200',
  }
}
