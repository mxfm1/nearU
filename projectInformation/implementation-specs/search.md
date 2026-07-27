# 1. Screen Information

    - Name: barra de busqueda de eventos / proveedores
    - Route: /descubrir
    - Module: discovery
    - Use Cases:
    - Roles: all

# 2. Objetivo

    Generar una pantalla de descubrimientos con filtros y busqueda de eventos / proveedores

# 3. UI Reference

    /projectInformation/screens/descubrirpage.png

# 4. Layout

    <Navbar />

    <SearchBar />

    <ServiceCard />

    <EventCard />

    <ProfileCard />

    <Pagination />

# 5. Funcionalidad

    - La pagina va a crearse con SSR y streaming porque los datos cambian bastante, y streaming para fragmentar los componentes y añadirles fallback

# 6. Integración

    TBD - Aun no está definido el backend, utiliza mock data pero overall es

    el filtro determina qué tipo de endpoints llamar

    -> GET /search?query={query}&page={page}&limit={limit}&category={category}&region={region}

    GET /providers
    GET /events

# 7. Estados

    - Loading(initial)
    - Success
    - Empty
    - Error

# 8. Consideraciones

    - Debe implementarse con componentes modulares, que puedan ser utilizados en otros lugares
    - En caso de poder compartir los componentes, storearlos en el folder global de componentes
    - Los filtros se generan en la url , por lo que los resultados de la busqueda se integrarán en otra screen que refleje los resultados con los filtros en la url y capturados por la misma
    - Los resultados iniciales van a tener un scroll lateral utilizando framer-motion (control de scroll en la parte inferior con botones)

# 9. Consideraciones de elementos del layout

    <SearchBar />

    - Input de busqueda con placeholder "Buscar servicios, eventos o proveedores"
    - Boton de busqueda con icono de lupa
    - En el mobile el input se expande y ocupa toda la pantalla
    - En el mobile el boton de busqueda se expande y ocupa toda la pantalla

    Integra estos filtros:

    - Filtros para servicios
    - Filtros para eventos
    - Para ubicación
    - Filtros para categorias de eventos
    - Para categorias de proveedores
    - Filtros de fecha (para eventos)

    Los resultados de la busqueda se mostrarán en una grid que va a cambiar el orden segun el filtro seleccionado. Estos resultados se mostrarán en otra page que capture los resultados pusheados a la url y fetchee los datos en cuestión


    <ServiceCard> / <EventCard>

    *IMPORTANTE*

    * deben ser responsivas, y tener un mismo tamaño independiente del contenido *

    Implementa solo lo de arriba, lo otro ya está hecho


    <ProfileCard>

    * IMPORTANTE *

    * deben ser responsivas, y tener un mismo tamaño independiente del contenido *

    representan la busqueda de empresas en la aplicación

    - Imagen del perfil
    - Nombre del perfil
    - Ubicación del perfil
    - Categoría del perfil

Implementar segun:

    - projectInformation/domain/search.md
    - projectInformation/domain/categories.md
