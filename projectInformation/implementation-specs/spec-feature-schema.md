# 1. Screen Information

- Nombre
- Ruta
- Módulo
- Casos de uso relacionados

---

# 2. Objetivo

Describe qué permite hacer esta pantalla y cuál es su finalidad dentro del flujo de la aplicación.

---

# 3. UI Reference

- Imagen o Figma
- Notas de diseño (si aplica)

---

# 4. Layout

Describe la estructura de la pantalla por secciones.

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

# 5. Funcionalidad

Describe el comportamiento esperado de cada sección.

- ¿Qué ocurre al cargar la pantalla?
- ¿Qué acciones puede realizar el usuario?
- ¿Cómo responde la interfaz?

---

# 6. Integración

Describe únicamente los recursos que consume la pantalla.

Ejemplo

Endpoints

GET /search

GET /categories

GET /regions

---

# 7. Estados

- Loading
- Success
- Empty
- Error

---

# 8. Consideraciones

Todo aquello que el desarrollador debe tener presente.

Ejemplo

- Debounce en la búsqueda.
- Mantener filtros en la URL.
- Scroll conserva posición.
- Responsive.