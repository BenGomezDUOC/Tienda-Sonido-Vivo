/**
 * Cliente HTTP centralizado para comunicación REST con Spring Boot.
 * Tienda Sonido Vivo — DSY1104 Evaluación Parcial 3 (EP3)
 */

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export const TOKEN_KEY = "sonido_vivo_token";
export const SESSION_KEY = "sonido_vivo_sesion";

/**
 * Obtiene el token JWT almacenado en localStorage.
 */
export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Almacena el token JWT en localStorage.
 */
export function setAuthToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

/**
 * Remueve el token JWT de localStorage.
 */
export function removeAuthToken() {
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * Ejecuta una petición HTTP a la API REST de Spring Boot con inyección automática
 * de la cabecera 'Authorization: Bearer <token>' cuando el usuario está autenticado.
 */
export async function apiFetch(endpoint, options = {}) {
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${cleanEndpoint}`;

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...options.headers,
  };

  const token = getAuthToken();
  if (token && !headers["Authorization"]) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  if (config.body && typeof config.body !== "string") {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(url, config);

  // Manejo de respuesta HTTP 204 No Content
  if (response.status === 204) {
    return null;
  }

  let data;
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    let mensaje = `Error HTTP ${response.status}: ${response.statusText}`;

    if (typeof data === "object" && data !== null) {
      mensaje = data.message || data.error || mensaje;
    } else if (typeof data === "string" && data.trim()) {
      mensaje = data;
    }

    const error = new Error(mensaje);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export default {
  API_BASE_URL,
  TOKEN_KEY,
  SESSION_KEY,
  getAuthToken,
  setAuthToken,
  removeAuthToken,
  apiFetch,
};
