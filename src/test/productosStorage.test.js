import { beforeEach, describe, expect, it } from "vitest";
import {
  createProducto,
  deleteProducto,
  getProductoById,
  getProductos,
  resetProductos,
  updateProducto,
} from "../services/productosStorage.js";

describe("Servicio de Productos (productosStorage.js) - Lógica de Negocio", () => {
  beforeEach(() => {
    // Limpiamos localStorage antes de cada prueba para asegurar independencia y repetibilidad
    localStorage.clear();
  });

  // Prueba 1: Lectura y consistencia de datos iniciales
  it("1. getProductos() inicializa y devuelve los 12 productos base de Sonido Vivo si el almacenamiento está vacío", () => {
    const productos = getProductos();

    expect(Array.isArray(productos)).toBe(true);
    expect(productos.length).toBe(12);

    // Verificar estructura del primer producto
    const primerEquipo = productos[0];
    expect(primerEquipo).toHaveProperty("id");
    expect(primerEquipo).toHaveProperty("nombre");
    expect(primerEquipo).toHaveProperty("categoria");
    expect(primerEquipo).toHaveProperty("precio");
    expect(primerEquipo).toHaveProperty("imagen");
    expect(primerEquipo.precio).toBeGreaterThan(0);
  });

  // Prueba 2: Creación de nuevo producto con ID auto-incremental y persistencia
  it("2. createProducto() agrega un nuevo equipo de audio con ID incremental y lo persiste en localStorage", () => {
    const nuevoEquipo = {
      nombre: "Micrófono Shure SM58 Dinámico",
      categoria: "Micrófonos",
      precio: 119990,
      imagen: "/img/shure-sm7b.svg",
    };

    const creado = createProducto(nuevoEquipo);

    expect(creado).toBeDefined();
    expect(creado.nombre).toBe("Micrófono Shure SM58 Dinámico");
    expect(creado.precio).toBe(119990);
    expect(typeof creado.id).toBe("number");

    // Verificar persistencia en almacenamiento
    const listaActualizada = getProductos();
    expect(listaActualizada.length).toBe(13);
    const encontrado = listaActualizada.find((p) => p.id === creado.id);
    expect(encontrado).toBeDefined();
    expect(encontrado.nombre).toBe("Micrófono Shure SM58 Dinámico");
  });

  // Prueba 3: Actualización parcial y total de producto existente
  it("3. updateProducto() actualiza correctamente los datos de un equipo sin alterar su ID", () => {
    const idAEditar = 1;
    const datosNuevos = {
      nombre: "Audífonos Audio-Technica ATH-M50x Edición Limitada",
      precio: 169990,
    };

    const productoModificado = updateProducto(idAEditar, datosNuevos);

    expect(productoModificado).not.toBeNull();
    expect(productoModificado.id).toBe(idAEditar);
    expect(productoModificado.nombre).toBe(
      "Audífonos Audio-Technica ATH-M50x Edición Limitada"
    );
    expect(productoModificado.precio).toBe(169990);

    // Verificar que getProductoById refleje la actualización
    const verificado = getProductoById(idAEditar);
    expect(verificado.nombre).toBe(
      "Audífonos Audio-Technica ATH-M50x Edición Limitada"
    );
  });

  // Prueba 4: Eliminación por ID
  it("4. deleteProducto() elimina el equipo especificado y reduce el total del catálogo", () => {
    const idAEliminar = 2; // Shure SE215-CL
    const listaRestante = deleteProducto(idAEliminar);

    expect(listaRestante.length).toBe(11);
    const noExiste = listaRestante.find((p) => p.id === idAEliminar);
    expect(noExiste).toBeUndefined();

    // Confirmar que la consulta directa por ID devuelve null
    expect(getProductoById(idAEliminar)).toBeNull();
  });

  // Prueba 5: Restablecimiento del catálogo de fábrica
  it("5. resetProductos() restablece el catálogo original de 12 equipos descartando alteraciones", () => {
    // Modificamos el inventario eliminando 2 productos
    deleteProducto(1);
    deleteProducto(2);

    expect(getProductos().length).toBe(10);

    // Ejecutamos restablecimiento
    const restablecidos = resetProductos();

    expect(restablecidos.length).toBe(12);
    expect(getProductoById(1)).not.toBeNull();
  });
});
