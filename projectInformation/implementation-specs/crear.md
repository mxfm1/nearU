# Screen Name

    Crear

# 1. Screen Information

- Crear
- /crear
- TBD
- Roles: Aquellos usuarios que hayan logeado 

# 2. Finalidad

    Generar un espacio para que los usuarios puedan publicar servicios o eventos
    

# 3. UI Reference

    ./screens/crear-references.png
    ./screens/crear-evento.png
    ./screens/crear-servicio.png

# 4. Layout / Estructura

    # Loged user
       <Title>
       <lowDescription>
       <EventPrimaryCreateButton>
       <ServicePrimaryCreateButton>

    # Unloged user
        Cannot see this page

# 5. Componentes Reutilizables

    <EventPrimaryCreateButton>
    <ServicePrimaryCreateButton>
---

# 5. Funcionalidad

    Inicialmente va a ser un componente de servidor donde se carguen las validaciones previas(si el usuario esta logeado, si valido su cuenta),etc. ISR, para luego cargar lso botones con loading state que me permitan movermse hacia las 2 subscreens(/crear/evento y /crear/servicio)

# 6. Integración


# 7. Estados

    - Carga inicial(server)
    - partial rendering 

# 8. Consideraciones

    - Utiliza loading state para los botones
    - Utiliza suspense para el manejo de carga

    - la screen debe estar en el fallback del router
    - Debe estar protegida por el middleware de validación de sesión()
    - El componente de server debe hacer la petición a la api
    - Debe tener un componente de error que permita manejar los errores
    - TODAS LAS GUARDS NO DEBEN SER IMPLEMENTADAS DE MOMENTO PUES SOLO SE USA MOCK DATA

# 9. Consideraciones de elementos del layout


Implementar segun:

    - projectInformation/domain/ubication.md
    - projectInformation/domain/categories.md
    . skills/react-clean-architecture.md

