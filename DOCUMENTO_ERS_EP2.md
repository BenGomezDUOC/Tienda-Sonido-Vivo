# Especificación de Requerimientos de Software (ERS) — Versión 2.0
**Asignatura:** DSY1104 — Desarrollo Full Stack II  
**Institución:** Duoc UC  
**Proyecto:** Tienda Sonido Vivo (Audio Profesional, Equipos y Accesorios)  
**Evaluación:** Evaluación Parcial 2 (EP2) — Semestre 2026  
**Versión del Documento:** 2.0 (Actualizada para la arquitectura React + Vite)  
**Estado:** Aprobado / Implementado al 100%  

---

## 1. Introducción y Propósito del Documento

### 1.1 Propósito
El presente documento constituye la **Especificación de Requerimientos de Software (ERS) Versión 2.0** para el sistema web **Tienda Sonido Vivo**. Su objetivo principal es definir de manera rigurosa, completa y trazable los requerimientos funcionales, requerimientos no funcionales, reglas de negocio e historias de usuario implementadas en la **Evaluación Parcial 2 (EP2)**.

### 1.2 Alcance del Sistema (Versión 2 — React SPA)
En esta segunda fase del proyecto semestral, el sistema evolucionó desde un conjunto de páginas estáticas tradicionales en HTML/CSS/JS (EV1) hacia una **Single Page Application (SPA)** moderna desarrollada sobre **React 18** y empaquetada mediante **Vite**. 

El alcance de la Versión 2 contempla:
1. **Catálogo comercial reactivo:** Búsqueda en tiempo real, filtros dinámicos y presentación de 12 equipos de audio profesional reales con formato de moneda nacional chilena (`$ CLP`).
2. **Vista detallada de producto (`/producto/:id`):** Presentación técnica de especificaciones de estudio, selector de cantidad y adición al carro de compras.
3. **Carrito de compras interactivo (`/carrito`):** Gestión de estado global con `CartContext`, controles incrementales de unidades, cálculo de subtotales, IVA (19%) y total.
4. **Regla de negocio institucional:** Aplicación automática y vitalicia del **20% de descuento** al detectar correos pertenecientes a la comunidad Duoc UC (`@duocuc.cl`, `@profesor.duoc.cl`, etc.).
5. **Autenticación y roles:** Registro (`/registro`) e inicio de sesión (`/login`) con control de acceso basado en roles (`cliente` y `admin`).
6. **Módulo administrativo protegido (`/admin`):** Métricas operacionales en tiempo real (KPIs de inventario, valorizado y stock crítico) y operaciones CRUD completas (Crear, Leer, Actualizar, Eliminar y Restaurar valores de fábrica) mediante componentes modales interactivos con validación.
7. **Estrategia de calidad y pruebas unitarias:** Configuración de **Vitest** y **React Testing Library** con 10 pruebas unitarias significativas que verifican lógica de persistencia, renderizado de componentes, interacción y Spies.

---

## 2. Descripción General del Sistema

### 2.1 Perspectiva del Producto
**Tienda Sonido Vivo** es una plataforma e-commerce especializada en audio profesional para músicos, productores, sonidistas y creadores de contenido. Opera como una aplicación de página única que no requiere recargas de navegador entre vistas, asegurando una experiencia de usuario instantánea y fluida.

### 2.2 Actores y Roles del Sistema

| Actor / Rol | Descripción y Nivel de Privilegios |
| :--- | :--- |
| **Visitante / Usuario Anónimo** | Puede recorrer el catálogo público, utilizar el buscador en tiempo real, visualizar el detalle de productos, agregar productos al carrito y acceder a la vista de contacto institucional. |
| **Cliente Registrado (Estándar)** | Usuario autenticado con correo convencional. Mantiene persistencia de su sesión y carrito de compras, pudiendo simular transacciones comerciales. |
| **Cliente Institucional Duoc UC** | Usuario registrado con dominio `@duocuc.cl` o equivalente institucional. El sistema activa automáticamente una bonificación del **20% de descuento** en cada compra. |
| **Administrador (`role: 'admin'`)** | Operador del sistema con credenciales maestras (`admin` / `duoc123`). Tiene acceso exclusivo a la ruta protegida `/admin` para gestionar el inventario de equipos de sonido mediante modales CRUD. |

