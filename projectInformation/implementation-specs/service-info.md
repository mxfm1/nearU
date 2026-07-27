# Screen Name

    Info service

# 1. Screen Information

- Service information screen
- /servicios/id
- TBD
- Roles: Todos los usuarios que vean la página

# 2. Finalidad

    Esta screen tiene la finalidad de mostrar información detallada sobre un servicio en específico, posteado en la plataforma
    Tras clickear en una card de servicio, esta screen es desplegada. Tiene dentro de sus funciones el boton de contacto que despliega un formulario de contacto de manera de alert dialog con el objetivo de conntactarme con la empresa creadora del servicio

# 3. UI Reference

    ./screens/info-service-1.png
    ./screens/info-service-2.png

# 4. Layout / Estructura

    <Navbar />
    <Banner />
    <ProfileLogo>
    <ServiceDetail />
    <ContactSection>
        <ContactForm> - Implementado después
    <PortafolioSection>

# 5. Componentes Reutilizables

    <BannerSection>
    <ProfileLogo>
    <CategoryBadge>
    <Ubication>
    <ContactForm>
    <ContactSection>
    <ContactButton>
    <PortfolioSection>

---

# 5. Funcionalidad

    - Estrategia de ISR cargando inicialmente en el servidor los datos y parcialmente elementos que necesiten interactividad(carousel de portafolio). Este debe loeadear solo cuando el usuario haga scroll, para mejorar el rendimiento(utilizar tanstack para este propósito)

# 6. Integración

    Historias de usuarios: TBD - Aun no está definido el backend, utiliza mock data pero overall es

    ruta: servicios/[ID]
    endpoints: GET /services/ID

    type ContactInformation {
        type: | "email"
    | "phone"
    | "whatsapp"
    | "website"
    | "instagram"
    | "facebook"
    | "twitter";
        value:string
    }

    type PortfolioImage {
        url:string
    }

    type ErrorAPI {
        code: | "NOT_FOUND"
    | "UNAUTHORIZED"
    | "FORBIDDEN"
    | "SERVICE_UNAVAILABLE"
    | "NETWORK_ERROR"
    | "RATE_LIMITED"
    | "VALIDATION_ERROR"
    | "INTERNAL_ERROR"
    | "UNKNOWN_ERROR";
    }

    type ServiceStatus {
        | "ACTIVE"
        | "PAUSED"
        | "DRAFT"
        | "ARCHIVED";
    }

    responses:

    success: {
        success:true
        code: "OK" ;
        serviceStatus: ServiceStatus;
        bannerImg:string,
        companyName:string,
        title: string,
        description:string,
        categoryName:string,
        location:string,
        contactInformation: ContactInformation []
        portafolio: PortfolioImage[]
    }

    <ErrorAPI> : {
        success:false
        code: ErrorAPI
    }

    <UnknownError> : {
        success:false
        code: "UNKNOWN_ERROR"
    }

# 7. Estados

    - Loading(initial)
    - Success
    - Empty
    - Error

# 8. Consideraciones

    - Debe implementarse con componentes modulares, que puedan ser utilizados en otros lugares. Siguiendo las reglas de la skill de creacion de componentes
    - Utilización de framer motion para animaciones de aparicion(de momento solo fade In)
    - Estado de carga visible al usuario en componentes que lo requieran
    - En caso de error, se debe mostrar un componente que adapte el error code a un mensaje amigable al usuario

# 9. Consideraciones de elementos del layout

    SIEMPRE debe ser mobile FIRST utilizando tailwindcss

    <Navbar />

    - No implementar todavia, utilizar la que ya existe

    <BannerSection>

        Componente que repsesenta una imagen de fondo elegida por el usuario para la rpesentacion del servicio
        cargada desde props recibidas al componente
        Adaptada para moile first
        Tendra una imagen por defecto en casod e que el usuario no entregue una

    <ProfileLogo>

        - Componente que recibe como prop la url de la imagen elegida por el usuario de la empresa
        - Adaptada para mobile first
        - Tendra una imagen por defecto en casod e que el usuario no entregue una

    <ServiceDetail>

        - Componente que recibe como prop el titulo, descripcion, categoria del servicio, nombre de la empresa y ubicacion


    <ContactSection>

        - Componente que recibe como prop la informacion de contacto del servicio(EN FORMA DE ARRAY DE OBJETOS, recibe tipo de servicio y valor)
        - El boton de contacto tiene que tener formato de CTA(call to action) y abre un alertDialog del formulario de contacto(aun no implementar, solo abrir un alert dialog vacio)

    <PortafolioSection>

        - Componente que recibe como prop el portafolio del servicio
        - Tendra un modo de carrusel, recibirá un array de imagenes como prop qeu renderizará. Se encargará de presentarlas como imagenes de un carrusel con las propicedades de framer motion, mobile first, scrolleable lateralmente y con botones de control arrow en desktop

Implementar segun:

    - projectInformation/domain/ubication.md
    - projectInformation/domain/categories.md
    . skills/react-clean-architecture.md
