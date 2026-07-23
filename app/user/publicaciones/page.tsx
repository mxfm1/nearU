'use client'

import Link from 'next/link'
import { Loader2, AlertTriangle, Plus, MapPin, Tag, Eye, Edit3, Calendar } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { serviciosApi, type ServicioResumen } from '@/lib/servicios-api'
import { eventosApi, type EventoResumen } from '@/lib/eventos-api'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ServiceStatusBadge } from '@/components/ui/service-status-badge'
import { useAuth } from '@/hooks/use-auth'

function ServicioCard({ servicio }: { servicio: ServicioResumen }) {
    return (
        <Link href={`/user/publicaciones/${servicio.id}`}>
            <Card className="group flex flex-col sm:flex-row gap-4 p-4 hover:shadow-md transition-all duration-200 cursor-pointer rounded-lg">
                <div className="w-full sm:w-40 h-32 sm:h-auto sm:self-stretch overflow-hidden bg-muted flex-shrink-0">
                    {servicio.thumbnailUrl ? (
                        <img
                            src={servicio.thumbnailUrl}
                            alt={servicio.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground/40">
                            <Eye className="h-8 w-8" />
                        </div>
                    )}
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-between gap-2">
                    <div className="space-y-1">
                        <div className="flex items-start justify-between gap-2">
                            <h3 className="font-semibold text-foreground truncate">{servicio.title}</h3>
                            <ServiceStatusBadge status={servicio.status?.slug ?? 'draft'} className="flex-shrink-0" />
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{servicio.description}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        {servicio.location?.name && (
                            <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {servicio.location.name}
                            </span>
                        )}
                        {servicio.category?.name && (
                            <span className="flex items-center gap-1">
                                <Tag className="h-3 w-3" />
                                {servicio.category.name}
                            </span>
                        )}
                        <span className="flex items-center gap-1 ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-brand">
                            <Edit3 className="h-3 w-3" />
                            Editar
                        </span>
                    </div>
                </div>
            </Card>
        </Link>
    )
}

function EventoCard({ evento }: { evento: EventoResumen }) {
    return (
        <Link href={`/user/publicaciones/evento/${evento.id}`}>
            <Card className="group flex flex-col sm:flex-row gap-4 p-4 hover:shadow-md transition-all duration-200 cursor-pointer rounded-lg">
                <div className="w-full sm:w-40 h-32 sm:h-auto sm:self-stretch overflow-hidden bg-muted flex-shrink-0">
                    {evento.thumbnailUrl ? (
                        <img
                            src={evento.thumbnailUrl}
                            alt={evento.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground/40">
                            <Eye className="h-8 w-8" />
                        </div>
                    )}
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-between gap-2">
                    <div className="space-y-1">
                        <div className="flex items-start justify-between gap-2">
                            <h3 className="font-semibold text-foreground truncate">{evento.title}</h3>
                            <ServiceStatusBadge status={((evento as any).status?.slug ?? (evento as any).eventStatus) ?? 'draft'} className="flex-shrink-0" />
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{evento.description}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        {evento.location && (
                            <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {evento.location.name}
                            </span>
                        )}
                        {evento.category && (
                            <span className="flex items-center gap-1">
                                <Tag className="h-3 w-3" />
                                {evento.category.name}
                            </span>
                        )}
                        {evento.startAt && (
                            <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(evento.startAt).toLocaleDateString('es-ES', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                })}
                            </span>
                        )}
                        <span className="flex items-center gap-1 ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-brand">
                            <Edit3 className="h-3 w-3" />
                            Ver
                        </span>
                    </div>
                </div>
            </Card>
        </Link>
    )
}

