import { apiFetch } from "./api.js";
import {
  getProductos as getProductosStorage,
  getProductoById as getProductoByIdStorage,
  createProducto as createProductoStorage,
  updateProducto as updateProductoStorage,
  deleteProducto as deleteProductoStorage,
} from "./productosStorage.js";

/**
 * Servicio de Productos conectado a la API REST de Spring Boot con persistencia MySQL.
 * Incluye fallback automático a almacenamiento local en caso de que el backend esté offline.
 * Tienda Sonido Vivo — DSY1104 EP3
 */

/**
 * Normaliza los campos del producto entre el modelo de backend y el frontend.
 * Nota: El frontend usa `imagen` mientras que la entidad JPA puede tener `imagenUrl` o `imagen`.
 */
function normalizarProducto(p) {
  if (!p) return null;
  return {
    ...p,
    id: Number(p.id),
    nombre: p.nombre,
    precio: Number(p.precio) || 0,
    categoria: p.categoria,
    imagen: p.imagen || p.imagenUrl || "/img/audio-placeholder.svg",
    imagenUrl: p.imagen || p.imagenUrl || "/img/audio-placeholder.svg",
    descripcion: p.descripcion || "",
    stock: p.stock !== undefined ? Number(p.stock) : 10,
  };
}

/**
 * Obtiene todos los productos del catálogo desde Spring Boot (GET /api/productos).
 * Soporta parámetro de búsqueda opcional (?buscar=...).
 */
export async function getProductosApi(buscar = "") {
  try {
    const endpoint = buscar.trim()
      ? `/productos?buscar=${encodeURIComponent(buscar.trim())}`
      : "/productos";
    const data = await apiFetch(endpoint, { method: "GET" });
    if (Array.isArray(data)) {
      return data.map(normalizarProducto);
    }
    return [];
  } catch (err) {
    console.warn("Backend REST inaccesible. Usando fallback de almacenamiento local:", err.message);
    const locales = getProductosStorage();
    if (!buscar.trim()) return locales;
    const q = buscar.trim().toLowerCase();
    return locales.filter(
      (p) =>
        p.nombre.toLowerCase().includes(q) ||
        p.categoria.toLowerCase().includes(q)
    );
  }
}

/**
 * Obtiene el detalle de un producto por su ID (GET /api/productos/{id}).
 */
export async function getProductoByIdApi(id) {
  try {
    const data = await apiFetch(`/productos/${id}`, { method: "GET" });
    return normalizarProducto(data);
  } catch (err) {
    console.warn(`No se pudo obtener producto ${id} desde backend:`, err.message);
    return getProductoByIdStorage(id);
  }
}

/**
 * Crea un nuevo producto en MySQL a través de Spring Boot (POST /api/productos).
 * Requiere rol ROLE_ADMIN en el token JWT.
 */
export async function createProductoApi(datos) {
  const payload = {
    nombre: datos.nombre.trim(),
    precio: Number(datos.precio) || 0,
    categoria: datos.categoria || "Accesorios",
    imagen: datos.imagen || datos.imagenUrl || "/img/audio-placeholder.svg",
    descripcion: datos.descripcion || "",
    stock: datos.stock !== undefined ? Number(datos.stock) : 10,
  };

  try {
    const data = await apiFetch("/productos", {
      method: "POST",
      body: payload,
    });
    return normalizarProducto(data);
  } catch (err) {
    console.warn("Error en backend al crear producto. Guardando en fallback local:", err.message);
    return createProductoStorage(payload);
  }
}

/**
 * Actualiza los datos de un producto en MySQL (PUT /api/productos/{id}).
 * Requiere rol ROLE_ADMIN en el token JWT.
 */
export async function updateProductoApi(id, datos) {
  const payload = {
    nombre: datos.nombre !== undefined ? datos.nombre.trim() : undefined,
    precio: datos.precio !== undefined ? Number(datos.precio) : undefined,
    categoria: datos.categoria,
    imagen: datos.imagen || datos.imagenUrl,
    descripcion: datos.descripcion,
    stock: datos.stock !== undefined ? Number(datos.stock) : undefined,
  };

  try {
    const data = await apiFetch(`/productos/${id}`, {
      method: "PUT",
      body: payload,
    });
    return normalizarProducto(data);
  } catch (err) {
    console.warn(`Error en backend al actualizar producto ${id}:`, err.message);
    return updateProductoStorage(id, payload);
  }
}

/**
 * Elimina un producto de la base de datos MySQL (DELETE /api/productos/{id}).
 * Requiere rol ROLE_ADMIN en el token JWT.
 */
export async function deleteProductoApi(id) {
  try {
    await apiFetch(`/productos/${id}`, {
      method: "DELETE",
    });
    return true;
  } catch (err) {
    console.warn(`Error en backend al eliminar producto ${id}:`, err.message);
    deleteProductoStorage(id);
    return false;
  }
}

export default {
  getProductosApi,
  getProductoByIdApi,
  createProductoApi,
  updateProductoApi,
  deleteProductoApi,
};
