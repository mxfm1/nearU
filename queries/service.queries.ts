import { queryOptions } from "@tanstack/react-query";
import { serviciosApi } from "@/lib/servicios-api";

export const ServicesQueryOptions = () =>
    queryOptions({
        queryKey: ['servicios'],
        queryFn: serviciosApi.list,
        select: (res) => res?.data
    })