export default function MisPublicacionesPage() {
    const { user, loading: authLoading } = useAuth()

    const serviciosQuery = useQuery({
        queryKey: ['mis-servicios'],
        queryFn: () => serviciosApi.misServicios(),
        enabled: !!user,
    })

    const eventosQuery = useQuery({
        queryKey: ['mis-eventos'],
        queryFn: () => eventosApi.misEventos(),
        enabled: !!user,
    })

    const servicios = serviciosQuery.data?.data ?? []
    const eventos = eventosQuery.data?.data ?? []
    const bothLoaded = !serviciosQuery.isLoading && !eventosQuery.isLoading

    // --- Auth loading ---
    if (authLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-brand" />
            </div>
        )
    }

    // --- No user ---
    if (!user) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <div className="text-center max-w-md">
                    <h2 className="text-xl font-bold text-foreground mb-2">Iniciá sesión</h2>
                    <p className="text-sm text-muted-foreground mb-6">
                        Necesitás iniciar sesión para ver tus publicaciones.
                    </p>
                    <Button asChild className="bg-brand text-brand-foreground hover:bg-brand/90">
                        <Link href="/auth/login">Iniciar sesión</Link>
                    </Button>
                </div>
            </div>
        )
    }

    // --- Empty state (only when both queries have finished) ---
    if (bothLoaded && servicios.length === 0 && eventos.length === 0) {
        return (
            <div className="min-h-screen bg-background">
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">Mis publicaciones</h1>
                            <p className="text-sm text-muted-foreground mt-1">0 servicios · 0 eventos</p>
                        </div>
                        <Button asChild className="bg-brand hover:bg-brand/90 text-white">
                            <Link href="/crear">
                                <Plus className="h-4 w-4 mr-2" />
                                Nueva publicación
                            </Link>
                        </Button>
                    </div>

                    <div className="text-center py-16">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mx-auto mb-4">
                            <Eye className="h-8 w-8 text-muted-foreground/40" />
                        </div>
                        <h2 className="text-lg font-semibold text-foreground mb-2">Aún no tenés publicaciones</h2>
                        <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
                            Creá tu primer servicio o evento para que otras empresas te encuentren.
                        </p>
                        <Button asChild className="bg-brand hover:bg-brand/90 text-white">
                            <Link href="/crear">
                                <Plus className="h-4 w-4 mr-2" />
                                Crear publicación
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Mis publicaciones</h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            {servicios.length} servicio{servicios.length !== 1 ? 's' : ''} · {eventos.length} evento{eventos.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                    <Button asChild className="bg-brand hover:bg-brand/90 text-white">
                        <Link href="/crear">
                            <Plus className="h-4 w-4 mr-2" />
                            Nueva publicación
                        </Link>
                    </Button>
                </div>

                {/* Mis servicios */}
                <section className="mb-12">
                    <h2 className="text-lg font-semibold text-foreground mb-4">Mis servicios</h2>

                    {serviciosQuery.isLoading && (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-6 w-6 animate-spin text-brand" />
                        </div>
                    )}

                    {serviciosQuery.isError && (
                        <div className="flex items-center gap-2 p-4 rounded-md bg-destructive/10 text-destructive text-sm">
                            <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                            <span>
                                {serviciosQuery.error instanceof Error
                                    ? serviciosQuery.error.message
                                    : 'Error al cargar servicios.'}
                            </span>
                        </div>
                    )}

                    {!serviciosQuery.isLoading && !serviciosQuery.isError && servicios.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-sm text-muted-foreground">Aún no tenés servicios publicados.</p>
                        </div>
                    )}

                    {!serviciosQuery.isLoading && servicios.length > 0 && (
                        <div className="grid grid-cols-1 gap-4">
                            {servicios.map((servicio) => (
                                <ServicioCard key={servicio.id} servicio={servicio} />
                            ))}
                        </div>
                    )}
                </section>

                {/* Mis eventos */}
                <section>
                    <h2 className="text-lg font-semibold text-foreground mb-4">Mis eventos</h2>

                    {eventosQuery.isLoading && (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-6 w-6 animate-spin text-brand" />
                        </div>
                    )}

                    {eventosQuery.isError && (
                        <div className="flex items-center gap-2 p-4 rounded-md bg-destructive/10 text-destructive text-sm">
                            <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                            <span>
                                {eventosQuery.error instanceof Error
                                    ? eventosQuery.error.message
                                    : 'Error al cargar eventos.'}
                            </span>
                        </div>
                    )}

                    {!eventosQuery.isLoading && !eventosQuery.isError && eventos.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-sm text-muted-foreground">Aún no tenés eventos creados.</p>
                        </div>
                    )}

                    {!eventosQuery.isLoading && eventos.length > 0 && (
                        <div className="grid grid-cols-1 gap-4">
                            {eventos.map((evento) => (
                                <EventoCard key={evento.id} evento={evento} />
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    )
}
