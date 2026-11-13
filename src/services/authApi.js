import {
  apiFetch,
  removeAuthToken,
  SESSION_KEY,
  setAuthToken,
} from "./api.js";

/**
 * Servicio de Autenticación y Gestión de Sesión conectado a Spring Boot.
 * Tienda Sonido Vivo — DSY1104 EP3
 */

/**
 * Valida si un correo electrónico pertenece a la comunidad Duoc UC.
 */
export function esCorreoDuoc(email) {
  if (!email) return false;
  return /@([a-zA-Z0-9.-]+\.)?duoc(uc)?\.cl$/i.test(String(email).trim());
}

/**
 * Valida si el usuario es mayor o igual a 18 años según su fecha de nacimiento.
 */
export function esMayorDeEdad(fechaNacimiento) {
  if (!fechaNacimiento) return false;
  const nacimiento = new Date(fechaNacimiento + "T00:00:00");
  if (isNaN(nacimiento.getTime())) return false;
  const hoy = new Date();
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const m = hoy.getMonth() - nacimiento.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }
  return edad >= 18;
}

/**
 * Normaliza los datos del usuario retornado por Spring Boot para que sean
 * compatibles tanto con el formato frontend ('admin' / 'cliente') como con Spring Security ('ROLE_ADMIN' / 'ROLE_CLIENTE').
 */
export function normalizarUsuario(rawUser) {
  if (!rawUser) return null;
  const rolUpper = String(rawUser.rol || "").toUpperCase();
  const esAdmin = rolUpper === "ROLE_ADMIN" || rolUpper === "ADMIN";

  return {
    ...rawUser,
    id: rawUser.id,
    nombre: rawUser.nombre,
    email: rawUser.email,
    username: rawUser.email ? rawUser.email.split("@")[0] : rawUser.nombre,
    rol: esAdmin ? "admin" : "cliente",
    rolSpring: rawUser.rol,
    esAdmin,
    descuentoDuoc: Boolean(rawUser.esDuoc || rawUser.descuentoDuoc),
    esDuoc: Boolean(rawUser.esDuoc || rawUser.descuentoDuoc),
  };
}

/**
 * Inicia sesión contra el backend Spring Boot (POST /api/auth/login).
 * Guarda el token JWT y la sesión en localStorage.
 */
export async function loginApi(emailOUsername, password) {
  try {
    const data = await apiFetch("/auth/login", {
      method: "POST",
      body: {
        email: emailOUsername.trim(),
        password,
      },
    });

    if (data.token) {
      setAuthToken(data.token);
    }

    const usuarioNormalizado = normalizarUsuario(data.usuario);
    guardarSesion(usuarioNormalizado);

    return {
      ok: true,
      token: data.token,
      usuario: usuarioNormalizado,
    };
  } catch (err) {
    return {
      ok: false,
      error:
        err.message ||
        "Credenciales incorrectas o error de comunicación con el servidor.",
    };
  }
}

/**
 * Registra un nuevo usuario cliente en el backend Spring Boot (POST /api/auth/registro).
 * Guarda automáticamente el token JWT y la sesión activa.
 */
export async function registroApi({ nombre, email, password, fechaNacimiento }) {
  try {
    const data = await apiFetch("/auth/registro", {
      method: "POST",
      body: {
        nombre: nombre.trim(),
        email: email.trim().toLowerCase(),
        password,
        fechaNacimiento,
      },
    });

    if (data.token) {
      setAuthToken(data.token);
    }

    const usuarioNormalizado = normalizarUsuario(data.usuario);
    guardarSesion(usuarioNormalizado);

    return {
      ok: true,
      token: data.token,
      usuario: usuarioNormalizado,
    };
  } catch (err) {
    return {
      ok: false,
      error:
        err.message ||
        "Error al registrar la cuenta. Revisa los datos ingresados.",
    };
  }
}

/**
 * Obtiene el perfil del usuario autenticado actualmente desde el backend (GET /api/auth/me).
 */
export async function getPerfilMeApi() {
  try {
    const data = await apiFetch("/auth/me", { method: "GET" });
    const usuarioNormalizado = normalizarUsuario(data);
    guardarSesion(usuarioNormalizado);
    return usuarioNormalizado;
  } catch (err) {
    cerrarSesionApi();
    return null;
  }
}

/**
 * Guarda la sesión de usuario en localStorage.
 */
export function guardarSesion(usuario) {
  if (usuario) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(usuario));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
}

/**
 * Obtiene la sesión almacenada en localStorage.
 */
export function getSesionActual() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    return null;
  }
}

/**
 * Cierra la sesión activa removiendo el token JWT y los datos de sesión.
 */
export function cerrarSesionApi() {
  removeAuthToken();
  localStorage.removeItem(SESSION_KEY);
}
