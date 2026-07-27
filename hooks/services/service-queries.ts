'use client';

import { useQuery } from '@tanstack/react-query';
import { catalogoApi } from '@/lib/catalogo-api';

export function useCategoriasServicio() {
  return useQuery({
    queryKey: ['categorias', 'service'],
    queryFn: () => catalogoApi.categorias('service'),
    select: (res) => res?.data,
  });
}

export function useUbicaciones() {
  return useQuery({
    queryKey: ['ubicaciones'],
    queryFn: () => catalogoApi.ubicaciones(),
    select: (res) => res?.data,
  });
}
