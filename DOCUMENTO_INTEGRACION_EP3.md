# Documento de Integración Frontend - Backend (EP3) 🎧
**Asignatura:** DSY1104 · Desarrollo Full Stack II  
**Institución:** Duoc UC  
**Evaluación:** Evaluación Parcial 3 (EP3) — Semestre 2026  
**Proyecto:** Tienda Sonido Vivo (Audio Profesional, Monitores, Micrófonos e Interfaces)  

---

## 1. Visión General de la Solución Full Stack

La solución desarrollada para la **Evaluación Parcial 3** implementa una arquitectura desacoplada cliente-servidor compuesta por:

1. **Frontend (Capa de Presentación):** Aplicación de una sola página (SPA) construida con **React 18** y empaquetada con **Vite**. Gestiona rutas protegidas, estados globales de autenticación y carrito, y efectúa llamadas HTTP asíncronas con la API nativa `fetch`.
2. **Backend (Capa de Negocio y Servicios):** API RESTful desarrollada con **Spring Boot 3.3.5** y **Java 21 LTS**, estructurada bajo la arquitectura estándar de 3 capas (`Controller` ➔ `Service` ➔ `Repository`).
3. **Persistencia (Capa de Datos):** Servidor relacional **MySQL / MariaDB en XAMPP** (puerto `3307`), gestionado mediante **Spring Data JPA** y **Hibernate ORM** en modo `ddl-auto=update`.
4. **Seguridad y Control de Acceso:** **Spring Security 6** con sesiones totalmente sin estado (`SessionCreationPolicy.STATELESS`), encriptación de contraseñas con **BCrypt** y tokens criptográficos **JJWT 0.12.6 (HMAC-SHA256)** con roles `ROLE_ADMIN` y `ROLE_CLIENTE`.
5. **Documentación de API:** Interfaz interactiva **Swagger UI / OpenAPI 3** accesible en `http://localhost:8080/swagger-ui.html` con soporte de autorización Bearer.

---

## 2. Diagrama de Arquitectura y Comunicación

```
┌──────────────────────────────────────────────┐
│            FRONTEND: REACT 18 + VITE         │
│          http://localhost:5173               │
│                                              │
│  [ Páginas / Componentes ]                   │
│         │                                    │
│         ▼                                    │
│  [ AuthContext / CartContext ]               │
│         │                                    │
│         ▼                                    │
│  [ Servicios: api.js / authApi / prodApi ]   │
│  • Inyección de Header:                      │
│    Authorization: Bearer <token_jwt>         │
│  • Persistencia: localStorage                │
└──────────────────────┬───────────────────────┘
                       │
                       │ HTTP / JSON
                       │ (CORS: :5173 habilitado)
                       ▼
┌──────────────────────────────────────────────┐
│            BACKEND: SPRING BOOT 3.3.5        │
│          http://localhost:8080               │
│                                              │
│  [ JwtAuthFilter ] ─── Valida firma/claims   │
│         │                                    │
│         ▼                                    │
│  [ SecurityFilterChain ] ── Reglas de Roles  │
│         │                                    │
│         ├─► AuthController (/api/auth/**)    │
│         └─► ProductoController (/api/prod**) │
│                   │                          │
│                   ▼                          │
│          [ Servicios de Negocio ]            │
│         (AuthService / ProductoService)      │
│                   │                          │
│                   ▼                          │
│          [ Repositorios Spring Data JPA ]    │
│                   │                          │
└───────────────────┼──────────────────────────┘
                    │
                    │ JDBC (Puerto 3307)
                    ▼
┌──────────────────────────────────────────────┐
│       BASE DE DATOS RELACIONAL: MYSQL        │
│         Base de Datos: sonidovivo_db         │
│                                              │
│  • Tabla `usuarios`  (credenciales y roles)  │
│  • Tabla `productos` (catálogo y stock)      │
└──────────────────────────────────────────────┘
```

---

## 3. Matriz de Endpoints y Contratos de Integración

### 3.1 Servicios de Autenticación (`/api/auth`)

#### A. Iniciar Sesión (`POST /api/auth/login`)
- **Permiso:** Público.
- **Request Body:**
  ```json
  {
    "email": "admin@sonidovivo.cl",
    "password": "duoc123"
  }
  ```
