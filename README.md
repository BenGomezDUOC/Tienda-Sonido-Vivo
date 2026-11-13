# Tienda Sonido Vivo — Proyecto Semestral DSY1104 (Evaluación Parcial 3) 🎧

![Tienda Sonido Vivo](https://img.shields.io/badge/Caso%20B-Tienda%20Sonido%20Vivo-00c2ff?style=for-the-badge)
![Duoc UC](https://img.shields.io/badge/Duoc%20UC-Desarrollo%20Full%20Stack%20II-38bdf8?style=for-the-badge&labelColor=090d16)
![Frontend](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-blue?style=for-the-badge)
![Backend](https://img.shields.io/badge/Backend-Spring%20Boot%203.3.5-brightgreen?style=for-the-badge)
![Base de Datos](https://img.shields.io/badge/Persistencia-MySQL%20(XAMPP%20:3307)-orange?style=for-the-badge)
![Seguridad](https://img.shields.io/badge/Seguridad-Spring%20Security%206%20%2B%20JWT-red?style=for-the-badge)
![Testing](https://img.shields.io/badge/Testing-16%20Vitest%20%7C%2014%20JUnit-00e599?style=for-the-badge)

Este repositorio contiene el **Frontend (React 18 + Vite)** completamente integrado con el **Backend (Spring Boot 3 + MySQL)** para la **Evaluación Parcial 3 (EP3)** de la asignatura **Desarrollo Full Stack II (DSY1104)** en Duoc UC.

---

## 🔗 Repositorio del Backend

El backend se encuentra alojado en su propio repositorio independiente:  
👉 **[Repositorio Backend Spring Boot — backend-sonido-vivo](https://github.com/BenGomezDUOC/backend-sonido-vivo)**

---

## 🎧 Acerca de Tienda Sonido Vivo

**Tienda Sonido Vivo** es un comercio especializado en la comercialización de equipamiento de audio profesional, instrumentos, home studio y accesorios de alta fidelidad en Chile.

- **Misión:** Acercar la más alta fidelidad sonora y equipamiento profesional a músicos, productores, creadores de contenido y amantes del audio en todo Chile.
- **Visión:** Posicionarse como el referente online en asesoría y distribución de marcas líderes de audio profesional en el país.

---

## 📑 Documentos Oficiales de Entrega

* 📘 **[DOCUMENTO_INTEGRACION_EP3.md](./DOCUMENTO_INTEGRACION_EP3.md):** Arquitectura cliente-servidor, contratos de endpoints, flujo JWT, mapeo de roles y configuración MySQL.
* 📗 **[DOCUMENTO_ERS_EP2.md](./DOCUMENTO_ERS_EP2.md):** Especificación de Requerimientos de Software (RF01-RF10, RNF01-RNF05 e Historias de Usuario).
* 🧪 **[DOCUMENTO_TESTING_EP2.md](./DOCUMENTO_TESTING_EP2.md):** Estrategia de testing unitario y cobertura de componentes.

---

## 🏛️ Arquitectura Full Stack de la Solución

```
[ FRONTEND :5173 ]               [ BACKEND :8080 ]             [ MYSQL :3307 ]
  React 18 + Vite                Spring Boot 3.3.5             XAMPP Database
┌──────────────────┐            ┌──────────────────┐          ┌──────────────┐
│ • UI Catálogo    │  HTTP/JSON │ • JwtAuthFilter  │   JDBC   │              │
│ • Panel Admin    │───────────►│ • SecurityConfig │─────────►│ sonidovivo_db│
│ • JWT en Storage │ (fetch)    │ • AuthController │          │              │
│ • Carrito + Duoc │◄───────────│ • ProductoContr. │◄─────────│ • usuarios   │
└──────────────────┘            │ • JPA + Hibernate│          │ • productos  │
                                └──────────────────┘          └──────────────┘
```

---

## 👥 Cuentas de Acceso Sembradas en MySQL

| Perfil | Correo Electrónico | Contraseña | Rol Spring | Rol Frontend | Beneficio |
| :--- | :--- | :--- | :---: | :---: | :---: |
| **Administrador** | `admin@sonidovivo.cl` | `duoc123` | `ROLE_ADMIN` | `admin` | Acceso CRUD total a `/admin` |
| **Cliente Duoc** | `alumno@duocuc.cl` | `duoc123` | `ROLE_CLIENTE` | `cliente` | 20% Descuento automático |

---

## 🚀 Cómo Ejecutar la Solución Completa

### Paso 1: Iniciar MySQL en XAMPP
Asegúrate de que MySQL esté iniciado en el puerto **`3307`** (o el puerto configurado en XAMPP).

### Paso 2: Iniciar el Backend Spring Boot
Abre una terminal en la carpeta `backend-sonidovivo`:
```powershell
.\mvnw.cmd spring-boot:run
```
El backend estará disponible en **`http://localhost:8080`**.  
Documentación Swagger UI: **[http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)**.

### Paso 3: Iniciar el Frontend React + Vite
Abre otra terminal en la carpeta `Tienda Sonido Vivo`:
```powershell
npm install
npm run dev
```
La aplicación abrirá en **`http://localhost:5173`**.

---

## 🧪 Pruebas Automatizadas

### Pruebas de Frontend (16 pruebas con Vitest)
```bash
npm test
```
- Validaciones de formulario y componentes UI.
- Lógica de persistencia local y fallback.
- Integración de cliente HTTP `api.js` y normalización de tokens/roles.

### Pruebas de Backend (14 pruebas con JUnit 5)
```powershell
cd ../backend-sonidovivo
.\mvnw.cmd test
```
- Controladores REST (`ProductoControllerTest`, `AuthControllerTest`).
- Seguridad Spring Security 6 (rechazo 401/403 sin token y autorización de admin).
- Validaciones de negocio (mayoría de edad $\ge 18$, descuento Duoc).

---

## 🎓 Regla de Negocio Institucional Duoc UC

Todo usuario registrado o compra efectuada con correos institucionales terminados en `@duocuc.cl`, `@profesor.duoc.cl` o `@alumnos.duoc.cl` recibe de forma automática un **20% de descuento vitalicio** aplicado directamente sobre el subtotal del carrito.

---

## 📝 Información Académica

- **Asignatura:** Desarrollo Full Stack II (DSY1104)
- **Institución:** Duoc UC
- **Evaluación:** Evaluación Parcial 3 (EP3) — Semestre 2026
- **Contexto:** Opción B — Tienda Sonido Vivo (Audio profesional, equipos y accesorios)
