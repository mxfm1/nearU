'use client';

import { useQuery } from '@tanstack/react-query';
import { catalogoApi } from '@/lib/catalogo-api';

export function useCategorias() {
  return useQuery({
    queryKey: ['categorias'],
    queryFn: () => catalogoApi.categorias(),
    select: (res) => res?.data,
  });
}

export function useRegiones() {
  return useQuery({
    queryKey: ['regiones'],
    queryFn: () => catalogoApi.regiones(),
    select: (res) => res.data,
  });
}
