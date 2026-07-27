'use client';

import { useQuery } from '@tanstack/react-query';
import { catalogoApi } from '@/lib/catalogo-api';

export function useCategoriasEvento() {
  return useQuery({
    queryKey: ['categorias', 'event'],
    queryFn: () => catalogoApi.categorias('event'),
    select: (res) => res?.data,
  });
}

export function useRegiones() {
  return useQuery({
    queryKey: ['regiones'],
    queryFn: () => catalogoApi.regiones(),
    select: (res) => res?.data,
  });
}
