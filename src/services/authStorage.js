const USERS_KEY = "sonido_vivo_usuarios";
const SESSION_KEY = "sonido_vivo_sesion";

const ADMIN_POR_DEFECTO = {
  id: "u_admin",
  nombre: "Administrador Sonido Vivo",
  email: "admin@sonidovivo.cl",
  username: "admin",
  password: "duoc123",
  rol: "admin",
  descuentoDuoc: true,
  creado: "2026-01-01T00:00:00.000Z",
};

/**
 * Valida si un correo electrónico pertenece a la comunidad Duoc UC.
 * Otorga automáticamente 20% de descuento permanente.
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
 * Obtiene la lista de usuarios registrados.
 * Garantiza la existencia del usuario administrador inicial.
 */
export function getUsuarios() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) {
      const inicial = [ADMIN_POR_DEFECTO];
      localStorage.setItem(USERS_KEY, JSON.stringify(inicial));
      return inicial;
    }
    const usuarios = JSON.parse(raw);
    if (!Array.isArray(usuarios)) return [ADMIN_POR_DEFECTO];

    // Asegurar que el admin siempre exista
    if (!usuarios.some((u) => u.username === "admin" || u.email.toLowerCase() === "admin@sonidovivo.cl")) {
      usuarios.unshift(ADMIN_POR_DEFECTO);
      localStorage.setItem(USERS_KEY, JSON.stringify(usuarios));
    }
    return usuarios;
  } catch (err) {
    console.error("Error al leer usuarios:", err);
    return [ADMIN_POR_DEFECTO];
  }
}

/**
 * Registra un nuevo cliente aplicando validaciones y regla de descuento Duoc.
 */
export function registrarUsuario({ nombre, email, fechaNacimiento, password }) {
  const usuarios = getUsuarios();
  const emailNorm = String(email).trim().toLowerCase();

  if (usuarios.some((u) => u.email.toLowerCase() === emailNorm)) {
    return { ok: false, error: "Ya existe una cuenta registrada con este correo electrónico." };
  }

  if (!esMayorDeEdad(fechaNacimiento)) {
    return { ok: false, error: "Debes ser mayor de 18 años para registrarte en la tienda." };
  }

  const tieneDuoc = esCorreoDuoc(emailNorm);

  const nuevoUsuario = {
    id: "u_" + Date.now(),
    nombre: nombre.trim(),
    email: emailNorm,
    username: emailNorm.split("@")[0],
    fechaNacimiento,
    password,
    rol: "cliente",
    descuentoDuoc: tieneDuoc,
    creado: new Date().toISOString(),
  };

  const listaActualizada = [...usuarios, nuevoUsuario];
  localStorage.setItem(USERS_KEY, JSON.stringify(listaActualizada));

  // Autologin al registrarse
  guardarSesion(nuevoUsuario);

  return { ok: true, usuario: nuevoUsuario };
}

/**
 * Inicia sesión verificando usuario/correo y contraseña.
 */
export function autenticarUsuario(identificador, password) {
  const usuarios = getUsuarios();
  const idLimpio = String(identificador).trim().toLowerCase();

  const usuario = usuarios.find(
    (u) =>
      (u.username.toLowerCase() === idLimpio || u.email.toLowerCase() === idLimpio) &&
      u.password === password
  );

  if (!usuario) {
    return { ok: false, error: "Credenciales incorrectas. Revisa tu usuario/correo y contraseña." };
  }

  guardarSesion(usuario);
  return { ok: true, usuario };
}

/**
 * Guarda la sesión activa en localStorage.
 */
export function guardarSesion(usuario) {
  // Evitamos guardar la password en la sesión activa por seguridad
  const { password, ...datosSeguros } = usuario;
  localStorage.setItem(SESSION_KEY, JSON.stringify(datosSeguros));
}

/**
 * Retorna la sesión activa o null si no hay sesión iniciada.
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
 * Cierra la sesión activa.
 */
export function cerrarSesion() {
  localStorage.removeItem(SESSION_KEY);
}
