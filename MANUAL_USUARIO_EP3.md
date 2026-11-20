# Manual de Usuario y Operación del Sistema — Tienda Sonido Vivo 🎧
**Asignatura:** DSY1104 · Desarrollo Full Stack II  
**Institución:** Duoc UC  
**Evaluación:** Evaluación Parcial 3 (EP3) — Semestre 2026  
**Plataforma:** React 18 + Vite · Spring Boot 3.3.5 · MySQL (XAMPP :3307) · JWT  

---

## 1. Introducción y Propósito del Manual

El presente manual describe paso a paso la operación y los flujos funcionales de la plataforma **Tienda Sonido Vivo** (comercio electrónico de audio profesional, monitores de estudio, micrófonos, interfaces y accesorios).

La aplicación opera bajo una arquitectura cliente-servidor integrada:
- **Frontend SPA:** Interfaz responsiva interactiva construida con **React 18** y **Vite** (`http://localhost:5173`).
- **Backend API REST:** Servicios de negocio y seguridad construidos con **Spring Boot 3.3.5** y **Java 21 LTS** (`http://localhost:8080`).
- **Base de Datos Persistente:** Servidor relacional **MySQL en XAMPP** (puerto `3307`), gestionado con Spring Data JPA y Hibernate.
- **Seguridad:** Tokens criptográficos **JWT (HMAC-SHA256)** con control de acceso basado en roles (`ROLE_ADMIN` y `ROLE_CLIENTE`).

---

## 2. Requisitos y Puesta en Marcha

Para operar el sistema en un entorno local, se deben iniciar los siguientes tres servicios en orden:

```
┌───────────────────────────┐      ┌───────────────────────────┐      ┌───────────────────────────┐
│     1. SERVICIO MYSQL     │      │     2. BACKEND SPRING     │      │    3. FRONTEND REACT      │
│  XAMPP Control: Start     │ ───► │  .\mvnw.cmd spring-boot:run│ ───► │      npm run dev          │
│       Puerto 3307         │      │        Puerto 8080        │      │        Puerto 5173        │
└───────────────────────────┘      └───────────────────────────┘      └───────────────────────────┘
```

1. **Iniciar MySQL en XAMPP:**
   - Abrir el panel de control de XAMPP y presionar **Start** en el módulo **MySQL** (verificar que corra en el puerto `3307`).
2. **Iniciar el Backend Spring Boot:**
   - Abrir una terminal en `backend-sonidovivo/` y ejecutar:
     ```powershell
     .\mvnw.cmd spring-boot:run
     ```
   - El servidor confirmará: `Tomcat started on port 8080 (http)`.
3. **Iniciar el Frontend React:**
   - Abrir otra terminal en `Tienda Sonido Vivo/` y ejecutar:
     ```powershell
     npm run dev
     ```
   - Abrir en el navegador web: `http://localhost:5173`.

---

## 3. Cuentas de Acceso Predefinidas (Sembradas en MySQL)

| Rol del Usuario | Correo Electrónico | Contraseña | Permisos y Beneficios |
| :--- | :--- | :---: | :--- |
| **Administrador** | `admin@sonidovivo.cl` | `duoc123` | Acceso completo al Panel de Administración (`/admin`), métricas en tiempo real y operaciones CRUD de inventario (Crear, Editar y Eliminar equipos). |
| **Cliente Duoc** | `alumno@duocuc.cl` | `duoc123` | Acceso a compras con **20% de descuento institucional vitalicio** aplicado automáticamente en el carrito. |

---

## 4. Guía de Operación Paso a Paso

### 4.1 Navegación y Exploración del Catálogo (`/productos`)

1. Al acceder a la tienda, el menú superior permite navegar entre **Inicio**, **Productos**, **Contacto**, **Carrito** e **Ingresar**.
2. En la vista **Productos**, el catálogo carga los equipos de audio persistidos en la base de datos MySQL mediante `GET /api/productos`.
3. **Buscador en tiempo real:** Escribir en la barra de búsqueda para filtrar instantáneamente por nombre de equipo (ej: *Shure*, *Yamaha*, *Audio-Technica*) o por categoría de audio (ej: *Micrófonos*, *Audífonos*, *Interfaces*).
4. **Ficha técnica:** Al hacer clic en un producto o en el botón *"Ver Detalle"*, se abre la vista individual con especificaciones técnicas, precio unitario formateado en pesos chilenos ($ CLP), disponibilidad de stock y sistema de reseñas con estrellas.

---

### 4.2 Registro de Nuevos Clientes (`/registro`)

1. Hacer clic en **"Crear cuenta"** en la barra superior.
2. Completar los campos del formulario:
   - **Nombre completo:** Mínimo 3 caracteres.
   - **Correo electrónico:** Formato válido (ej: `nuevo.cliente@correo.cl`).
     > **💡 Beneficio Duoc UC:** Si se ingresa un correo con dominio `@duocuc.cl` o `@duoc.cl`, el sistema detecta la pertenencia institucional y activa automáticamente el **20% de descuento vitalicio**.
   - **Fecha de nacimiento:** El sistema valida obligatoriamente que el usuario tenga **al menos 18 años** al momento del registro.
   - **Contraseña:** Mínimo 4 caracteres (se almacena encriptada con algoritmo hash BCrypt).
