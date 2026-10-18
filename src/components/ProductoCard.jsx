import { useState } from "react";
import { useCart } from "../context/CartContext.jsx";
import { getPromedioResenas } from "../services/resenasStorage.js";

/**
 * ProductoCard recibe un producto mediante props.
 * Componente modular con acción rápida de agregar al carrito y enlace al detalle.
 */
export default function ProductoCard({ producto }) {
  const { agregarAlCarrito } = useCart();
  const [agregado, setAgregado] = useState(false);
  const { promedio } = getPromedioResenas(producto?.id);

  function handleAgregar(e) {
    e.preventDefault();
    e.stopPropagation();
    agregarAlCarrito(producto, 1);
    setAgregado(true);
    setTimeout(() => {
      setAgregado(false);
    }, 2000);
  }

  return (
    <article className="producto-card">
      <a
        href={`/producto/${producto.id}`}
        style={{ textDecoration: "none", color: "inherit", display: "block" }}
      >
        <img
          src={producto.imagen}
          alt={producto.nombre}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/img/audio-placeholder.svg";
          }}
        />
      </a>
      <div className="producto-body">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className="categoria">{producto.categoria}</span>
          <span
            style={{ color: "#fbbf24", fontSize: "0.82rem", fontWeight: 700 }}
            title={`Calificación: ${promedio.toFixed(1)} de 5 estrellas`}
          >
            ★ {promedio.toFixed(1)}
          </span>
        </div>
        <a
          href={`/producto/${producto.id}`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <h3>{producto.nombre}</h3>
        </a>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto", paddingTop: "8px" }}>
          <p className="precio">${Number(producto.precio).toLocaleString("es-CL")}</p>
          <button
            type="button"
            onClick={handleAgregar}
            className="primary"
            style={{
              padding: "6px 12px",
              fontSize: "0.82rem",
              background: agregado ? "var(--verde)" : undefined,
              color: agregado ? "#04101d" : undefined,
            }}
            title="Agregar al carrito"
          >
            {agregado ? "✓ Agregado" : "🛒 Agregar"}
          </button>
        </div>
      </div>
    </article>
  );
}
