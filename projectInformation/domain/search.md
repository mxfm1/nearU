# Search Domain

La búsqueda permite encontrar tres recursos:

- Servicios
- Eventos
- Empresas

## Filtros

### Servicios

- Categoría
- Región

Categorías permitidas:

- Producción
- Audiovisual
- Catering
- Fotografía
- Seguridad
- Decoración
- Marketing
- Tecnología
- Espacios

---

### Eventos

- Categoría
- Región
- Fecha

Categorías:

- Congreso
- Seminario
- Feria
- Evento Corporativo
- Activación
- Networking

---

### Empresas

- Tipo de Perfil
  - Proveedor
  - Organizador
  - Ambos

- Región

---

Los filtros siempre deben serializarse en la URL utilizando query params.

Ejemplo

/search?q=streaming&type=service&category=audiovisual&region=santiago
