# Tienda Sonido Vivo — Proyecto Semestral DSY1104 (Evaluación Parcial 2)

![Tienda Sonido Vivo](https://img.shields.io/badge/Caso%20B-Tienda%20Sonido%20Vivo-00c2ff?style=for-the-badge)
![Duoc UC](https://img.shields.io/badge/Duoc%20UC-Desarrollo%20Full%20Stack%20II-38bdf8?style=for-the-badge&labelColor=090d16)
![Tecnologías](https://img.shields.io/badge/React%2018-Vite-React%20Router%20v7-blue?style=for-the-badge)
![Testing](https://img.shields.io/badge/Vitest-React%20Testing%20Library-10%2F10%20Pass-00e599?style=for-the-badge)
![Localhost](https://img.shields.io/badge/Servidor-localhost%3A5173-blueviolet?style=for-the-badge)

Este repositorio contiene la versión interactiva y modular en **React 18 + Vite** desarrollada para la **Evaluación Parcial 2 (EP2)** de la asignatura **Desarrollo Full Stack II (DSY1104)** en Duoc UC, correspondiente al **Contexto B: Tienda Sonido Vivo (Comercialización de equipamiento de audio profesional, instrumentos y accesorios de estudio)**.

---

## 🎧 Acerca de Tienda Sonido Vivo

**Tienda Sonido Vivo** es un comercio especializado en la comercialización de equipamiento de audio profesional, instrumentos, grabación para home studio y accesorios de alta fidelidad en Chile.

- **Misión:** Acercar la más alta fidelidad sonora y equipamiento profesional a músicos, productores, creadores de contenido y amantes del audio en todo Chile.
- **Visión:** Posicionarse como el referente online en asesoría y distribución de marcas líderes de audio profesional en el país.

---

## 📑 Documentos Oficiales de Entrega

* 📘 **[DOCUMENTO_ERS_EP2.md](./DOCUMENTO_ERS_EP2.md):** Especificación de Requerimientos de Software Versión 2.0 (Requerimientos Funcionales RF01-RF10, No Funcionales RNF01-RNF05, Historias de Usuario con formato Gherkin y Matriz de Trazabilidad).
* 🧪 **[DOCUMENTO_TESTING_EP2.md](./DOCUMENTO_TESTING_EP2.md):** Estrategia de Testing, configuración de Vitest + React Testing Library + JSDOM y detalle de las **10 pruebas unitarias diversas** (Lógica, Renderizado, Interacciones de Usuario y Spies).

---

## 📁 Estructura del Proyecto (Versión React + Vite)

```text
tienda-sonido-vivo/
├── public/
│   ├── img/                             # 12 fotografías reales de equipos de audio y logotipo oficial
│   │   ├── Sonido Vivo.svg              # Isotipo oficial vectorizado con viewBox responsivo
│   │   ├── ath-m50x.webp                # Audífonos Audio-Technica ATH-M50x
│   │   ├── shure-sm7b.webp              # Micrófono Dinámico Shure SM7B
│   │   ├── scarlett-2i2.webp            # Interfaz Focusrite Scarlett 2i2
│   │   ├── yamaha-hs5.webp              # Monitores de Estudio Yamaha HS5
│   │   ├── marshall-acton.webp          # Parlante Bluetooth Marshall Acton III
│   │   ├── launchkey-49.webp            # Teclado Controlador Novation Launchkey 49
│   │   ├── rode-ntusb.webp              # Micrófono de Condensador RØDE NT-USB
│   │   ├── sony-wh1000xm5.webp          # Audífonos Bluetooth Sony WH-1000XM5
│   │   ├── behringer-xenyx.webp         # Mezclador Análogo Behringer Xenyx 802S
│   │   ├── shure-se215.webp             # Monitores In-Ear Shure SE215
│   │   ├── lp120x.webp                  # Tornamesa Audio-Technica AT-LP120XUSB
│   │   └── cables-xlr.webp              # Cable XLR Balanceado Mogami 3m
├── src/
│   ├── components/
│   │   ├── Header.jsx                   # Encabezado institucional con identidad de Sonido Vivo
│   │   ├── Navbar.jsx                   # Barra de navegación con NavLink activo y badge dinámico de carrito
│   │   ├── Footer.jsx                   # Pie de página institucional
│   │   ├── ProductoCard.jsx             # Tarjeta reutilizable con props, formateo $ CLP y fallback visual
│   │   └── ProductoFormModal.jsx        # Modal interactivo para Crear y Editar productos con validaciones
│   ├── context/
│   │   ├── AuthContext.jsx              # Estado global de autenticación, sesión y roles (cliente / admin)
│   │   └── CartContext.jsx              # Estado global del carrito, cantidades, cálculo de totales y persistencia
│   ├── data/
│   │   └── productos.js                 # Catálogo base de 12 equipos de audio profesional
│   ├── layouts/
│   │   └── LayoutPrincipal.jsx          # Layout compartido con Header, Navbar, <Outlet /> y Footer
│   ├── pages/
│   │   ├── Inicio.jsx                   # Hero de bienvenida, estadísticas y categorías de audio con imágenes
│   │   ├── Productos.jsx                # Catálogo reactivo con buscador en tiempo real (useMemo)
│   │   ├── DetalleProducto.jsx          # Ficha técnica, selector de cantidad y adición al carrito
│   │   ├── Carrito.jsx                  # Carrito interactivo con cálculo automático de 20% descuento Duoc
│   │   ├── Contacto.jsx                 # Formulario de asesoría y cotización técnica con validación JS
│   │   ├── Login.jsx                    # Inicio de sesión con accesos directos de demostración
│   │   ├── Registro.jsx                 # Registro de usuarios con validaciones de contraseña y correo único
│   │   └── Admin.jsx                    # Panel de administración protegido por rol con métricas y CRUD
│   ├── services/
│   │   ├── authStorage.js               # Servicio de persistencia y validación de usuarios y sesiones
│   │   └── productosStorage.js          # Servicio CRUD centralizado con inicialización y reseteo
│   ├── test/
│   │   ├── setup.js                     # Configuración de matchers (@testing-library/jest-dom)
│   │   ├── productosStorage.test.js     # 5 pruebas de lógica de negocio, persistencia, mutación y resiliencia
│   │   ├── ProductoCard.test.jsx        # 2 pruebas de componentes, renderizado de props y fallback ante error
│   │   └── ProductoFormModal.test.jsx   # 3 pruebas de validaciones, rangos numéricos, interacciones y Spies
│   ├── App.jsx                          # Configuración de rutas declarativas con React Router v7
│   ├── main.jsx                         # Punto de entrada de React con BrowserRouter
│   └── styles.css                       # Estilos globales y paleta de audio profesional
├── version-html/                        # Respaldo completo de la versión HTML estática (EV1)
├── DOCUMENTO_ERS_EP2.md                 # Especificación de Requerimientos de Software v2.0
├── DOCUMENTO_TESTING_EP2.md             # Matriz y evidencia de las 10 pruebas unitarias
├── index.html                           # Punto de entrada de Vite SPA
├── package.json                         # Dependencias (React 18, React Router v7, Vite, Vitest, RTL)
└── vite.config.js                       # Configuración de compilación con soporte para Vite y Vitest (JSDOM)
```

---

## 🚀 Cómo Ejecutar el Proyecto

1. Abrir la terminal en la raíz del proyecto:
   ```bash
   cd "Tienda-Sonido-Vivo"
   ```
2. Instalar dependencias:
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

## 🧪 Ejecución de Pruebas Unitarias (Vitest + RTL)

El proyecto cuenta con **10 pruebas unitarias efectivas** ejecutables mediante los siguientes scripts:

```bash
# Ejecutar todas las pruebas una sola vez
npm test

# Modo interactivo en caliente (watch mode)
npm run test:watch

# Generar reporte de cobertura de código
npm run test:coverage
```

---

## 🔒 Credenciales de Acceso Administrativo

Para revisar el funcionamiento del panel protegido `/admin`:
- **Usuario / Correo:** `admin` (o `admin@sonidovivo.cl`)
- **Contraseña:** `duoc123`
- **Rol:** `admin`

> En la vista `/login` se dispone de un botón directo de acceso con un solo clic para facilitar la revisión docente.

---

## 🎓 Regla de Negocio Institucional Duoc UC

Todo usuario registrado o compra efectuada con correos institucionales terminados en `@duocuc.cl`, `@profesor.duoc.cl` o `@alumnos.duoc.cl` recibe de forma automática un **20% de descuento vitalicio** aplicado directamente sobre el subtotal del carrito.

---

## 📝 Información Académica

- **Asignatura:** Desarrollo Full Stack II (DSY1104)
- **Institución:** Duoc UC
- **Evaluación:** Evaluación Parcial 2 (EP2) — Semestre 2026
- **Contexto:** Opción B — Tienda Sonido Vivo (Audio profesional, equipos y accesorios)
