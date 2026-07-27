'use client';

import { useQuery } from '@tanstack/react-query';
import { catalogoApi, type Region } from '@/lib/catalogo-api';

export function useRegiones() {
  return useQuery({
    queryKey: ['regiones'],
    queryFn: () => catalogoApi.regiones(),
    select: (res) => res.data,
  });
}
