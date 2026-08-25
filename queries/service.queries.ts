import { queryOptions } from '@tanstack/react-query';
import { serviciosApi, type ServiciosListParams } from '@/lib/servicios-api';

export const ServicesQueryOptions = (params?: ServiciosListParams) =>
  queryOptions({
    queryKey: ['servicios', params],
    queryFn: () => serviciosApi.list(params),
    select: (res) => res?.data,
  });