- **Response `200 OK`:**
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBzb25pZG92aXZvLmNsIiwicm9sIjoiUk9MRV9BRE1JTiIsImlhdCI6MTc5NDU2OTI4NiwiZXhwIjoxNzk0NjU1Njg2fQ...",
    "tipo": "Bearer",
    "usuario": {
      "id": 1,
      "nombre": "Administrador Sonido Vivo",
      "email": "admin@sonidovivo.cl",
      "rol": "ROLE_ADMIN",
      "esDuoc": false
    }
  }
  ```
- **Response `401 Unauthorized`:** Credenciales inválidas.

#### B. Registro de Cliente (`POST /api/auth/registro`)
- **Permiso:** Público.
- **Reglas de Negocio:**
  - Mayoría de edad obligatoria ($\ge 18$ años).
  - Detección automática de dominio institucional `@duocuc.cl` / `@duoc.cl` para asignar `esDuoc: true` (20% descuento).
- **Request Body:**
  ```json
  {
    "nombre": "Estudiante Sonido",
    "email": "estudiante@duocuc.cl",
    "password": "claveSegura123",
    "fechaNacimiento": "2001-08-20"
  }
  ```
- **Response `201 Created`:** Retorna sesión activa y token JWT.
- **Response `400 Bad Request`:** Menor de 18 años o correo electrónico ya registrado.

#### C. Perfil de Sesión Activa (`GET /api/auth/me`)
- **Permiso:** Autenticado con `Authorization: Bearer <token>`.
- **Response `200 OK`:** Datos del usuario autenticado actual.
- **Response `401 Unauthorized`:** Token ausente, alterado o expirado.

---

### 3.2 Servicios de Catálogo de Productos (`/api/productos`)

| Verbo | Endpoint | Permiso Requerido | Descripción | Códigos HTTP |
| :---: | :--- | :---: | :--- | :---: |
| **GET** | `/api/productos` | Público | Lista todos los equipos o filtra con `?buscar=...` | `200 OK` |
| **GET** | `/api/productos/{id}` | Público | Obtiene la ficha técnica de un equipo por su ID | `200 OK` / `404 Not Found` |
| **GET** | `/api/productos/categoria/{cat}` | Público | Filtra por categoría (Micrófonos, Audífonos, etc.) | `200 OK` |
| **POST** | `/api/productos` | `ROLE_ADMIN` | Crea un nuevo producto y lo persiste en MySQL | `201 Created` / `400` / `403` |
| **PUT** | `/api/productos/{id}` | `ROLE_ADMIN` | Actualiza precio, stock o datos de un equipo | `200 OK` / `400` / `404` / `403` |
| **DELETE** | `/api/productos/{id}` | `ROLE_ADMIN` | Elimina físicamente el equipo en la base de datos | `204 No Content` / `404` / `403` |

---

## 4. Implementación del Cliente en Frontend (`React 18`)

El frontend integra un módulo HTTP desacoplado ubicado en `src/services/`:

1. **`api.js`**: Cliente base que encapsula `fetch`, inyecta dinámicamente la cabecera `Authorization: Bearer ${token}` y centraliza la captura de excepciones HTTP (`204`, `400`, `401`, `403`, `404`, `500`).
2. **`authApi.js`**: Maneja el ciclo de vida de autenticación (`loginApi`, `registroApi`, `getPerfilMeApi`, `cerrarSesionApi`), mapea el rol del backend (`ROLE_ADMIN` ➔ `admin`) y persiste el token en `localStorage.setItem('sonido_vivo_token', token)`.
3. **`productosApi.js`**: Métodos CRUD asíncronos (`getProductosApi`, `createProductoApi`, `updateProductoApi`, `deleteProductoApi`) con sincronización en tiempo real y fallback automático de alta disponibilidad.
4. **`AuthContext.jsx`**: Proveedor global de sesión que expone `usuario`, `esAdmin`, `tieneDescuentoDuoc`, funciones de login/logout y revalidación automática de token al recargar la página.

---

## 5. Persistencia y Base de Datos (MySQL en XAMPP)

- **Puerto de conexión:** `3307` (según archivo de configuración `B:\xampp\mysql\bin\my.ini`).
- **Base de datos:** `sonidovivo_db`.
- **Estrategia DDL:** `spring.jpa.hibernate.ddl-auto=update`.
- **Tablas generadas automáticamente:**
  - `usuarios`: `id`, `nombre`, `email` (único), `password` (BCrypt hash), `rol` (`enum('ROLE_ADMIN','ROLE_CLIENTE')`), `fecha_nacimiento`, `es_duoc`.
  - `productos`: `id`, `nombre`, `precio`, `categoria`, `imagen`, `descripcion`, `stock`.
- **Pre-carga automática (`DataLoader.java`):**
  - Si las tablas se encuentran vacías, siembra automáticamente los **12 productos oficiales de audio profesional** y las dos cuentas de prueba de la rúbrica.

---

## 6. Evidencia de Pruebas Automatizadas

La solución cuenta con un esquema de verificación dual que garantiza la estabilidad del sistema:

### 6.1 Frontend (Vitest + React Testing Library)
- **16 pruebas unitarias y de integración** distribuidas en 4 suites:
  - `productosStorage.test.js`: 5 pruebas de lógica de negocio y persistencia.
  - `apiIntegration.test.js`: 6 pruebas de integración HTTP, token JWT, normalización de roles y reglas de descuento.
  - `ProductoCard.test.jsx`: 2 pruebas de renderizado visual y props.
  - `ProductoFormModal.test.jsx`: 3 pruebas de validaciones, rangos de precio e interacción con Spies.
- **Resultado:** `16 passed (16) · 100% éxito`.

### 6.2 Backend (JUnit 5 + Spring Security Test + MockMvc)
- **14 pruebas de integración**:
  - `ProductoControllerTest.java`: 7 pruebas cubriendo verbos HTTP públicos, rechazo 403 sin token y autorización `ROLE_ADMIN`.
  - `AuthControllerTest.java`: 6 pruebas cubriendo login exitoso, login con contraseña errónea (401), registro de clientes, validación de mayoría de edad (400) y activación automática de beneficio institucional Duoc.
  - `SonidoVivoApplicationTests.java`: 1 prueba de levantamiento íntegro del contexto de Spring.
- **Resultado:** `14 passed (14) · BUILD SUCCESS`.
