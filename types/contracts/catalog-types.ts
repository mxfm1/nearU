import type { paths } from './api-contracts-types';

// ─── Categorías ─────────────────────────────────────────────────

type CategoriasGet = paths['/api/categorias']['get'];
export type Categoria = NonNullable<
  CategoriasGet['responses']['200']['content']['application/json']['data']
>[number];

// ─── Regiones ─────────────────────────────────────────────────

type RegionesGet = paths['/api/regiones']['get'];
export type Region = NonNullable<
  RegionesGet['responses']['200']['content']['application/json']['data']
>[number];
