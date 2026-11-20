# Guía de Grabación de Video y Defensa Técnica Individual (EP3) 🎬
**Asignatura:** DSY1104 · Desarrollo Full Stack II  
**Institución:** Duoc UC  
**Evaluación:** Evaluación Parcial 3 (EP3) — Semestre 2026  
**Ponderación:** 60% Defensa Individual / 40% Proyecto Grupal  

---

## ⚠️ Regla Crítica del Video Demostrativo

> **Importante (Docente / Rúbrica):**  
> La entrega del video demostrativo es **obligatoria**. Su ausencia no impide rendir la defensa técnica individual, pero **limita la calificación de cada indicador individual de la defensa a un máximo del 60% (nivel aceptable / nota 4.0)**, incluso si todas las respuestas son técnicamente perfectas. Con el video entregado, se puede alcanzar el **100% (nota 7.0)**.

---

## 📹 Parte 1: Estructura del Video Demostrativo (Duración sugerida: 6 a 9 minutos)

### Preparación previa antes de grabar:
1. **Pestaña 1 del navegador:** `http://localhost:5173/` (Frontend React en la página de inicio).
2. **Pestaña 2 del navegador:** `http://localhost:8080/swagger-ui.html` (Documentación Swagger).
3. **Pestaña 3 del navegador:** phpMyAdmin de XAMPP mostrando la base de datos `sonidovivo_db` y las tablas `productos` y `usuarios` (o terminal con MySQL).
4. **Terminal / VS Code:** Mostrando el backend Spring Boot ejecutándose y el frontend en Vite.

---

### Guion Minuto a Minuto del Video:

#### Minuto 0:00 - 1:00 · Portada e Identificación
* **Qué mostrar:** Pantalla inicial con el título del proyecto y los nombres de los integrantes.
* **Qué decir:** *"Buenas tardes profesor. Somos el equipo del proyecto Tienda Sonido Vivo, correspondiente al Contexto B de audio profesional para la Evaluación Parcial 3 de Desarrollo Full Stack II. En este video demostraremos la integración completa entre nuestro frontend React y el backend Spring Boot con persistencia real en MySQL y seguridad JWT."*

#### Minuto 1:00 - 2:30 · Demostración de Persistencia y Swagger UI
* **Qué mostrar:** Pestaña de Swagger UI (`/swagger-ui.html`) y MySQL en phpMyAdmin / terminal.
* **Qué hacer:**
  1. Ejecutar `GET /api/productos` en Swagger para mostrar la lista de equipos sembrada en MySQL.
  2. Mostrar en phpMyAdmin la tabla `productos` con los mismos 12 equipos oficiales.
  3. Ejecutar `POST /api/auth/login` con las credenciales de admin (`admin@sonidovivo.cl` / `duoc123`) y copiar el token JWT generado.
  4. Presionar el botón **Authorize 🔓** en Swagger, pegar el token Bearer y mostrar que los endpoints protegidos quedan habilitados.

#### Minuto 2:30 - 4:30 · Frontend React y Navegación del Catálogo
* **Qué mostrar:** `http://localhost:5173/productos`.
* **Qué hacer:**
  1. Escribir en el buscador en tiempo real (ej: *"Shure"*, *"Yamaha"*, *"Audífonos"*).
  2. Entrar al detalle de un producto (`/productos/1`) para mostrar la ficha técnica, precio en CLP y selector de unidades.
  3. Agregar 2 unidades al carrito y verificar que el ícono 🛒 del Navbar actualiza su badge numérico en tiempo real.

#### Minuto 4:30 - 6:30 · Registro con Reglas de Negocio y Beneficio Duoc UC
* **Qué mostrar:** Vista `/registro`.
* **Qué hacer:**
  1. Intentar registrar un usuario menor de 18 años para mostrar el rechazo de validación.
  2. Registrar un usuario con correo institucional `@duocuc.cl` (ej: `alumno.musica@duocuc.cl`).
  3. Explicar cómo el sistema detecta automáticamente la extensión `@duocuc.cl` para activar el **20% de descuento permanente**.
  4. Ir al carrito de compras y mostrar la línea de descuento verde con el ahorro del 20% aplicado al subtotal.
  5. Finalizar la compra y mostrar el modal de pedido confirmado con su ID de orden.

