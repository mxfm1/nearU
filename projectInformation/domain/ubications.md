# LOCATION DOMAIN

Este documento define las ubicaciones soportadas por la aplicación.

Todos los módulos que requieran representar o filtrar una ubicación (Servicios, Empresas, Eventos, Search, Perfil, etc.) deben utilizar exclusivamente los valores definidos en este documento.

---

## Región

Las regiones soportadas corresponden a las divisiones administrativas oficiales de Chile.

| Label                                | Value                |
| ------------------------------------ | -------------------- |
| Arica y Parinacota                   | `arica-y-parinacota` |
| Tarapacá                             | `tarapaca`           |
| Antofagasta                          | `antofagasta`        |
| Atacama                              | `atacama`            |
| Coquimbo                             | `coquimbo`           |
| Valparaíso                           | `valparaiso`         |
| Metropolitana de Santiago            | `metropolitana`      |
| O'Higgins                            | `ohiggins`           |
| Maule                                | `maule`              |
| Ñuble                                | `nuble`              |
| Biobío                               | `biobio`             |
| La Araucanía                         | `araucania`          |
| Los Ríos                             | `los-rios`           |
| Los Lagos                            | `los-lagos`          |
| Aysén                                | `aysen`              |
| Magallanes y de la Antártica Chilena | `magallanes`         |

---

## Tipo

```ts
type Region =
  | 'arica-y-parinacota'
  | 'tarapaca'
  | 'antofagasta'
  | 'atacama'
  | 'coquimbo'
  | 'valparaiso'
  | 'metropolitana'
  | 'ohiggins'
  | 'maule'
  | 'nuble'
  | 'biobio'
  | 'araucania'
  | 'los-rios'
  | 'los-lagos'
  | 'aysen'
  | 'magallanes';
```

---

## Convenciones

- `label` corresponde al texto mostrado al usuario.
- `value` corresponde al valor enviado y recibido por la API.
- Los `value` deben utilizarse en rutas, query params y payloads.
- Los `label` pueden cambiar por motivos de UX sin afectar el contrato de la API.

---

## Casos de uso

### Empresa

```ts
location: {
  region: Region;
}
```

### Servicio

```ts
location: {
  region: Region;
}
```

### Evento

```ts
location: {
  region: Region;
}
```

### Search

```
/search?region=metropolitana
```
