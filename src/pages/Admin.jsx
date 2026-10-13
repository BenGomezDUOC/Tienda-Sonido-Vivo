import { useEffect, useMemo, useState } from "react";
import {
  deleteProducto,
  getProductos,
  resetProductos,
} from "../services/productosStorage.js";

/**
 * Panel de Administración — Tienda Sonido Vivo (Paso 2: Read, KPIs dinámicos y Delete).
 */
export default function Admin() {
  const [listaProductos, setListaProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    cargarProductos();
  }, []);

  function cargarProductos() {
    setListaProductos(getProductos());
  }

  // KPIs calculados en tiempo real
  const totalEquipos = listaProductos.length;
  const categoriasUnicas = new Set(listaProductos.map((p) => p.categoria)).size;
  const precioPromedio =
    totalEquipos > 0
      ? Math.round(
          listaProductos.reduce((acc, p) => acc + Number(p.precio || 0), 0) /
            totalEquipos,
        )
      : 0;

  // Filtrado de la tabla administrativa
  const productosFiltrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return listaProductos;
    return listaProductos.filter(
      (p) =>
        p.nombre.toLowerCase().includes(q) ||
        p.categoria.toLowerCase().includes(q) ||
        String(p.id).includes(q),
    );
  }, [listaProductos, busqueda]);

  // Manejador para eliminar un producto
  function handleEliminar(id, nombre) {
    const confirmar = window.confirm(
      `¿Confirmas la eliminación del equipo "${nombre}" (ID: ${id})?`,
    );
    if (!confirmar) return;

    deleteProducto(id);
    cargarProductos();
  }

  // Manejador para restaurar el catálogo inicial de fábrica
  function handleRestablecer() {
    const confirmar = window.confirm(
      "¿Deseas restablecer el catálogo con los productos iniciales de Sonido Vivo?",
    );
    if (!confirmar) return;

    resetProductos();
    cargarProductos();
  }

  return (
    <section className="panel">
      <div className="admin-header">
        <div>
          <h2>Panel Administrador — Tienda Sonido Vivo</h2>
          <p>
            Gestión de inventario de audio, métricas operativas y catálogo simulado.
          </p>
        </div>
        <button
          type="button"
          onClick={handleRestablecer}
          className="btn-outline btn-sm"
          title="Restablece los 12 productos originales de prueba"
        >
          🔄 Restablecer Catálogo Base
        </button>
      </div>

      {/* Indicadores KPI Dinámicos */}
      <div className="admin-grid">
        <article className="kpi">
          <strong>{totalEquipos}</strong>
          <span>Equipos Activos</span>
        </article>

        <article className="kpi">
          <strong>{categoriasUnicas}</strong>
          <span>Categorías Únicas</span>
        </article>

        <article className="kpi">
          <strong>${precioPromedio.toLocaleString("es-CL")}</strong>
          <span>Precio Promedio</span>
        </article>
      </div>

      {/* Barra de herramientas administrativa */}
      <div className="admin-toolbar">
        <input
          type="search"
          className="buscador admin-search"
          placeholder="Filtrar por nombre, categoría o ID..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <span className="admin-contador">
          Mostrando <strong>{productosFiltrados.length}</strong> de{" "}
          <strong>{totalEquipos}</strong> equipos
        </span>
      </div>

      {/* Tabla de Gestión (Read & Delete) */}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Miniatura</th>
              <th>Nombre del Equipo</th>
              <th>Categoría</th>
              <th>Precio (CLP)</th>
              <th style={{ textAlign: "center" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosFiltrados.length > 0 ? (
              productosFiltrados.map((prod) => (
                <tr key={prod.id}>
                  <td className="col-id">#{prod.id}</td>
                  <td className="col-thumb">
                    <img
                      src={prod.imagen}
                      alt={prod.nombre}
                      className="admin-thumb"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/img/audio-placeholder.svg";
                      }}
                    />
                  </td>
                  <td className="col-nombre">
                    <strong>{prod.nombre}</strong>
                  </td>
                  <td>
                    <span className="categoria-badge">{prod.categoria}</span>
                  </td>
                  <td className="col-precio">
                    ${Number(prod.precio).toLocaleString("es-CL")}
                  </td>
                  <td className="col-acciones">
                    <button
                      type="button"
                      onClick={() => handleEliminar(prod.id, prod.nombre)}
                      className="btn-danger-sm"
                      title="Eliminar producto"
                    >
                      🗑️ Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="admin-empty">
                  No se encontraron productos que coincidan con "{busqueda}".
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
