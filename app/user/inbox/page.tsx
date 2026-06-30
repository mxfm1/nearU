'use client'

import { useState } from 'react'
import { Search, ChevronRight } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Pagination } from '@/components/ui/pagination'

const MOCK_MESSAGES = [
  {
    id: 1,
    title: 'Solicitud de Compostaje Industrial',
    company: 'EcoSoluciones S.A.',
    preview: 'Hola, nos gustaría solicitar un servicio de gestión de residuos orgánicos para nuestra planta norte. Necesitamos un presupuesto detallado para la próxima semana.',
    time: 'Hoy, 09:15',
    isNew: true,
    avatarBg: 'bg-amber-100',
    avatarIcon: '🌿',
  },
  {
    id: 2,
    title: 'Diseño de Paisajismo Nativo',
    company: 'Viridi Urbe.com',
    preview: 'Hola, nos gustaría conocer más sobre sus especies nativas para un proyecto de 500m2 en la zona norte. ¿Podemos agendar una visita técnica?',
    time: 'Hoy, 07:30',
    isNew: false,
    avatarBg: 'bg-emerald-100',
    avatarIcon: '🌳',
  },
  {
    id: 3,
    title: 'Consultoría Eficiencia Energética',
    company: 'Energía Limpia Ltda.',
    preview: 'Requerimos auditoría para el sello de sostenibilidad en nuestras oficinas centrales. Adjunto el historial de consumo de los últimos 6 meses.',
    time: 'Ayer, 14:30',
    isNew: false,
    avatarBg: 'bg-yellow-100',
    avatarIcon: '☀️',
  },
  {
    id: 4,
    title: 'Recolección de Aguas Grises',
    company: 'Desarrollo Sostenible S.A.',
    preview: 'Necesitamos cotización para un sistema modular de filtrado. ¿Qué capacidad máxima manejan por día para uso industrial?',
    time: 'Lunes',
    isNew: false,
    avatarBg: 'bg-blue-100',
    avatarIcon: '💧',
  },
  {
    id: 5,
    title: 'Insumos para Huertos Urbanos',
    company: 'Terracultiva',
    preview: 'Estamos interesados en un alacena para distribuir sus kits de cultivo en nuestras tiendas locales. Quisieramos revisar su lista de precios mayorista.',
    time: '24 May',
    isNew: false,
    avatarBg: 'bg-green-100',
    avatarIcon: '🌱',
  },
  {
    id: 6,
    title: 'Reciclaje de Plásticos Tipo 2 y 4',
    company: 'Plastiopia',
    preview: 'Confirmamos la recepción de los últimos lotes enviados. El reporte de trazabilidad ya está disponible en su perfil para descarga.',
    time: '22 May',
    isNew: false,
    avatarBg: 'bg-teal-100',
    avatarIcon: '♻️',
  },
  {
    id: 7,
    title: 'Educación Ambiental Corporativa',
    company: 'Fundación Planeta Vivo',
    preview: 'Nos gustaría agendar un taller colaborativo para el mes de la Tierra. Contamos con un espacio para 50 personas y recursos audiovisuales.',
    time: '20 May',
    isNew: false,
    avatarBg: 'bg-lime-100',
    avatarIcon: '📚',
  },
  {
    id: 8,
    title: 'Reforestación Voluntaria',
    company: 'EcoConexión',
    preview: 'Gracias por participar en la última jornada. Los árboles ya están geo-localizados. Puedes ver el mapa de impacto en el siguiente enlace...',
    time: '18 May',
    isNew: false,
    avatarBg: 'bg-emerald-100',
    avatarIcon: '🌲',
  },
]

const ITEMS_PER_PAGE = 5

export default function InboxPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredMessages = MOCK_MESSAGES.filter(
    (msg) =>
      msg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.company.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const totalPages = Math.ceil(filteredMessages.length / ITEMS_PER_PAGE)
  const paginatedMessages = filteredMessages.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <p className="text-sm text-muted-foreground mb-1">Panel &gt; Mensajes</p>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Inbox</h1>
              <p className="text-muted-foreground mt-1">
                Gestiona las solicitudes y conversaciones de servicios ambientales.
                <br />
                Recibiste 8 nuevos mensajes esta semana.
              </p>
            </div>
            <div className="relative w-64 shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar mensajes..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                className="pl-9"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {paginatedMessages.map((msg) => (
            <div
              key={msg.id}
              className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border hover:shadow-md transition-shadow cursor-pointer group"
            >
              <div
                className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-xl ${msg.avatarBg}`}
              >
                {msg.avatarIcon}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-foreground truncate">{msg.title}</h3>
                  {msg.isNew && (
                    <Badge className="bg-brand text-white text-[10px] px-1.5 py-0 shrink-0">
                      NUEVO
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">Empresa: {msg.company}</p>
                <p className="text-sm text-muted-foreground truncate mt-0.5">{msg.preview}</p>
              </div>

              <div className="shrink-0 flex flex-col items-end gap-2">
                <span className="text-xs text-muted-foreground whitespace-nowrap">{msg.time}</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-brand transition-colors" />
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            className="mt-8"
          />
        )}
      </div>
    </div>
  )
}
