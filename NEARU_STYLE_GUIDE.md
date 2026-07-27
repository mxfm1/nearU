# NearU Design System - Style Guide

## Extracción de estilos desde `home-screen.png`

---

## 1. PALETA DE COLORES

### Brand Primary (NearU Green)

```css
--brand: #1b4332; /* Deep Forest Green - Color principal */
--brand-light: #2d5a3d; /* Green Medium - Hover states */
--brand-dark: #0f2a1a; /* Dark Green - Profundidad */
```

### Brand Scale (50-900)

```css
--brand-50: #ecfdf5; /* Backgrounds sutiles */
--brand-100: #d1fae5; /* Hover backgrounds */
--brand-200: #a7f3d0; /* Borders activos */
--brand-300: #6ee7b7; /* Accents */
--brand-400: #34d399; /* Interactive */
--brand-500: #10b981; /* Default */
--brand-600: #059669; /* Pressed */
--brand-700: #047857; /* Text on light */
--brand-800: #065f46; /* Text dark */
--brand-900: #064e3b; /* Darkest */
```

### Backgrounds

```css
--background: #ffffff; /* Main background */
--surface: #ffffff; /* Cards */
--surface-elevated: #ffffff; /* Floating elements */
```

### Text

```css
--text-primary: #111827; /* Headings, body */
--text-secondary: #6b7280; /* Descriptions */
--text-muted: #9ca3af; /* Placeholders */
```

### Borders

```css
--border: #e5e7eb; /* Default borders */
--input: #e5e7eb; /* Input borders */
```

---

## 2. GRADIENTES

### Primary Gradient (CTA sections, hero)

```css
/* Background gradient */
bg-gradient-brand {
  background: linear-gradient(135deg, #1b4332 0%, #2d5a3d 100%);
}

/* Hero section */
bg-gradient-hero {
  background: linear-gradient(180deg, #ffffff 0%, #f0fdf4 100%);
}

/* Radial variant */
bg-gradient-brand-radial {
  background: radial-gradient(ellipse at top left, #1b4332 0%, #2d5a3d 100%);
}
```

### Usage en Tailwind

```jsx
<div className="bg-gradient-brand">...</div>
<div className="bg-gradient-hero">...</div>
<div className="bg-gradient-brand-radial">...</div>
```

---

## 3. SOMBRAS (ELEVATION LEVELS)

```css
--shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.04); /* Subtle */
--shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.06); /* Cards default */
--shadow-md: 0 4px 16px rgba(0, 0, 0, 0.08); /* Cards hover */
--shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.1); /* Elevated */
--shadow-xl: 0 16px 48px rgba(0, 0, 0, 0.12); /* Floating */
--shadow-card: 0 2px 12px rgba(27, 67, 50, 0.06); /* Card with brand tint */
--shadow-card-hover: 0 8px 24px rgba(27, 67, 50, 0.12); /* Card hover with brand */
--shadow-float: 0 12px 40px rgba(0, 0, 0, 0.1); /* Floating elements */
--shadow-search: 0 4px 20px rgba(0, 0, 0, 0.06); /* Search bar */
--shadow-brand: 0 2px 8px rgba(27, 67, 50, 0.25); /* Brand buttons */
--shadow-brand-lg: 0 4px 16px rgba(27, 67, 50, 0.35); /* Brand buttons hover */
```

### Uso en Tailwind

```jsx
<div className="shadow-card">Card default</div>
<div className="shadow-card-hover">Card hover</div>
<div className="shadow-float">Floating element</div>
<div className="shadow-search">Search bar</div>
<button className="shadow-brand hover:shadow-brand-lg">Button</button>
```

---

## 4. FORMAS (BORDER RADIUS)

```css
--radius-xs: 4px; /* Badges pequeños */
--radius-sm: 8px; /* Botones pequeños */
--radius-md: 12px; /* Botones, inputs */
--radius-lg: 16px; /* Cards pequeñas */
--radius-xl: 24px; /* Cards grandes */
--radius-2xl: 32px; /* Modals, sections */
--radius-pill: 9999px; /* Pills, search bar */
```

### Uso en Tailwind

```jsx
{
  /* Search bar - Pill */
}
<div className="rounded-pill">...</div>;

{
  /* Category pills */
}
<button className="rounded-pill">Producción</button>;

{
  /* Small cards */
}
<div className="rounded-lg">...</div>;

{
  /* Large category cards */
}
<div className="rounded-xl">...</div>;

{
  /* Stats cards */
}
<div className="rounded-lg p-6">...</div>;

{
  /* Floating elements */
}
<div className="rounded-xl">...</div>;
```