#### Minuto 6:30 - 8:30 · Panel de Administración y Operaciones CRUD en MySQL
* **Qué mostrar:** Vista `/admin`.
* **Qué hacer:**
  1. Demostrar la restricción por rol: Intentar acceder sin permisos y mostrar la pantalla de bloqueo `"Acceso Restringido"`.
  2. Iniciar sesión como Administrador (`admin@sonidovivo.cl` / `duoc123`).
  3. Entrar a `/admin` y mostrar los KPIs de inventario.
  4. **Crear un nuevo producto:** Presionar *"➕ Nuevo Producto"*, llenar datos y guardar. Mostrar la alerta de confirmación.
  5. **Editar un producto:** Modificar el precio o nombre del equipo recién creado.
  6. **Eliminar el producto:** Borrar el equipo y confirmar su eliminación.
  7. Mostrar rápidamente en phpMyAdmin que los cambios se reflejaron físicamente en la tabla `productos` de MySQL.

#### Minuto 8:30 - Cierre
* **Qué decir:** *"Con esto comprobamos la persistencia en base de datos, la autenticación sin estado mediante JWT, el control de acceso por roles y el consumo de la API REST desde React. Muchas gracias."*

---

## 🎯 Parte 2: Preparación para las 6 Áreas de la Defensa Técnica Individual (60%)

El docente formulará preguntas personalizadas sobre el código fuente. A continuación tienes las respuestas modelo para cada uno de los 6 indicadores de la rúbrica oficial:

### 1. `IE3.1.2` · Backend, Persistencia, Modelos y Lógica de Negocio (12%)
* **Pregunta Típica:** *¿Cómo viaja la información desde la base de datos hasta el controlador en el backend?*
* **Respuesta Modelo:**
  > *"Implementamos la arquitectura en capas estándar de Spring Boot:*
  > *1. **Entidad JPA (`Producto.java`):** Mapea la tabla `productos` mediante anotaciones `@Entity` y `@Table`, e incluye validaciones Jakarta como `@NotBlank` y `@Min(1)`.*
  > *2. **Repositorio (`ProductoRepository.java`):** Extiende de `JpaRepository<Producto, Long>`, heredando operaciones CRUD optimizadas sin requerir SQL manual.*
  > *3. **Servicio (`ProductoService.java`):** Aplica la lógica de negocio, manejo de excepciones (`ResponseStatusException(HttpStatus.NOT_FOUND)`) y aislamiento transaccional.*
  > *4. **Controlador (`ProductoController.java`):** Expone los métodos HTTP (`@GetMapping`, `@PostMapping`, etc.) y serializa las entidades en JSON hacia el cliente."*

---

### 2. `IE3.2.3` · API REST, Operaciones CRUD y Swagger (12%)
* **Pregunta Típica:** *¿Qué códigos de estado HTTP implementaron y cómo documentaron la API?*
* **Respuesta Modelo:**
  > *"Utilizamos semántica HTTP REST estricta:*
  > *- `200 OK`: Consultas exitosas (`GET`) y actualizaciones (`PUT`).*
  > *- `201 Created`: Creación de recursos (`POST /api/productos` y `POST /api/auth/registro`).*
  > *- `204 No Content`: Eliminación de recursos (`DELETE /api/productos/{id}`).*
  > *- `400 Bad Request`: Validaciones fallidas de Jakarta Bean (manejadas centralizadamente por `GlobalExceptionHandler`).*
  > *- `401 Unauthorized`: Credenciales erróneas o token ausente.*
  > *- `403 Forbidden`: Acceso a operaciones protegidas sin el rol requerido.*
  > *- `404 Not Found`: Recurso no encontrado.*
  > *Documentamos todo con OpenAPI 3 (`springdoc-openapi`) en `/swagger-ui.html`, configurando además el componente de seguridad BearerAuth para inyectar tokens directamente en la interfaz."*

