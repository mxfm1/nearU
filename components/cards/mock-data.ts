export interface MockProvider {
  name: string
  category: string
  verified: boolean
  location: string
  thumbnail: string
  slug: string
}

export interface MockEvent {
  title: string
  description: string
  date: string
  location: string
  thumbnail: string
  slug: string
}

export const mockProviders: MockProvider[] = [
  {
    name: 'Producciones del Sur',
    category: 'Producción de Eventos',
    verified: true,
    location: 'Santiago, RM',
    thumbnail: 'https://picsum.photos/seed/producciones-sur/400/300',
    slug: 'producciones-del-sur',
  },
  {
    name: 'Catering Santiago',
    category: 'Catering & Banquetes',
    verified: true,
    location: 'Santiago, RM',
    thumbnail: 'https://picsum.photos/seed/catering-santiago/400/300',
    slug: 'catering-santiago',
  },
  {
    name: 'Iluminación Pro',
    category: 'Iluminación',
    verified: false,
    location: 'Viña del Mar',
    thumbnail: 'https://picsum.photos/seed/iluminacion-pro/400/300',
    slug: 'iluminacion-pro',
  },
  {
    name: 'Sonido Total',
    category: 'Sonido & Audio',
    verified: true,
    location: 'Santiago, RM',
    thumbnail: 'https://picsum.photos/seed/sonido-total/400/300',
    slug: 'sonido-total',
  },
  {
    name: 'Decoración & Estilo',
    category: 'Decoración',
    verified: false,
    location: 'Providencia',
    thumbnail: 'https://picsum.photos/seed/decoracion-estilo/400/300',
    slug: 'decoracion-estilo',
  },
  {
    name: 'FotoEventos Chile',
    category: 'Fotografía',
    verified: true,
    location: 'Las Condes',
    thumbnail: 'https://picsum.photos/seed/fotoeventos/400/300',
    slug: 'fotoeventos-chile',
  },
  {
    name: 'StreamLab',
    category: 'Streaming & Transmisión',
    verified: true,
    location: 'Santiago, RM',
    thumbnail: 'https://picsum.photos/seed/streamlab/400/300',
    slug: 'streamlab',
  },
  {
    name: 'Escenario Events',
    category: 'Producción de Eventos',
    verified: false,
    location: 'Concepción',
    thumbnail: 'https://picsum.photos/seed/escenario-events/400/300',
    slug: 'escenario-events',
  },
]

export const mockEvents: MockEvent[] = [
  {
    title: 'Feria de Proveedores 2026',
    description:
      'El encuentro más grande de proveedores para eventos corporativos y sociales. Más de 200 expositores y networking exclusivo.',
    date: '15-17 Oct 2026',
    location: 'Espacio Riesco, Santiago',
    thumbnail: 'https://picsum.photos/seed/feria-proveedores/400/250',
    slug: 'feria-de-proveedores-2026',
  },
  {
    title: 'Congreso de Innovación Empresarial',
    description:
      'Tres días de charlas, talleres y paneles con líderes de la industria. Innovación, tecnología y tendencias para tu negocio.',
    date: '5-7 Nov 2026',
    location: 'Centro de Convenciones, Santiago',
    thumbnail: 'https://picsum.photos/seed/congreso-innovacion/400/250',
    slug: 'congreso-innovacion-empresarial',
  },
  {
    title: 'Expo Bodas 2026',
    description:
      'La feria de bodas más importante del año. Todo lo que necesitas para el día perfecto en un solo lugar.',
    date: '12-13 Dic 2026',
    location: 'Hotel W, Santiago',
    thumbnail: 'https://picsum.photos/seed/expo-bodas/400/250',
    slug: 'expo-bodas-2026',
  },
  {
    title: 'Festival de la Cerveza Artesanal',
    description:
      'Degustación de más de 50 cervezas artesanales chilenas, food trucks y música en vivo.',
    date: '22-24 Ene 2027',
    location: 'Parque Bicentenario, Santiago',
    thumbnail: 'https://picsum.photos/seed/festival-cerveza/400/250',
    slug: 'festival-cerveza-artesanal',
  },
  {
    title: 'Workshop de Marketing Digital',
    description:
      'Aprende las últimas estrategias de marketing digital para potenciar tu marca. Sesiones prácticas con expertos.',
    date: '8 Mar 2027',
    location: 'CoWork Providencia',
    thumbnail: 'https://picsum.photos/seed/workshop-marketing/400/250',
    slug: 'workshop-marketing-digital',
  },
  {
    title: 'Lanzamiento de Temporada Teatro',
    description:
      'Gran gala de lanzamiento de la temporada 2027 con obras nacionales e internacionales.',
    date: '3 Feb 2027',
    location: 'Teatro Municipal, Santiago',
    thumbnail: 'https://picsum.photos/seed/lanzamiento-teatro/400/250',
    slug: 'lanzamiento-temporada-teatro',
  },
  {
    title: 'Seminario de Sostenibilidad',
    description:
      'Expertos en sostenibilidad empresarial comparten casos de éxito y herramientas para implementar prácticas verdes.',
    date: '20 Abr 2027',
    location: 'Centro Cultural GAM',
    thumbnail: 'https://picsum.photos/seed/seminario-sostenibilidad/400/250',
    slug: 'seminario-sostenibilidad',
  },
  {
    title: 'Noche de la Gastronomía',
    description:
      'Los mejores chefs del país se reúnen para una noche de alta cocina con maridaje de vinos chilenos.',
    date: '14 May 2027',
    location: 'Barrio Bellavista, Santiago',
    thumbnail: 'https://picsum.photos/seed/noche-gastronomia/400/250',
    slug: 'noche-de-la-gastronomia',
  },
]