---

## 5. COMPONENTES ESTÁNDAR

### Search Bar

```jsx
<div className="bg-card rounded-full border border-border px-5 py-3 flex items-center gap-3 shadow-search">
  <SearchIcon className="text-muted-foreground" />
  <input
    type="text"
    placeholder="Busca servicios, categorías o proveedores..."
    className="flex-1 bg-transparent outline-none"
  />
  <button className="bg-primary text-primary-foreground rounded-lg px-6 py-2 font-semibold">
    Buscar
  </button>
</div>
```

### Category Pill

```jsx
<button className="bg-card border border-border rounded-full px-4 py-2 text-sm font-medium text-text-primary hover:bg-brand-50 hover:border-brand-300 hover:text-brand-700 transition-all">
  <Icon className="mr-2" />
  Producción
</button>
```

### Card (Base)

```jsx
<div className="bg-card rounded-xl border border-border p-6 shadow-card hover:shadow-card-hover transition-all">
  {/* Content */}
</div>
```

### Card (Elevated - Floating)

```jsx
<div className="bg-card rounded-xl p-6 shadow-float">{/* Content */}</div>
```

### Stats Card

```jsx
<div className="bg-card rounded-xl border border-border p-6 flex items-center gap-4 shadow-sm">
  <div className="w-12 h-12 bg-brand-50 rounded-full flex items-center justify-center">
    <Icon className="text-brand" />
  </div>
  <div>
    <p className="text-2xl font-bold text-text-primary">500+</p>
    <p className="text-sm text-text-secondary">Proveedores verificados</p>
  </div>
</div>
```

### Premium Badge

```jsx
<span className="bg-brand text-brand-foreground rounded-md px-2 py-1 text-xs font-semibold">
  Premium
</span>
```

### Primary Button

```jsx
<button className="bg-primary text-primary-foreground rounded-lg px-6 py-3 font-semibold shadow-brand hover:shadow-brand-lg hover:bg-brand-light transition-all duration-200">
  Botón Principal
</button>
```

### Secondary Button

```jsx
<button className="bg-secondary text-secondary-foreground rounded-lg px-6 py-3 font-semibold border border-border hover:bg-muted transition-all duration-200">
  Botón Secundario
</button>
```

### Outline Button

```jsx
<button className="border-2 border-primary text-primary rounded-lg px-6 py-3 font-semibold bg-transparent hover:bg-primary hover:text-primary-foreground transition-all duration-200">
  Botón Outline
</button>
```

---

## 6. UTILIDADES CSS

```css
/* Gradient text */
.text-gradient-brand {
  background: linear-gradient(135deg, var(--brand) 0%, var(--brand-light) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Section container */
.section-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 16px;
}

@media (min-width: 640px) {
  .section-container {
    padding: 0 24px;
  }
}

@media (min-width: 1024px) {
  .section-container {
    padding: 0 32px;
  }
}
```

---

## 7. DARK MODE

El dark mode está configurado automáticamente. Los colores se invierten:

```css
.dark {
  --background: #0f1a14;
  --foreground: #f9fafb;
  --primary: #34d399; /* Brand 400 */
  --brand: #34d399;
  --brand-light: #6ee7b7;
  --brand-dark: #10b981;
  /* ... etc */
}
```

---

## 8. ANIMACIONES

```jsx
{
  /* Fade in */
}
<div className="animate-fade-in">...</div>;

{
  /* Slide up */
}
<div className="animate-slide-up">...</div>;

{
  /* Slide down */
}
<div className="animate-slide-down">...</div>;

{
  /* Scale in */
}
<div className="animate-scale-in">...</div>;
```

---

## 9. REFERENCIA RÁPIDA

| Elemento         | Clase Tailwind                       |
| ---------------- | ------------------------------------ |
| Search bar       | `rounded-full shadow-search`         |
| Category pill    | `rounded-full border`                |
| Small card       | `rounded-lg shadow-card`             |
| Large card       | `rounded-xl shadow-card`             |
| Floating card    | `rounded-xl shadow-float`            |
| Stats card       | `rounded-lg shadow-sm`               |
| Primary button   | `bg-primary rounded-lg shadow-brand` |
| Premium badge    | `bg-brand rounded-md`                |
| Gradient section | `bg-gradient-brand`                  |
| Gradient text    | `text-gradient-brand`                |

---

## 10. ARCHIVOS MODIFICADOS

- `app/globals.css` - Variables CSS y utilidades
- `tailwind.config.ts` - Theme extensions
- `NEARU_STYLE_GUIDE.md` - Este documento

---

**Última actualización:** Extraído desde `home-screen.png`
