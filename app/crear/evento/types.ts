import type { Categoria, Region } from '@/lib/catalogo-api';
import type { CreateEventoPayload } from '@/lib/eventos-api';

export interface CrearEventoData {
  categorias: Categoria[];
  categoriasLoading: boolean;
  categoriasError: boolean;
  regiones: Region[];
  regionesLoading: boolean;
  regionesError: boolean;
}

export interface CrearEventoFormProps {
  categorias: Categoria[];
  regiones: Region[];
  onChange: (field: string, value: unknown) => void;
  thumbnailUrl: string;
  bannerUrl: string;
  locationError?: string | null;
}

export type { CreateEventoPayload };
