# Tienda Sonido Vivo — Proyecto Semestral DSY1104 (Parcial 2)

![Tienda Sonido Vivo](https://img.shields.io/badge/Caso%20B-Tienda%20Sonido%20Vivo-00c2ff?style=for-the-badge)
![Duoc UC](https://img.shields.io/badge/Duoc%20UC-Desarrollo%20Full%20Stack%20II-38bdf8?style=for-the-badge&labelColor=090d16)
![Tecnologías](https://img.shields.io/badge/React%2018-Vite-React%20Router%20v7-blue?style=for-the-badge)
![Localhost](https://img.shields.io/badge/Servidor-localhost%3A5173-blueviolet?style=for-the-badge)

Este repositorio contiene la versión interactiva en **React + Vite** desarrollada para la **Evaluación Parcial 2** de la asignatura **Desarrollo Full Stack II (DSY1104)** en Duoc UC, correspondiente al **Contexto B: Tienda Sonido Vivo (Venta de productos de audio, equipos y accesorios)**.

---

## 🎧 Acerca de Tienda Sonido Vivo

**Tienda Sonido Vivo** es un comercio especializado en la comercialización de equipamiento de audio profesional, instrumentos, grabación para home studio y accesorios de alta fidelidad en Chile.

- **Misión:** Acercar la más alta fidelidad sonora y equipamiento profesional a músicos, productores, creadores de contenido y amantes del audio en todo Chile.
- **Visión:** Posicionarse como el referente online en asesoría y distribución de marcas líderes de audio profesional en el país.

---

## 📁 Estructura del Proyecto (Versión React + Vite)

```text
tienda-sonido-vivo/
├── public/
│   ├── images/productos/        # Recursos públicos de productos
│   └── img/                     # Ilustraciones vectoriales de equipos de audio
│       ├── ath-m50x.svg
│       ├── shure-sm7b.svg
│       ├── scarlett-2i2.svg
│       ├── yamaha-hs5.svg
│       ├── marshall-acton.svg
│       ├── launchkey-49.svg
│       ├── rode-ntusb.svg
│       ├── sony-wh1000xm5.svg
│       ├── behringer-xenyx.svg
│       ├── shure-se215.svg
│       ├── lp120x.svg
│       └── cables-xlr.svg
├── src/
│   ├── components/
│   │   ├── Header.jsx           # Encabezado institucional con identidad de Sonido Vivo
│   │   ├── Navbar.jsx           # Barra de navegación con NavLink activo (React Router v7)
│   │   ├── Footer.jsx           # Pie de página institucional
│   │   └── ProductoCard.jsx     # Tarjeta reutilizable con props y fallback visual
│   ├── data/
│   │   └── productos.js         # Arreglo con el catálogo completo de equipos de audio
│   ├── layouts/
│   │   └── LayoutPrincipal.jsx  # Layout compartido con Header, Navbar, <Outlet /> y Footer
│   ├── pages/
│   │   ├── Inicio.jsx           # Hero de bienvenida, estadísticas y categorías de audio
│   │   ├── Productos.jsx        # Catálogo reactivo con buscador en tiempo real (useMemo)
│   │   ├── Contacto.jsx         # Formulario de asesoría y cotización técnica
│   │   ├── Login.jsx            # Acceso administrativo
│   │   └── Admin.jsx            # Panel de control y métricas de inventario
│   ├── App.jsx                  # Declaración de rutas anidadas con React Router v7
│   ├── main.jsx                 # Entrada de React con BrowserRouter
│   └── styles.css               # Estilos globales y paleta de audio profesional
├── version-html/                # Respaldo completo de la versión HTML estática (EV1)
├── .prettierrc                  # Reglas de formato de código
├── index.html                   # Punto de entrada de Vite SPA
├── package.json                 # Dependencias (React 18, React Router v7, Vite)
└── vite.config.js               # Configuración de compilación con @vitejs/plugin-react
```

---

## 🚀 Cómo Ejecutar el Proyecto

1. Abrir la terminal en la raíz del proyecto:
   ```bash
   cd "Tienda-Level-Up" # o Tienda-Sonido-Vivo si fue renombrada
   ```
2. Instalar dependencias (si es primera vez):
   ```bash
   npm install
   ```
3. Iniciar el servidor de desarrollo en Vite:
   ```bash
   npm run dev
   ```
4. Abrir en el navegador:
   ```text
   http://localhost:5173/
   ```

---

## 📝 Información Académica

- **Asignatura:** Desarrollo Full Stack II (DSY1104)
- **Institución:** Duoc UC
- **Evaluación:** Evaluación Parcial 2 — Semestre 2026
- **Contexto:** Opción B — Tienda Sonido Vivo (Audio, equipos y accesorios)