---

## 3. Requerimientos Funcionales (RF)

### RF01: Enrutamiento Declarativo Single Page Application (SPA)
* **Descripción:** El sistema debe permitir la navegación instantánea entre todas las vistas de la aplicación sin recargas de página, manteniendo el estado en memoria y sincronizando la URL del navegador.
* **Entradas:** Clics en enlaces de navegación (`NavLink`, `Link`), botones de acción o redirecciones programáticas (`useNavigate`).
* **Salidas:** Renderizado del componente correspondiente dentro del layout principal compartido (`LayoutPrincipal` con `<Outlet />`).
* **Criterio de Aceptación:** Las rutas `/`, `/productos`, `/producto/:id`, `/carrito`, `/contacto`, `/login`, `/registro` y `/admin` deben resolver adecuadamente.

### RF02: Catálogo Dinámico con Búsqueda Reactiva en Tiempo Real
* **Descripción:** La vista de productos debe presentar una grilla responsiva de tarjetas con imagen real, marca, modelo, precio formateado en `$ CLP` y badge de categoría. Debe incluir un buscador que filtre instantáneamente por nombre, descripción o categoría mientras el usuario escribe.
* **Entradas:** Cadena de texto ingresada en el campo de búsqueda (`searchTerm`).
* **Procesamiento:** Filtrado reactivo optimizado mediante `useMemo` sin alterar el arreglo original de datos.
* **Salidas:** Grilla filtrada de componentes `<ProductoCard />` o mensaje de "No se encontraron productos coincidentes" en caso de coincidencia nula.

### RF03: Vista Detallada de Producto (`/producto/:id`)
* **Descripción:** Al seleccionar un producto del catálogo o del Home, el sistema debe abrir una vista de detalle cargada dinámicamente mediante el parámetro de URL `:id`.
* **Entradas:** Identificador numérico del producto en la ruta.
* **Salidas:** Imagen en alta resolución, nombre, marca, categoría, precio unitario, especificaciones técnicas (impedancia, respuesta de frecuencia, conexión), selector de unidades a comprar y botón "Agregar al Carrito".

### RF04: Carrito de Compras Global con Controles de Cantidad
* **Descripción:** El sistema debe proveer un estado global de compras accesible desde cualquier punto de la aplicación mediante `CartContext`.
* **Funcionalidades:**
  1. Agregar productos desde el catálogo o desde el detalle.
  2. Incrementar (`+`) o decrementar (`-`) unidades con límite mínimo de 1 y máximo según stock.
  3. Eliminar artículos individuales del carrito.
  4. Indicador dinámico (badge) en la barra de navegación que muestra la suma total de ítems.
  5. Desglose financiero: Subtotal neto, Descuento Institucional (si aplica), IVA (19%) y Total final.
  6. Botón de "Vaciar Carrito" y "Finalizar Compra" (simulación con feedback de confirmación).

### RF05: Regla de Negocio Institucional Duoc UC (20% Descuento)
* **Descripción:** La plataforma debe premiar a la comunidad educativa de Duoc UC aplicando automáticamente un **20% de descuento** sobre el subtotal de la compra.
* **Mecanismo de Detección:** Expresión regular que valida si el correo del usuario activo o ingresado en el carrito pertenece al dominio institucional:
  ```javascript
  const esDuoc = /@([a-zA-Z0-9.-]+\.)?duoc(uc)?\.cl$/i.test(email);
  ```
* **Salidas:** Alerta visual de "Descuento Duoc UC aplicado (20%)", recálculo del total y desglose explícito del ahorro en el resumen de compra.

### RF06: Módulo de Registro y Autenticación con Roles
* **Descripción:** El sistema debe permitir a nuevos usuarios registrarse con nombre, correo y contraseña, e iniciar sesión identificando el rol asignado (`cliente` o `admin`).
* **Validaciones Frontend:**
  1. Formato de correo electrónico válido.
  2. Contraseña obligatoria (mínimo 6 caracteres).
  3. Confirmación de contraseña idéntica.
  4. Correo único (no duplicado en el registro).
