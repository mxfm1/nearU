// --- Application Rules Mapper ---
// Maps backend ruleType → frontend input configuration
// Used by the application form to dynamically render the correct input type

export type InputType = 'toggle' | 'number' | 'text' | 'select' | 'auto';

export type RuleFieldConfig = {
  ruleType: string;
  inputType: InputType;
  label: string;
  placeholder?: string;
  description?: string;
  group: 'perfil' | 'ubicacion' | 'historial' | 'premium' | 'custom';
  autoEvaluate: boolean;
  min?: number;
  max?: number;
  step?: number;
  options?: { label: string; value: string | number }[];
};

// --- Auto-evaluated rules (not rendered in form) ---
const AUTO_EVALUATED_RULES = new Set(['VERIFIED_PROFILE', 'SAME_REGION', 'IS_PREMIUM_COMPANY']);

// --- Rule configurations ---
const rulesConfig: Record<string, Omit<RuleFieldConfig, 'ruleType'>> = {
  HAS_PORTFOLIO: {
    inputType: 'toggle',
    label: 'Portafolio / Logo',
    description: '¿Tenés portfolio?',
    group: 'perfil',
    autoEvaluate: false,
  },
  YEARS_EXPERIENCE: {
    inputType: 'number',
    label: 'Años de experiencia',
    placeholder: 'Ej: 5',
    group: 'perfil',
    autoEvaluate: false,
    min: 0,
    max: 50,
    step: 1,
  },
  HAS_WEBSITE: {
    inputType: 'toggle',
    label: 'Sitio web',
    description: '¿Tenés sitio web?',
    group: 'perfil',
    autoEvaluate: false,
  },
  HAS_SOCIAL_LINKS: {
    inputType: 'toggle',
    label: 'Redes sociales',
    description: '¿Tenés redes sociales?',
    group: 'perfil',
    autoEvaluate: false,
  },
  HAS_COMPANY_DESCRIPTION: {
    inputType: 'toggle',
    label: 'Descripción de la empresa',
    description: '¿Tenés descripción empresarial?',
    group: 'perfil',
    autoEvaluate: false,
  },
  HAS_LOGO: {
    inputType: 'toggle',
    label: 'Logo',
    description: '¿Tenés logo?',
    group: 'perfil',
    autoEvaluate: false,
  },
  HAS_BANNER: {
    inputType: 'toggle',
    label: 'Banner',
    description: '¿Tenés banner?',
    group: 'perfil',
    autoEvaluate: false,
  },
  HAS_PREVIOUS_FEEDBACK: {
    inputType: 'toggle',
    label: 'Feedback previo',
    description: '¿Tenés feedback previo?',
    group: 'historial',
    autoEvaluate: false,
  },
  AVERAGE_RATING: {
    inputType: 'number',
    label: 'Calificación promedio',
    placeholder: 'Ej: 4.5',
    group: 'historial',
    autoEvaluate: false,
    min: 0,
    max: 5,
    step: 0.1,
  },
  NUMBER_OF_COMPLETED_JOBS: {
    inputType: 'number',
    label: 'Trabajos completados',
    placeholder: 'Ej: 12',
    group: 'historial',
    autoEvaluate: false,
    min: 0,
    max: 9999,
    step: 1,
  },
  NUMBER_OF_COMPLETED_EVENTS: {
    inputType: 'number',
    label: 'Eventos completados',
    placeholder: 'Ej: 3',
    group: 'historial',
    autoEvaluate: false,
    min: 0,
    max: 9999,
    step: 1,
  },
  HAS_RESPONSE_HISTORY: {
    inputType: 'toggle',
    label: 'Historial de respuestas',
    description: '¿Tenés historial de respuestas?',
    group: 'historial',
    autoEvaluate: false,
  },
  FAST_RESPONSE_TIME: {
    inputType: 'toggle',
    label: 'Tiempo de respuesta rápido',
    description: '¿Tu tiempo de respuesta es rápido?',
    group: 'historial',
    autoEvaluate: false,
  },
  CUSTOM_FIELD_MATCH: {
    inputType: 'text',
    label: 'Campo personalizado',
    placeholder: 'Ingresa tu respuesta',
    group: 'custom',
    autoEvaluate: false,
  },
};

// --- Helper functions ---

export function isAutoEvaluated(ruleType: string): boolean {
  return AUTO_EVALUATED_RULES.has(ruleType);
}

export function getRuleFieldConfig(ruleType: string): RuleFieldConfig {
  const config = rulesConfig[ruleType];
  if (config) {
    return { ruleType, ...config };
  }

  // Fallback for unknown rule types
  return {
    ruleType,
    inputType: 'text',
    label: formatRuleType(ruleType),
    placeholder: 'Ingresa tu respuesta',
    group: 'custom',
    autoEvaluate: false,
  };
}

export function getRenderableRules(ruleTypes: string[]): RuleFieldConfig[] {
  return ruleTypes.filter((rt) => !isAutoEvaluated(rt)).map(getRuleFieldConfig);
}

function formatRuleType(ruleType: string): string {
  return ruleType
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}
