# Screen Name

---

# 1. Screen Information

- Nombre de la pantalla
- Ruta (URL)
- Módulo
- Caso(s) de Uso asociado(s)
- Roles que pueden acceder

Ejemplo

Route:
/search

Module:
Marketplace

Use Cases:
- MARKET-UH-001
- MARKET-UH-002

---

# 2. Finalidad

Describe el objetivo de la pantalla.

¿Qué problema resuelve?

¿Qué espera conseguir el usuario aquí?

---

# 3. UI Reference

Imagen de referencia

Figma (opcional)

Notas de diseño importantes.

---

# 4. Layout / Estructura

Describe la pantalla por bloques.

Ejemplo

Navbar

↓

Search Bar

↓

Filtros

↓

Resultados

↓

Paginación

---

# 5. Componentes

Lista todos los componentes reutilizables.

Ejemplo

<SearchBar />

<SearchFilters />

<ServiceCard />

<EventCard />

<ProfileCard />

<Pagination />

<EmptyState />

<Loading />

---

# 6. Estado Inicial

¿Cómo carga la pantalla?

Ejemplo

- Sin búsqueda
- Mostrar categorías
- Mostrar servicios destacados
- Mostrar eventos recientes

---

# 7. Flujo de Usuario

Describe cómo interactúa el usuario.

Ejemplo

Usuario escribe "Streaming"

↓

Presiona Buscar

↓

Se actualiza la URL

↓

Se consulta la API

↓

Se muestran resultados

↓

Usuario aplica filtros

↓

Nueva consulta

---

# 8. Datos necesarios

¿Qué información necesita esta pantalla?

Ejemplo

- Categorías
- Regiones
- Eventos
- Servicios
- Perfil empresa

---

# 9. Implementación Técnica

Frontend

- Estado
- Hooks
- React Query
- Context
- Debounce

Backend

Endpoint utilizado

GET /search

Parámetros

q

category

region

date

page

size

Respuesta esperada.

---

# 10. Estados de la Pantalla

Loading

Empty

Success

Error

Offline (si aplica)

---

# 11. Validaciones

¿Qué debe validar la pantalla?

Ejemplo

No permitir buscar menos de 3 caracteres.

No permitir fecha pasada.

No permitir categoría inexistente.

---

# 12. Edge Cases

Ejemplos

Sin resultados.

Backend responde 500.

Usuario pierde internet.

Categoría eliminada.

Evento eliminado mientras estaba abierto.

URL manipulada manualmente.

Parámetros inválidos.

---

# 13. Navegación

Desde dónde llega el usuario.

Hacia dónde puede navegar.

Ejemplo

Navbar

↓

Search

↓

Detalle Servicio

↓

Perfil Empresa

---

# 14. Performance

¿Qué optimizaciones requiere?

Ejemplo

Lazy Loading.

Infinite Scroll.

Debounce.

Paginación.

Memoización.

---

# 15. Accesibilidad

Navegación con teclado.

Labels.

Contraste.

Focus.

ARIA.

---

# 16. Seguridad

¿Qué no debería poder hacer el usuario?

Ejemplo

Editar recursos ajenos.

Consultar información privada.

Modificar parámetros sensibles.

---

# 17. Reglas de Negocio

Muy importante.

Aquí escribes las reglas que afectan exclusivamente esta pantalla.

Ejemplo

Un evento solo aparece si está publicado.

Una empresa solo aparece si tiene perfil activo.

Los servicios ocultos no se muestran.

La búsqueda distingue entre servicios y eventos.

---

# 18. Pendientes

Lista de futuras mejoras.

No implementadas en el MVP.

Ejemplo

Ordenar por popularidad.

Favoritos.

Búsqueda por IA.

Historial.

Autocompletado.