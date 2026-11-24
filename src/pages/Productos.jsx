import { useEffect, useMemo, useState } from "react";
import ProductoCard from "../components/ProductoCard.jsx";
import { getProductosApi } from "../services/productosApi.js";

/**
 * Catálogo de Productos — Tienda Sonido Vivo.
 * Consume la API REST de Spring Boot (GET /api/productos) conectada a MySQL en XAMPP.
 */
export default function Productos() {
  const [listaProductos, setListaProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarProductos();
  }, []);

  async function cargarProductos() {
    setCargando(true);
    setError("");
    try {
      const datos = await getProductosApi();
      setListaProductos(datos);
    } catch (err) {
      setError("No se pudo cargar el catálogo de productos.");
    } finally {
      setCargando(false);
    }
  }

  const productosFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    if (!texto) return listaProductos;
    return listaProductos.filter(
      (producto) =>
        producto.nombre.toLowerCase().includes(texto) ||
        producto.categoria.toLowerCase().includes(texto),
    );
  }, [listaProductos, busqueda]);

  return (
    <>
      <section className="hero">
        <h2>Catálogo de Audio y Sonido</h2>
        <p>
          Explora audífonos profesionales, micrófonos, interfaces de grabación,
          monitores y accesorios con la más alta calidad de audio de Chile.
        </p>
      </section>

      <input
        className="buscador"
        type="search"
        placeholder="Buscar por equipo o categoría (ej: Shure, Audífonos, Yamaha)..."
        value={busqueda}
        onChange={(event) => setBusqueda(event.target.value)}
      />

      {cargando ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "var(--azul)" }}>
          <p style={{ fontSize: "1.1rem" }}>⏳ Cargando catálogo...</p>
        </div>
      ) : error ? (
        <div className="modal-error" style={{ textAlign: "center", margin: "2rem auto", maxWidth: "500px" }}>
          {error}
          <button
            type="button"
            className="btn-outline"
            style={{ marginTop: "12px", display: "inline-block" }}
            onClick={cargarProductos}
          >
            Reintentar Conexión
          </button>
        </div>
      ) : (
        <section className="grid-productos">
          {productosFiltrados.length > 0 ? (
            productosFiltrados.map((producto) => (
              <ProductoCard key={producto.id} producto={producto} />
            ))
          ) : (
            <p
              style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                padding: "2rem",
                color: "var(--texto-tenue)",
              }}
            >
              No se encontraron equipos que coincidan con "{busqueda}".
            </p>
          )}
        </section>
      )}
    </>
  );
}
