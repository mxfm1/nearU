# LivoHaus Design System

## Typography

### Primary Font

**Font Family**
- Inter (o una variante muy cercana)

```css
font-family: "Inter", sans-serif;
```

---

## Font Scale

### Display

```css
font-size: 64px;
font-weight: 600;
line-height: 1.1;
letter-spacing: -0.04em;
```

### H1

```css
font-size: 52px;
font-weight: 600;
line-height: 1.15;
```

### H2

```css
font-size: 40px;
font-weight: 600;
line-height: 1.2;
```

### H3

```css
font-size: 28px;
font-weight: 600;
line-height: 1.3;
```

### H4

```css
font-size: 22px;
font-weight: 600;
```

### Body Large

```css
font-size: 20px;
font-weight: 400;
line-height: 1.7;
```

### Body

```css
font-size: 18px;
font-weight: 400;
line-height: 1.7;
```

### Small

```css
font-size: 15px;
font-weight: 400;
line-height: 1.6;
```

### Button

```css
font-size: 16px;
font-weight: 600;
letter-spacing: 0.02em;
```

---

# Color Palette

## Primary

```css
--primary: #1B1B1B;
```

Color principal para títulos y botones.

---

## Secondary

```css
--secondary: #444444;
```

Texto secundario.

---

## Accent

```css
--accent: #B68C5A;
```

Color utilizado para detalles y elementos destacados.

---

## Background

```css
--background: #F8F7F4;
```

Color principal del fondo.

---

## Surface

```css
--surface: #FFFFFF;
```

Tarjetas y secciones.

---

## Border

```css
--border: #E5E5E5;
```

Bordes.

---

## Text Primary

```css
--text-primary: #222222;
```

---

## Text Secondary

```css
--text-secondary: #6D6D6D;
```

---

## Success

```css
--success: #2F855A;
```

---

## Error

```css
--error: #D64545;
```

---

# Buttons

## Primary Button

Background

```css
#1B1B1B
```

Text

```css
#FFFFFF
```

Hover

```css
#333333
```

Border Radius

```css
12px
```

Padding

```css
16px 28px
```

---

## Secondary Button

Background

```css
transparent
```

Border

```css
1px solid #1B1B1B
```

Text

```css
#1B1B1B
```

Hover

```css
background: #F2F2F2;
```

---

# Border Radius

Small

```css
8px
```

Medium

```css
12px
```

Large

```css
20px
```

Extra Large

```css
28px
```

---

# Shadows

Small

```css
0 2px 10px rgba(0,0,0,.05)
```

Medium

```css
0 10px 30px rgba(0,0,0,.08)
```

Large

```css
0 20px 60px rgba(0,0,0,.12)
```

---

# Layout

Container Width

```css
1200px
```

Content Width

```css
720px
```

Section Spacing

```css
120px
```

Grid Gap

```css
32px
```

---

# Design Tokens

```css
:root{

--primary:#1B1B1B;
--secondary:#444444;
--accent:#B68C5A;

--background:#F8F7F4;
--surface:#FFFFFF;

--border:#E5E5E5;

--text-primary:#222222;
--text-secondary:#6D6D6D;

--radius-sm:8px;
--radius-md:12px;
--radius-lg:20px;
--radius-xl:28px;

--shadow-sm:0 2px 10px rgba(0,0,0,.05);
--shadow-md:0 10px 30px rgba(0,0,0,.08);
--shadow-lg:0 20px 60px rgba(0,0,0,.12);

}
```