* **Credenciales Maestras de Administrador:** Usuario `admin` (o `admin@sonidovivo.cl`) y contraseña `duoc123`.

### RF07: Panel Administrativo Protegido con Métricas de Inventario
* **Descripción:** La ruta `/admin` debe estar protegida contra accesos no autorizados. Si un usuario no administrador intenta acceder, se le bloquea el acceso mostrando un mensaje de advertencia y un botón para iniciar sesión como administrador.
* **Métricas Operacionales (KPIs):**
  1. Total de equipos registrados en inventario.
  2. Valor total valorizado del inventario en CLP.
  3. Alerta de stock crítico (productos con menos de 5 unidades disponibles).
  4. Promedio de precio del catálogo.

### RF08: Operaciones CRUD de Inventario con Modales Interactivos
* **Descripción:** El panel de administración debe permitir la gestión completa del catálogo de productos mediante el componente interactivo `<ProductoFormModal />`:
  1. **Create:** Creación de un nuevo equipo con ID incremental único, nombre, categoría, precio, stock, descripción e imagen.
  2. **Read:** Tabla administrativa con miniaturas, búsqueda rápida y visualización de datos.
  3. **Update:** Edición in-situ de los atributos de cualquier producto existente sin perder su identificador original.
  4. **Delete:** Eliminación directa del producto con cuadro de diálogo de confirmación.
  5. **Reset:** Botón "Restaurar Catálogo Base" que repone los 12 productos de fábrica si se borraron o modificaron registros de prueba.

### RF09: Formulario de Contacto y Asesoría Técnica
* **Descripción:** Vista interactiva `/contacto` que permite a clientes solicitar asesoría de equipamiento para home studio, micrófonos o interfaces.
* **Validaciones:** Campos obligatorios (nombre, correo electrónico válido, asunto y mensaje técnico de al menos 10 caracteres) con mensajes de error inmediatos y alerta de envío exitoso.

### RF10: Persistencia de Datos en Almacenamiento Local (`localStorage`)
* **Descripción:** Todas las modificaciones realizadas por el usuario o administrador deben persistir entre recargas del navegador mediante las siguientes claves:
  * `sonido_vivo_productos`: Colección del inventario de equipos.
  * `sonido_vivo_carrito`: Arreglo de artículos y cantidades en el carro.
  * `sonido_vivo_usuarios`: Base de usuarios registrados.
  * `sonido_vivo_sesion`: Usuario actualmente autenticado.
* **Autocorrección y Migración:** Si `localStorage` se encuentra vacío o con datos desactualizados, los servicios `productosStorage.js` y `authStorage.js` migran e inicializan automáticamente los datos base sin intervención manual.

---

## 4. Requerimientos No Funcionales (RNF)

### RNF01: Arquitectura Basada en Componentes y Modularidad
* El frontend debe estar construido con **React 18**, respetando el principio de responsabilidad única.
* Estructura modular dividida en:
  * `src/components/`: Piezas de interfaz reutilizables (`Header`, `Navbar`, `Footer`, `ProductoCard`, `ProductoFormModal`).
  * `src/pages/`: Vistas de primer nivel vinculadas a rutas.
  * `src/context/`: Manejo de estado transversal (`CartContext`, `AuthContext`).
  * `src/services/`: Capa de persistencia y lógica de datos desacoplada (`productosStorage`, `authStorage`).
  * `src/test/`: Suites de pruebas unitarias automatizadas.

### RNF02: Rendimiento y Optimización de Carga
* Compilación y empaquetado optimizados con **Vite**.
* El build de producción (`npm run build`) debe procesar la totalidad de los módulos en menos de 8 segundos generando un bundle comprimido menor a 300 kB (gzip).

### RNF03: Cobertura de Calidad y Pruebas Unitarias
* La aplicación debe contar con un entorno de pruebas moderno basado en **Vitest** y **React Testing Library** (reemplazando Jasmine/Karma según las directrices institucionales de EP2).
* Debe implementar un mínimo de **10 pruebas unitarias significativas** distribuidas en 3 categorías de evidencia: lógica/persistencia, componentes/props e interacción de usuario con Spies (`vi.fn()`).

