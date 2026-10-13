import { useEffect, useMemo, useState } from "react";
import ProductoCard from "../components/ProductoCard.jsx";
import { getProductos } from "../services/productosStorage.js";

/**
 * Catálogo de Productos — Tienda Sonido Vivo.
 * Lee desde el almacenamiento simulado (localStorage) y filtra en tiempo real.
 */
export default function Productos() {
  const [listaProductos, setListaProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    setListaProductos(getProductos());
  }, []);

  const productosFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
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
          monitores y accesorios con garantía y asesoría especializada.
        </p>
      </section>

      <input
        className="buscador"
        type="search"
        placeholder="Buscar por equipo o categoría (ej: Shure, Audífonos, Yamaha)..."
        value={busqueda}
        onChange={(event) => setBusqueda(event.target.value)}
      />

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
    </>
  );
}
