import { useEffect, useMemo, useState } from "react";
import ProductoFormModal from "../components/ProductoFormModal.jsx";
import {
  createProducto,
  deleteProducto,
  getProductos,
  resetProductos,
  updateProducto,
} from "../services/productosStorage.js";

/**
 * Panel de Administración — Tienda Sonido Vivo.
 * CRUD Completo con datos simulados (Create, Read, Update, Delete) + KPIs y Buscador.
 */
export default function Admin() {
  const [listaProductos, setListaProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productoAEditar, setProductoAEditar] = useState(null);
  const [alerta, setAlerta] = useState("");

  useEffect(() => {
    cargarProductos();
  }, []);

  function cargarProductos() {
    setListaProductos(getProductos());
  }

  function mostrarAlerta(msg) {
    setAlerta(msg);
    setTimeout(() => {
      setAlerta("");
    }, 3500);
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

  // Abrir modal para Crear
  function handleAbrirCrear() {
    setProductoAEditar(null);
    setIsModalOpen(true);
  }

  // Abrir modal para Editar
  function handleAbrirEditar(producto) {
    setProductoAEditar(producto);
    setIsModalOpen(true);
  }

  // Guardar (Crear o Actualizar)
  function handleGuardar(datos) {
    if (productoAEditar) {
      updateProducto(productoAEditar.id, datos);
      mostrarAlerta(`✅ Equipo "${datos.nombre}" actualizado correctamente.`);
    } else {
      createProducto(datos);
      mostrarAlerta(`🎉 Equipo "${datos.nombre}" creado exitosamente.`);
    }
    setIsModalOpen(false);
    setProductoAEditar(null);
    cargarProductos();
  }

  // Eliminar un producto
  function handleEliminar(id, nombre) {
    const confirmar = window.confirm(
      `¿Confirmas la eliminación del equipo "${nombre}" (ID: ${id})?`,
    );
    if (!confirmar) return;

    deleteProducto(id);
    mostrarAlerta(`🗑️ Equipo "${nombre}" eliminado del catálogo.`);
    cargarProductos();
  }

  // Restaurar el catálogo inicial de fábrica
  function handleRestablecer() {
    const confirmar = window.confirm(
      "¿Deseas restablecer el catálogo con los productos iniciales de Sonido Vivo?",
    );
    if (!confirmar) return;

    resetProductos();
    mostrarAlerta("🔄 Catálogo restablecido con los 12 productos base.");
    cargarProductos();
  }

  return (
    <section className="panel">
      <div className="admin-header">
        <div>
          <h2>Panel Administrador — Tienda Sonido Vivo</h2>
          <p>
            Gestión completa de inventario de audio (CRUD simulado) y métricas operativas.
          </p>
        </div>
        <div className="admin-header-actions">
          <button
            type="button"
            onClick={handleAbrirCrear}
            className="primary"
            title="Crear un nuevo producto"
          >
            ➕ Nuevo Producto
          </button>
          <button
            type="button"
            onClick={handleRestablecer}
            className="btn-outline btn-sm"
            title="Restablece los 12 productos originales de prueba"
          >
            🔄 Restablecer Catálogo
          </button>
        </div>
      </div>

      {/* Alerta de notificación temporal */}
      {alerta && <div className="admin-alert">{alerta}</div>}

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

      {/* Tabla de Gestión (CRUD completo) */}
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
                      onClick={() => handleAbrirEditar(prod)}
                      className="btn-edit-sm"
                      title="Editar producto"
                    >
                      ✏️ Editar
                    </button>
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

      {/* Modal de Creación / Edición */}
      <ProductoFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setProductoAEditar(null);
        }}
        onSave={handleGuardar}
        productoAEditar={productoAEditar}
      />
    </section>
  );
}