### RNF04: Usabilidad, Accesibilidad y Diseño Responsivo
* La interfaz gráfica debe adaptarse perfectamente a pantallas de escritorio (1200px+), tablets (768px - 1024px) y dispositivos móviles (< 600px).
* Paleta visual inspirada en equipamiento de estudio profesional (fondo grafito oscuro `#090d16`, acento cian `#00c2ff`, esmeralda VU `#00e599`, y header en tono agua cristalina suave con contraste tipográfico AAA > 10:1).
* Tipografía primaria: *Montserrat* para encabezados y *Roboto* para lectura continua.

### RNF05: Portabilidad y Despliegue Limpio
* El repositorio debe ejecutarse en cualquier sistema operativo (Windows, macOS, Linux) siguiendo el flujo estándar:
  ```bash
  npm install
  npm test
  npm run dev
  ```
* No deben existir dependencias duras hacia rutas absolutas de la máquina de desarrollo ni incluirse carpetas generadas como `node_modules/` o `dist/` en el control de versiones.

---

## 5. Historias de Usuario (User Stories)

### US01: Búsqueda y Exploración de Catálogo
* **Como** sonidista o músico aficionado,  
* **Quiero** filtrar los equipos por nombre, categoría o descripción en tiempo real,  
* **Para** encontrar rápidamente el micrófono o interfaz que necesito sin esperar recargas de página.  
* **Criterios de Aceptación:**
  * **Dado** que estoy en la vista `/productos`,
  * **Cuando** escribo "shure" en el buscador,
  * **Entonces** la grilla se actualiza en menos de 100ms mostrando únicamente los productos coincidentes.

### US02: Beneficio de Descuento Institucional Duoc UC
* **Como** estudiante de la carrera de sonido o informática en Duoc UC,  
* **Quiero** que la tienda reconozca mi correo `@duocuc.cl`,  
* **Para** obtener automáticamente un 20% de descuento en el valor de mis equipos.  
* **Criterios de Aceptación:**
  * **Dado** que tengo artículos agregados en el carrito,
  * **Cuando** inicio sesión o ingreso un correo institucional con terminación `@duocuc.cl`,
  * **Entonces** el sistema aplica un 20% de rebaja en el subtotal y exhibe el monto descontado explícitamente.

### US03: Gestión de Unidades en el Carrito de Compras
* **Como** comprador online,  
* **Quiero** poder aumentar, reducir o eliminar artículos dentro de mi carro de compras,  
* **Para** ajustar mi presupuesto antes de confirmar el pedido.  
* **Criterios de Aceptación:**
  * **Dado** que tengo 1 unidad de los auriculares ATH-M50x en el carrito,
  * **Cuando** presiono el botón `+`,
  * **Entonces** la cantidad sube a 2, el subtotal se duplica instantáneamente y el badge de la barra de navegación incrementa en 1.

### US04: Creación y Edición de Productos por el Administrador
* **Como** administrador de inventario de Tienda Sonido Vivo,  
* **Quiero** registrar nuevos equipos o modificar los precios de los existentes mediante un formulario modal,  
* **Para** mantener la oferta comercial actualizada sin tocar archivos de código fuente.  
* **Criterios de Aceptación:**
  * **Dado** que he iniciado sesión con rol de administrador en `/admin`,
  * **Cuando** presiono "Nuevo Producto", completo los campos obligatorios con valores válidos y guardo,
  * **Entonces** el nuevo producto aparece inmediatamente en la tabla y se almacena en `localStorage`.

### US05: Restauración de Datos de Fábrica
* **Como** docente evaluador o administrador,  
* **Quiero** contar con un botón de reseteo del catálogo base,  
* **Para** restablecer la colección original de 12 productos si durante las pruebas se borraron o alteraron registros.  
* **Criterios de Aceptación:**
  * **Dado** que se eliminaron 5 productos en el panel de administración,
  * **Cuando** presiono el botón "Restaurar Catálogo Base" y confirmo,
  * **Entonces** el sistema recarga los 12 equipos de audio originales y actualiza la tabla en pantalla.

