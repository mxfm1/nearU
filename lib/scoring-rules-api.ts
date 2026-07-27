import { apiFetch } from './api-client';

// --- Types ---

export type ScoringRule = {
  id: string;
  eventId: string;
  ruleType: string;
  weight: number;
  config: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
};

export type ScoringRuleOption = {
  ruleType: string;
  name?: string;
  description: string;
  icon?: string;
  group?: string;
};

export type Region = {
  id: string;
  name: string;
};

// --- Payloads ---

export type CreateScoringRuleItem = {
  ruleType: string;
  weight: number;
};

export type CreateScoringRulesPayload = {
  rules: CreateScoringRuleItem[];
};

// --- Cache ---

const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
    return entry.data as T;
  }
  cache.delete(key);
  return null;
}

function setCache(key: string, data: unknown): void {
  cache.set(key, { data, timestamp: Date.now() });
}

// --- API Client ---

async function fetchWithCache<T>(path: string, cacheKey: string): Promise<T> {
  const cached = getCached<T>(cacheKey);
  if (cached) return cached;

  const result = await apiFetch<T>(path);
  setCache(cacheKey, result);
  return result;
}

export const scoringRulesApi = {
  create: (eventId: string, rules: { ruleType: string; weight: number }[]) =>
    apiFetch<{ success: boolean; data: ScoringRule[] }>(`/events/${eventId}/scoring-rules`, {
      method: 'POST',
      body: JSON.stringify({ rules }),
    }),

  getByEventId: (eventId: string) =>
    apiFetch<{ success: boolean; data: ScoringRule[] }>(`/events/${eventId}/scoring-rules`),

  delete: (eventId: string, ruleId: string) =>
    apiFetch<{ success: boolean }>(`/events/${eventId}/scoring-rules/${ruleId}`, {
      method: 'DELETE',
    }),

  getAvailableRules: () =>
    fetchWithCache<{ success: boolean; data: ScoringRuleOption[] }>(
      '/scoring-rules/catalog',
      'available-rules'
    ),

  getRegions: () => fetchWithCache<{ success: boolean; data: Region[] }>('/regions', 'regions'),
};
