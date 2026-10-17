import { productos as productosBase } from "../data/productos.js";

const STORAGE_KEY = "sonido_vivo_productos";

/**
 * Servicio de almacenamiento local simulado para el catálogo de Tienda Sonido Vivo.
 * Permite persistencia en localStorage para operaciones CRUD.
 */

// Obtener la lista completa de productos
export function getProductos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(productosBase));
      return [...productosBase];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(productosBase));
      return [...productosBase];
    }

    // Auto-migración: Si algún producto base aún tiene la ruta .svg placeholder, actualizarlo con la nueva imagen real
    let huboCambios = false;
    const actualizados = parsed.map((p) => {
      const base = productosBase.find((b) => b.id === p.id);
      if (base && p.imagen && p.imagen.endsWith(".svg") && !base.imagen.endsWith(".svg")) {
        huboCambios = true;
        return { ...p, imagen: base.imagen };
      }
      return p;
    });

    if (huboCambios) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(actualizados));
      return actualizados;
    }

    return parsed;
  } catch (err) {
    console.error("Error al leer productos desde localStorage:", err);
    return [...productosBase];
  }
}

// Obtener un producto por su ID
export function getProductoById(id) {
  const lista = getProductos();
  return lista.find((p) => p.id === Number(id)) || null;
}

// Crear un nuevo producto
export function createProducto(datos) {
  const lista = getProductos();
  const nuevoId = lista.length > 0 ? Math.max(...lista.map((p) => Number(p.id) || 0)) + 1 : 1;
  const nuevoProducto = {
    id: nuevoId,
    nombre: datos.nombre.trim(),
    precio: Number(datos.precio) || 0,
    categoria: datos.categoria || "Accesorios",
    imagen: datos.imagen || "/img/audio-placeholder.svg",
  };
  const nuevaLista = [nuevoProducto, ...lista];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nuevaLista));
  return nuevoProducto;
}

// Actualizar un producto existente
export function updateProducto(id, datos) {
  const lista = getProductos();
  const idNum = Number(id);
  const index = lista.findIndex((p) => p.id === idNum);
  if (index === -1) return null;

  const actualizado = {
    ...lista[index],
    nombre: datos.nombre !== undefined ? datos.nombre.trim() : lista[index].nombre,
    precio: datos.precio !== undefined ? Number(datos.precio) || 0 : lista[index].precio,
    categoria: datos.categoria !== undefined ? datos.categoria : lista[index].categoria,
    imagen: datos.imagen !== undefined ? datos.imagen : lista[index].imagen,
  };

  lista[index] = actualizado;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
  return actualizado;
}

// Eliminar un producto por ID
export function deleteProducto(id) {
  const lista = getProductos();
  const idNum = Number(id);
  const filtrados = lista.filter((p) => p.id !== idNum);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtrados));
  return filtrados;
}

// Restaurar catálogo base de fábrica
export function resetProductos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(productosBase));
  return [...productosBase];
}