---

## 6. Matriz de Trazabilidad de Requerimientos

| Requerimiento | Componente / Archivo Fuente | Archivo de Pruebas Unitarias (Vitest) | Estado |
| :--- | :--- | :--- | :---: |
| **RF01: Rutas y Layout SPA** | `src/App.jsx`, `LayoutPrincipal.jsx` | Pruebas de integración manual y router | ✅ Implementado |
| **RF02: Catálogo y Búsqueda** | `src/pages/Productos.jsx`, `ProductoCard.jsx` | `src/test/ProductoCard.test.jsx` (Pruebas 6 y 7) | ✅ Implementado |
| **RF03: Detalle de Producto** | `src/pages/DetalleProducto.jsx` | Pruebas de navegación e integración | ✅ Implementado |
| **RF04: Carrito de Compras** | `src/context/CartContext.jsx`, `Carrito.jsx` | Pruebas de estado y cálculo de totales | ✅ Implementado |
| **RF05: Descuento Duoc 20%** | `src/services/authStorage.js`, `Carrito.jsx` | `src/test/productosStorage.test.js` | ✅ Implementado |
| **RF06: Auth y Roles** | `src/context/AuthContext.jsx`, `Login.jsx` | Validación interactiva de credenciales | ✅ Implementado |
| **RF07: Panel Admin (KPIs)** | `src/pages/Admin.jsx` | Métricas y control de acceso por rol | ✅ Implementado |
| **RF08: CRUD con Modales** | `ProductoFormModal.jsx`, `productosStorage.js` | `ProductoFormModal.test.jsx` (Pruebas 8, 9 y 10) | ✅ Implementado |
| **RF09: Formulario Contacto** | `src/pages/Contacto.jsx` | Validaciones y feedback interactivo | ✅ Implementado |
| **RF10: Persistencia Local** | `src/services/productosStorage.js` | `productosStorage.test.js` (Pruebas 1 a 5) | ✅ Implementado |

---

## 7. Diferencias Arquitectónicas entre Versión 1 (EV1) y Versión 2 (EP2)

| Dimensión Técnica | Versión 1 (EV1) — HTML/JS Tradicional | Versión 2 (EP2) — React 18 + Vite |
| :--- | :--- | :--- |
| **Modelo de Aplicación** | Multi-Page Application (MPA) con 12 archivos `.html` independientes. | Single Page Application (SPA) con `React Router v7` y `<Outlet />`. |
| **Renderizado de Interfaz** | Manipulación directa del DOM (`document.getElementById`, `innerHTML`). | Virtual DOM declarativo mediante JSX y estado reactivo (`useState`, `useMemo`). |
| **Gestión de Estado** | Variables globales en `window` y llamadas manuales a funciones en scripts. | Context API (`AuthContext`, `CartContext`) con desacoplamiento total. |
| **Operaciones CRUD** | Formularios en páginas separadas con redirecciones forzadas. | Modales reactivos in-situ (`<ProductoFormModal />`) con validación y vista previa. |
| **Pila de Pruebas** | Jasmine y Karma (requería configuración compleja de navegador). | **Vitest + React Testing Library + JSDOM** (ejecución ultra-rápida nativa de Vite). |
| **Identidad Visual** | Tema gamer de fantasía (Level-Up Gamer). | Tema moderno de audio profesional y Home Studio (**Tienda Sonido Vivo**). |
| **Recursos Gráficos** | Placeholders vectoriales genéricos. | **12 fotografías reales de equipos de audio** y logotipo oficial optimizado. |

---

## 8. Conclusiones y Estado de Entrega
La **Versión 2.0 de la ERS** refleja fielmente la totalidad de las funcionalidades implementadas en el código fuente de **Tienda Sonido Vivo**. El sistema cumple rigurosamente con los criterios de evaluación de la pauta de **Desarrollo Full Stack II (DSY1104)**, demostrando solidez técnica en arquitectura de componentes, persistencia local, control de accesos, reglas de negocio institucionales y pruebas unitarias automatizadas.