---

### 3. `IE3.2.4` · Flujo de Integración Frontend/Backend (10%)
* **Pregunta Típica:** *¿Cómo se conecta React con Spring Boot y cómo manejaron los estados de carga y errores?*
* **Respuesta Modelo:**
  > *"En el frontend centralizamos la comunicación en el cliente `src/services/api.js` usando la función nativa `fetch()`.*
  > *Cada solicitud inyecta automáticamente el token JWT almacenado en `localStorage` en el encabezado `Authorization: Bearer <token>`.*
  > *Los componentes manejan estados explícitos de `cargando` (spinners) y `error` (mensajes de alerta visuales).*
  > *Además, los servicios cuentan con un mecanismo de alta disponibilidad (fallback) que mantiene operativo el catálogo si el servidor estuviera momentáneamente offline."*

---

### 4. `IE3.3.4` · Autenticación JWT, Roles y Autorización en Backend (10%)
* **Pregunta Típica:** *¿Dónde y cómo se valida el token JWT en Spring Boot para proteger las rutas?*
* **Respuesta Modelo:**
  > *"Configuramos Spring Security 6 con sesiones sin estado (`SessionCreationPolicy.STATELESS`) en `SecurityConfig.java`.*
  > *Antes del filtro de usuario/contraseña, registramos nuestro filtro personalizado `JwtAuthFilter` (`OncePerRequestFilter`). Este intercepta cada petición entrante, extrae el token del header `Authorization`, lo valida criptográficamente con clave HMAC-SHA256 en `JwtUtils.java` y obtiene el correo (subject).*
  > *Luego, mediante `UserDetailsServiceImpl` se cargan los roles del usuario y se construye el `UsernamePasswordAuthenticationToken`, estableciéndolo en el `SecurityContextHolder`.*
  > *De este modo, endpoints como `POST`, `PUT` y `DELETE` en `/api/productos` quedan estrictamente restringidos con `.hasRole('ADMIN')`."*

---

### 5. `IE3.3.5` · Gestión y Persistencia de Sesión en Frontend (8%)
* **Pregunta Típica:** *¿Qué ocurre en el frontend si el usuario recarga la página con F5?*
* **Respuesta Modelo:**
  > *"La sesión no se pierde gracias a nuestro `AuthContext.jsx`:*
  > *1. Al iniciar sesión o registrarse, el token se guarda en `localStorage` (`sonido_vivo_token`) junto a los datos públicos del usuario en `sonido_vivo_sesion`.*
  > *2. En el montaje del contexto (`useEffect`), leemos inmediatamente los datos locales para evitar parpadeos en la interfaz y acto seguido ejecutamos una llamada asíncrona a `GET /api/auth/me` enviando el Bearer token.*
  > *3. Si el token sigue vigente, se revalida la sesión con los datos frescos del backend; si el token expiró o fue adulterado, se limpian las claves de `localStorage` y la sesión vuelve a estado anónimo de forma segura."*

---

### 6. `IE3.3.6` · Control de Acceso a Interfaces y Acciones (8%)
* **Pregunta Típica:** *¿Cómo garantizan que un cliente no pueda entrar al panel de administración o modificar datos?*
* **Respuesta Modelo:**
  > *"Aplicamos el principio de seguridad en profundidad (doble barrera):*
  > *1. **En Frontend:** El enlace `⚙️ Admin` en el Navbar solo se renderiza si `usuario.rol === 'admin'`. Además, la vista `Admin.jsx` valida condicionalmente el rol del usuario en el contexto; si no es administrador, despliega una pantalla de bloqueo de acceso restringido.*
  > *2. **En Backend:** Aunque un usuario malicioso intentara saltarse la vista de React y enviar peticiones directas vía Postman o terminal hacia `POST /api/productos`, Spring Security intercepta la solicitud y la rechaza inmediatamente con código `403 Forbidden` al no poseer el authority `ROLE_ADMIN` en el token JWT."*