3. Presionar **"Crear Cuenta"**. El backend registrará al usuario en MySQL (`POST /api/auth/registro`), emitirá su token JWT y abrirá la sesión inmediatamente.

---

### 4.3 Inicio de Sesión y Manejo de Tokens JWT (`/login`)

1. Hacer clic en **"Ingresar"** en el menú superior.
2. Ingresar las credenciales (por ejemplo, el administrador `admin@sonidovivo.cl` / `duoc123`).
3. El frontend enviará una solicitud `POST /api/auth/login`.
4. Al autenticar exitosamente:
   - El token JWT es almacenado en `localStorage` bajo la clave `sonido_vivo_token`.
   - La sesión se guarda en `sonido_vivo_sesion`.
   - El Navbar se actualiza dinámicamente mostrando el saludo del usuario, el badge de rol (`🛡️ Admin` o `👤 Cliente`) y el botón **Salir**.
   - Si el usuario es Administrador, se habilita el enlace **"⚙️ Admin"** en el Navbar y se redirige automáticamente al panel.
5. **Persistencia tras recarga:** Al pulsar **F5** o recargar el navegador, el `AuthContext` revalida el token contra `GET /api/auth/me` manteniendo la sesión activa sin solicitar credenciales nuevamente.

---

### 4.4 Carrito de Compras y Regla de Descuento Institucional (`/carrito`)

1. Desde el catálogo o el detalle de cualquier producto, presionar **"Agregar al Carrito"**.
2. El ícono 🛒 del Navbar mostrará un contador numérico con la cantidad total de unidades seleccionadas.
3. En la vista **Carrito**, el cliente puede:
   - Incrementar o decrementar la cantidad de cada producto mediante los botones `+` y `-`.
   - Eliminar un producto individual o vaciar el carrito completo.
   - Observar el desglose financiero:
     - **Subtotal:** Suma de los precios unitarios.
     - **Descuento Duoc (20%):** Si la sesión corresponde a un correo institucional Duoc, se muestra una línea destacada en verde con el ahorro exacto.
     - **Total a Pagar:** Monto final ajustado.
4. Al hacer clic en **"Finalizar Compra"**, el sistema genera un número de orden único (ej: `SV-849201`), vacía el carrito y despliega la confirmación de pedido con el detalle financiero.

---

### 4.5 Panel de Administración y Operaciones CRUD en MySQL (`/admin`)

> **Restricción de Acceso:** La ruta `/admin` está protegida por rol. Si un usuario no autenticado o un cliente común intenta ingresar, el sistema bloquea la vista con un mensaje de **"Acceso Restringido (🔒)"**.

Una vez iniciada sesión con la cuenta de Administrador:

1. **Indicadores KPI en Tiempo Real:**
   - Total de equipos activos en inventario.
   - Cantidad de categorías únicas.
   - Precio promedio de catálogo.
2. **Crear un Nuevo Producto (POST):**
   - Presionar el botón **"➕ Nuevo Producto"**.
   - Ingresar nombre, categoría, precio en CLP y seleccionar una fotografía del catálogo.
   - Presionar **"Guardar Producto"**. La petición se envía con el encabezado `Authorization: Bearer <token>` a `POST /api/productos`.
   - El equipo queda persistido físicamente en MySQL y aparece al inicio de la tabla.
3. **Editar un Producto Existente (PUT):**
   - En la tabla de inventario, presionar el botón **"✏️ Editar"** del equipo correspondiente.
   - Modificar cualquiera de sus atributos (por ejemplo, actualizar su precio o nombre).
   - Presionar **"Guardar Cambios"**. Se ejecuta `PUT /api/productos/{id}` y la tabla se actualiza.
4. **Eliminar un Producto (DELETE):**
   - En la fila del equipo a retirar, presionar **"🗑️ Eliminar"**.
   - Confirmar en el cuadro de diálogo del navegador.
   - Se ejecuta `DELETE /api/productos/{id}` con código HTTP `204 No Content`, borrando el registro de MySQL.

---

### 4.6 Documentación Interactiva Swagger UI (`/swagger-ui.html`)

Para evaluar y probar directamente la API REST sin pasar por la interfaz de usuario:

1. Abrir en el navegador: **`http://localhost:8080/swagger-ui.html`**.
2. Se desplegarán los dos grupos de controladores:
   - **`Autenticación y Sesión`** (`/api/auth/**`).
   - **`Catálogo de Productos`** (`/api/productos/**`).
3. **Prueba de Endpoint Público:**
   - Desplegar `GET /api/productos`, presionar **"Try it out"** y luego **"Execute"**. Se obtendrá el JSON con el catálogo completo y código `200 OK`.
4. **Prueba de Autenticación con Token:**
   - Desplegar `POST /api/auth/login`, ingresar credenciales de admin y presionar **Execute**.
   - Copiar el valor del campo `token`.
   - Subir al inicio de la página y presionar el botón verde **"Authorize 🔓"**.
   - Pegar el token en el campo `BearerAuth` y presionar **Authorize**.
   - Ahora es posible ejecutar `POST`, `PUT` y `DELETE` sobre `/api/productos` directamente desde Swagger con autorización garantizada.
