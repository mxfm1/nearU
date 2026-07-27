export interface MockContactInfo {
  type: 'email' | 'telefono' | 'whatsapp' | 'website' | 'instagram' | 'facebook' | 'twitter';
  value: string;
}

export interface MockPortfolioImage {
  url: string;
  title: string;
  description: string;
}

export interface MockServiceDetail {
  id: string;
  companyName: string;
  title: string;
  description: string;
  categoryName: string;
  location: string;
  bannerImg: string;
  logoImg: string;
  contactInformation: MockContactInfo[];
  portfolio: MockPortfolioImage[];
  serviceStatus: 'ACTIVE' | 'PAUSED' | 'DRAFT' | 'ARCHIVED';
}

export const mockServiceDetails: MockServiceDetail[] = [
  {
    id: 'producciones-del-sur',
    companyName: 'Producciones del Sur',
    title: 'Producción Integral de Eventos Corporativos',
    description:
      'Ofrecemos producción completa para eventos corporativos, sociales y culturales. Contamos con más de 15 años de experiencia en el mercado chileno, coordinando cada detalle desde la planificación hasta la ejecución. Nuestro equipo de profesionales garantiza resultados impecables en cada evento.',
    categoryName: 'Producción de Eventos',
    location: 'Santiago, RM',
    bannerImg: 'https://picsum.photos/seed/producciones-sur-banner/1200/400',
    logoImg: 'https://picsum.photos/seed/producciones-sur-logo/200/200',
    contactInformation: [
      { type: 'email', value: 'contacto@produccionesdelsur.cl' },
      { type: 'telefono', value: '+56 9 1234 5678' },
      { type: 'website', value: 'www.produccionesdelsur.cl' },
      { type: 'instagram', value: '@produccionesdelsur' },
    ],
    portfolio: [
      {
        url: 'https://picsum.photos/seed/producciones-sur-1/800/600',
        title: 'Gala Anual Corpbanca 2025',
        description:
          'Producción integral del evento corporativo anual con 800 asistentes en el Centro de Convenciones. Incluyó montaje de escenario, iluminación escénica, sonido profesional y coordinación logística completa.',
      },
      {
        url: 'https://picsum.photos/seed/producciones-sur-2/800/600',
        title: 'Lanzamiento Producto TechCorp',
        description:
          'Evento de lanzamiento con 300 invitados, show en vivo, catering de primer nivel y activaciones de marca. Transmisión en vivo para audiencia remota.',
      },
      {
        url: 'https://picsum.photos/seed/producciones-sur-3/800/600',
        title: 'Feria Expo Constructor 2026',
        description:
          'Stand de 200m² con diseño personalizado, pantallas interactivas, zona de networking y área de presentaciones. Más de 5.000 visitantes durante los 3 días.',
      },
      {
        url: 'https://picsum.photos/seed/producciones-sur-4/800/600',
        title: 'Boda de Alta Gama en Viña',
        description:
          'Coordinación completa de boda para 250 invitados en terraza con vista al mar. Decoración floral, iluminación ambiental, banda en vivo y banquete de 5 tiempos.',
      },
      {
        url: 'https://picsum.photos/seed/producciones-sur-5/800/600',
        title: 'Conferencia Internacional LATAM',
        description:
          'Organización de conferencia con 1.200 asistentes de 15 países. Traducción simultánea, streaming multi-cámara, plataforma de networking digital y producción de contenidos.',
      },
      {
        url: 'https://picsum.photos/seed/producciones-sur-6/800/600',
        title: 'Activación Marca Deportiva',
        description:
          'Activación de marca en espacio público con 10 estaciones interactivas, competencias en vivo, zona de influencers y producción audiovisual para redes sociales.',
      },
    ],
    serviceStatus: 'ACTIVE',
  },
  {
    id: 'catering-santiago',
    companyName: 'Catering Santiago',
    title: 'Servicio de Catering para Eventos',
    description:
      'Expertos en banquetería y catering para todo tipo de eventos. Menús personalizados con ingredientes frescos y de temporada. Desde cócteles corporativos hasta cenas de gala, nuestro equipo culinario crea experiencias gastronómicas inolvidables.',
    categoryName: 'Catering & Banquetes',
    location: 'Santiago, RM',
    bannerImg: 'https://picsum.photos/seed/catering-santiago-banner/1200/400',
    logoImg: 'https://picsum.photos/seed/catering-santiago-logo/200/200',
    contactInformation: [
      { type: 'email', value: 'reservas@cateringsantiago.cl' },
      { type: 'telefono', value: '+56 2 2345 6789' },
      { type: 'whatsapp', value: '+56 9 8765 4321' },
    ],
    portfolio: [
      {
        url: 'https://picsum.photos/seed/catering-santiago-1/800/600',
        title: 'Cena de Gala Municipalidad 2025',
        description:
          'Servicio de cena para 600 invitados con menú de 4 tiempos, maridaje de vinos chilenos y postres artesanales. Incluyó coordinación de dietary restrictions y presentación artística.',
      },
      {
        url: 'https://picsum.photos/seed/catering-santiago-2/800/600',
        title: 'Cóctel Corporativo BCI',
        description:
          'Cóctel de networking para 400 ejecutivos con estaciones de comida en vivo, bar de autor y canapés de alta cocina. Decoración temática alineada con la marca.',
      },
      {
        url: 'https://picsum.photos/seed/catering-santiago-3/800/600',
        title: 'Boda Campestre en Pirque',
        description:
          'Banquete al aire libre para 200 invitados con parrilla gourmet, bar de ensaladas, jugos naturales y torta de 5 pisos. Servicio de garzones y coordinación de tiempo real.',
      },
      {
        url: 'https://picsum.photos/seed/catering-santiago-4/800/600',
        title: 'Lanzamiento Vino Premium',
        description:
          'Maridaje exclusivo para lanzamiento de cosecha limitada. 5 tiempos con vinos de la bodega, tabla de quesos internacionales y degustación guiada por sommelier.',
      },
      {
        url: 'https://picsum.photos/seed/catering-santiago-5/800/600',
        title: 'Evento Fin de Año Minera Escondida',
        description:
          'Cena de fin de año para 1.000 trabajadores con show artístico, cena buffet internacional, barra libre y sorteo de premios. Coordinación logística en faena minera.',
      },
    ],
    serviceStatus: 'ACTIVE',
  },
  {
    id: 'iluminacion-pro',
    companyName: 'Iluminación Pro',
    title: 'Diseño e Instalación de Iluminación Escénica',
    description:
      'Soluciones profesionales de iluminación para eventos, conciertos y producciones audiovisuales. Ofrecemos diseño personalizado, equipamiento de última generación y montaje profesional. Transformamos cualquier espacio con efectos lumínicos únicos.',
    categoryName: 'Iluminación',
    location: 'Viña del Mar',
    bannerImg: 'https://picsum.photos/seed/iluminacion-pro-banner/1200/400',
    logoImg: 'https://picsum.photos/seed/iluminacion-pro-logo/200/200',
    contactInformation: [
      { type: 'email', value: 'ventas@iluminacionpro.cl' },
      { type: 'website', value: 'www.iluminacionpro.cl' },
      { type: 'instagram', value: '@iluminacionpro' },
    ],
    portfolio: [
      {
        url: 'https://picsum.photos/seed/iluminacion-pro-1/800/600',
        title: 'Festival Internacional Viña del Mar',
        description:
          'Diseño e instalación de iluminación escénica para la Quinta Vergara. 200 fixtures robóticos, led wall de 100m² y sistema de control DMX para 8 noches de festival.',
      },
      {
        url: 'https://picsum.photos/seed/iluminacion-pro-2/800/600',
        title: 'Lanzamiento Automotriz BMW',
        description:
          'Iluminación arquitectónica y escénica para lanzamiento de modelo en showroom. Efectos dinámicos con 50 proyectores láser, cortinas de luz y mapping 3D sobre el vehículo.',
      },
      {
        url: 'https://picsum.photos/seed/iluminacion-pro-3/800/600',
        title: 'Teatro Municipal Temporada 2025',
        description:
          'Renovación del sistema de iluminación para 12 obras de la temporada. Instalación de dimmers LED, perfiles de última generación y consola ETC para control preciso.',
      },
      {
        url: 'https://picsum.photos/seed/iluminacion-pro-4/800/600',
        title: 'Concierto Rock en Movistar Arena',
        description:
          'Montaje de iluminación para concierto con 12 bandas nacionales. 150 cabezas móviles, barras de luz LED, seguidores y efecto de humo sincronizado con la música.',
      },
    ],
    serviceStatus: 'ACTIVE',
  },
  {
    id: 'sonido-total',
    companyName: 'Sonido Total',
    title: 'Alquiler de Equipos de Sonido Profesional',
    description:
      'Rentamos equipos de sonido profesional para eventos de todo tamaño. Contamos con sistemas de audio de alta fidelidad, monitoreo in-ear, consolas digitales y técnicos especializados. Cobertura en todo Chile.',
    categoryName: 'Sonido & Audio',
    location: 'Santiago, RM',
    bannerImg: 'https://picsum.photos/seed/sonido-total-banner/1200/400',
    logoImg: 'https://picsum.photos/seed/sonido-total-logo/200/200',
    contactInformation: [
      { type: 'email', value: 'info@sonidototal.cl' },
      { type: 'telefono', value: '+56 2 3456 7890' },
      { type: 'whatsapp', value: '+56 9 9876 5432' },
      { type: 'facebook', value: 'SonidoTotalCL' },
    ],
    portfolio: [
      {
        url: 'https://picsum.photos/seed/sonido-total-1/800/600',
        title: 'Lollapalooza Chile 2026',
        description:
          'Sonido para escenario secundario del festival. Sistema line array de 24 cajas por lado, 18 subwoofers, monitoreo in-ear para 12 bandas y consola digital con 64 canales.',
      },
      {
        url: 'https://picsum.photos/seed/sonido-total-2/800/600',
        title: 'Conferencia Anual Sofofa',
        description:
          'Sistema de audio para conferencia con 1.500 asistentes. Micrófonos inalámbricos, traducción simultánea para 4 idiomas, sonido ambiental y grabación multi-pista.',
      },
      {
        url: 'https://picsum.photos/seed/sonido-total-3/800/600',
        title: 'Fiesta de la Independencia',
        description:
          'Sonido para evento masivo al aire libre con 10.000 asistentes. 8 torres de sonido distribuidas, escenario principal con line array y sistema de delay para cobertura total.',
      },
      {
        url: 'https://picsum.photos/seed/sonido-total-4/800/600',
        title: 'Estudio de Grabación Rojo',
        description:
          'Acondicionamiento acústico e instalación de equipos para estudio de grabación profesional. Monitores de campo cercano, consola analógica y sistema de absorción acústica personalizado.',
      },
      {
        url: 'https://picsum.photos/seed/sonido-total-5/800/600',
        title: 'Corporativo Falabella Sostenibilidad',
        description:
          'Audio para evento corporativo en Teatro Municipal. Sistema de refuerzo de voz, micrófonos de solapa y atriles, con grabación en alta definición para archivo.',
      },
      {
        url: 'https://picsum.photos/seed/sonido-total-6/800/600',
        title: 'Matrimonio en Palacio Cousiño',
        description:
          'Sistema de sonido discreto para ceremonia y fiesta. Altavoces compactos de alta gama, micrófonos inalámbricos para oficiante y disc-jockey con equipo profesional.',
      },
    ],
    serviceStatus: 'ACTIVE',
  },
  {
    id: 'decoracion-estilo',
    companyName: 'Decoración & Estilo',
    title: 'Decoración Temática para Eventos',
    description:
      'Transformamos espacios en experiencias memorables. Especialistas en decoración temática para bodas, cumpleaños, eventos corporativos y lanzamientos. Trabajamos con materiales de alta calidad y tendencias actuales en diseño de interiores.',
    categoryName: 'Decoración',
    location: 'Providencia',
    bannerImg: 'https://picsum.photos/seed/decoracion-estilo-banner/1200/400',
    logoImg: 'https://picsum.photos/seed/decoracion-estilo-logo/200/200',
    contactInformation: [
      { type: 'email', value: 'contacto@decoracionestilo.cl' },
      { type: 'instagram', value: '@decoracion_estilo' },
      { type: 'website', value: 'www.decoracionestilo.cl' },
    ],
    portfolio: [
      {
        url: 'https://picsum.photos/seed/decoracion-estilo-1/800/600',
        title: 'Boda Romántica en Cajón del Maipo',
        description:
          'Decoración boho-chic para boda al aire libre con arco floral, mesas de madera reciclada, centros de mesa con velas y flores silvestres. Iluminación con guirnaldas cálidas.',
      },
      {
        url: 'https://picsum.photos/seed/decoracion-estilo-2/800/600',
        title: 'Cumpleaños Temático Años 20',
        description:
          'Ambientación art déco para fiesta de 80 invitados. Cortinas de terciopelo, mobiliario dorado, centro de mesa con plumas y lámparas colgantes. Foto 360 y cabina de disfraces.',
      },
      {
        url: 'https://picsum.photos/seed/decoracion-estilo-3/800/600',
        title: 'Lanzamiento Tienda Retail',
        description:
          'Diseño de vitrinas y decoración interior para apertura de tienda en mall. Flores naturales, letreros luminosos, mobiliario de exhibición y plantas verticales de 5 metros.',
      },
      {
        url: 'https://picsum.photos/seed/decoracion-estilo-4/800/600',
        title: 'Corporativo Navidad Entel',
        description:
          'Decoración navideña para edificio corporativo con árbol de 8 metros, pesebre, guirnaldas LED, esferas personalizadas y pista de patinaje ecológica en el patio central.',
      },
      {
        url: 'https://picsum.photos/seed/decoracion-estilo-5/800/600',
        title: 'Baby Shower Temático Safari',
        description:
          'Ambientación infantil con animales de la selva, globos en forma de árboles, mesa de postres decorada, puff y alfombras temáticas. Coordinación de juegos y recuerdos personalizados.',
      },
    ],
    serviceStatus: 'PAUSED',
  },
  {
    id: 'fotoeventos-chile',
    companyName: 'FotoEventos Chile',
    title: 'Fotografía y Video Profesional para Eventos',
    description:
      'Capturamos los momentos más importantes de tu evento con calidad profesional. Ofrecemos cobertura completa con fotografía, video aéreo con drones y edición cinematográfica. Entregamos tu contenido en 48 horas.',
    categoryName: 'Fotografía',
    location: 'Las Condes',
    bannerImg: 'https://picsum.photos/seed/fotoeventos-banner/1200/400',
    logoImg: 'https://picsum.photos/seed/fotoeventos-logo/200/200',
    contactInformation: [
      { type: 'email', value: 'hola@fotoeventos.cl' },
      { type: 'telefono', value: '+56 9 4567 8901' },
      { type: 'instagram', value: '@fotoeventos_chile' },
      { type: 'facebook', value: 'FotoEventosChile' },
    ],
    portfolio: [
      {
        url: 'https://picsum.photos/seed/fotoeventos-1/800/600',
        title: 'Boda de la Rivera',
        description:
          'Cobertura fotográfica completa con 2 fotógrafos, drone aéreo y video cinematográfico. Edición con perfil fílmico, album digital y libro de 80 páginas.',
      },
      {
        url: 'https://picsum.photos/seed/fotoeventos-2/800/600',
        title: 'Conferencia Patagonia Tech',
        description:
          'Cobertura de conferencia tecnológica con 30 speakers. Fotografía de retrato profesional, cobertura de paneles, video resumen de 3 minutos y transmisión en vivo multi-cámara.',
      },
      {
        url: 'https://picsum.photos/seed/fotoeventos-3/800/600',
        title: 'Maratón de Santiago 2026',
        description:
          'Cobertura aérea con 3 drones para evento deportivo masivo. Puntos de fotografía estratégicos, video time-lapse de la ruta y galería en línea con reconocimiento facial.',
      },
      {
        url: 'https://picsum.photos/seed/fotoeventos-4/800/600',
        title: 'Lanzamiento Colección Otoño',
        description:
          'Fotografía de moda para campaña de temporada. 12 looks en locaciones urbanas, edición de color, video behind-the-scenes y contenido para redes sociales.',
      },
      {
        url: 'https://picsum.photos/seed/fotoeventos-5/800/600',
        title: 'Graduación Universidad Adolfo Ibáñez',
        description:
          'Cobertura de ceremonia de titulación para 500 egresados. Retratos individuales y grupales, video emotivo de recuerdos y galería descargable para cada familia.',
      },
      {
        url: 'https://picsum.photos/seed/fotoeventos-6/800/600',
        title: 'Festival Gastronómico La Picada',
        description:
          'Fotografía gastronómica para evento con 40 food trucks. Platos, chefs en acción, ambiente y entrevistas. Contenido para redes y video receta destacado del evento.',
      },
    ],
    serviceStatus: 'ACTIVE',
  },
  {
    id: 'streamlab',
    companyName: 'StreamLab',
    title: 'Streaming y Transmisión en Vivo Profesional',
    description:
      'Proveemos soluciones completas de streaming para eventos corporativos, conferencias y espectáculos. Transmisión multi-cámara en alta definición, integración con plataformas líderes y soporte técnico en tiempo real.',
    categoryName: 'Streaming & Transmisión',
    location: 'Santiago, RM',
    bannerImg: 'https://picsum.photos/seed/streamlab-banner/1200/400',
    logoImg: 'https://picsum.photos/seed/streamlab-logo/200/200',
    contactInformation: [
      { type: 'email', value: 'ventas@streamlab.cl' },
      { type: 'website', value: 'www.streamlab.cl' },
      { type: 'twitter', value: '@streamlab_cl' },
    ],
    portfolio: [
      {
        url: 'https://picsum.photos/seed/streamlab-1/800/600',
        title: 'Streaming Congreso Futuro 2026',
        description:
          'Transmisión en vivo multi-cámara para 50 charlas con 4 cámaras robóticas, pantalla verde, traducción simultánea y plataforma interactiva con chat en vivo. 100.000 espectadores online.',
      },
      {
        url: 'https://picsum.photos/seed/streamlab-2/800/600',
        title: 'Evento Híbrido CChC',
        description:
          'Producción de evento híbrido para 300 presenciales y 2.000 remotos. Streaming en 4K, votación en tiempo real, salas de breakout y moderación remota con speakers internacionales.',
      },
      {
        url: 'https://picsum.photos/seed/streamlab-3/800/600',
        title: 'Lanzamiento E-commerce Ripley',
        description:
          'Live shopping con 3 hosts, demostración de productos en tiempo real, integración con carrito de compras y chat de atención. 15.000 viewers simultáneos en TikTok y YouTube.',
      },
      {
        url: 'https://picsum.photos/seed/streamlab-4/800/600',
        title: 'Webinar Salud Red UC Christus',
        description:
          'Serie de 12 webinars educativos con doctores especialistas. Streaming en HD, presentaciones interactivas, Q&A moderado y grabación automatizada con capítulos.',
      },
    ],
    serviceStatus: 'ACTIVE',
  },
  {
    id: 'escenario-events',
    companyName: 'Escenario Events',
    title: 'Montaje y Producción de Escenarios',
    description:
      'Especialistas en montaje de escenarios para conciertos, festivales y eventos masivos. Ofrecemos estructuras modulares, tarimas, pasarelas y backline. Trabajamos con los más altos estándares de seguridad y calidad.',
    categoryName: 'Producción de Eventos',
    location: 'Concepción',
    bannerImg: 'https://picsum.photos/seed/escenario-events-banner/1200/400',
    logoImg: 'https://picsum.photos/seed/escenario-events-logo/200/200',
    contactInformation: [
      { type: 'email', value: 'info@escenarioevents.cl' },
      { type: 'telefono', value: '+56 41 234 5678' },
      { type: 'whatsapp', value: '+56 9 1122 3344' },
    ],
    portfolio: [
      {
        url: 'https://picsum.photos/seed/escenario-events-1/800/600',
        title: 'Escenario Principal REC 2025',
        description:
          'Montaje de escenario principal para festival REC en Concepción. Estructura de 20m de boca, 12m de fondo, con 3 niveles de tarima, pasarela frontal y backstage completo.',
      },
      {
        url: 'https://picsum.photos/seed/escenario-events-2/800/600',
        title: 'Escenario Elecciones Teletón',
        description:
          'Montaje de escenario móvil para gira nacional. Sistema de montaje rápido en 45 minutos, estructura autosoportante, pantalla LED integrada y sistema de sonido portátil.',
      },
      {
        url: 'https://picsum.photos/seed/escenario-events-3/800/600',
        title: 'Festival de la Canción de Punta Arenas',
        description:
          'Estructura escénica para evento al aire libre en clima extremo. Escenario techado con capacidad para 30 músicos, sistema de calefacción y piso antideslizante.',
      },
      {
        url: 'https://picsum.photos/seed/escenario-events-4/800/600',
        title: 'Pasarela Santiago Fashion Week',
        description:
          'Montaje de pasarela tipo T de 25 metros con iluminación empotrada. Estructura modular para backstage, cabina de sonido y zona de prensa con 80 asientos VIP.',
      },
      {
        url: 'https://picsum.photos/seed/escenario-events-5/800/600',
        title: 'Escenario Secundario Lollapalooza',
        description:
          'Montaje y operación de escenario alternativo para 15 bandas emergentes. Estructura compacta de 12m, equipo de monitoreo, iluminación básica y carpa de artistas.',
      },
    ],
    serviceStatus: 'DRAFT',
  },
];
