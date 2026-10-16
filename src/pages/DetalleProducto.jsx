import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { getProductoById } from "../services/productosStorage.js";

/**
 * Vista Detalle de Producto — Tienda Sonido Vivo.
 * Ficha técnica de audio, cálculo de descuento Duoc en vivo y selector de unidades.
 */
export default function DetalleProducto() {
  const { id } = useParams();
  const producto = getProductoById(id);
  const { agregarAlCarrito } = useCart();
  const { tieneDescuentoDuoc } = useAuth();

  const [cantidad, setCantidad] = useState(1);
  const [agregadoExitoso, setAgregadoExitoso] = useState(false);

  if (!producto) {
    return (
      <section className="panel" style={{ textAlign: "center", padding: "48px 24px" }}>
        <span style={{ fontSize: "3rem", display: "block", marginBottom: "12px" }}>🔍</span>
        <h2>Equipo de Audio No Encontrado</h2>
        <p>El producto solicitado (ID: #{id}) no existe o ha sido retirado del catálogo.</p>
        <Link to="/productos" className="primary" style={{ display: "inline-block", marginTop: "16px", textDecoration: "none" }}>
          Volver al Catálogo
        </Link>
      </section>
    );
  }

  const precioUnitario = Number(producto.precio) || 0;
  const precioConDescuento = tieneDescuentoDuoc
    ? Math.round(precioUnitario * 0.8)
    : precioUnitario;
  const ahorroUnitario = precioUnitario - precioConDescuento;

  function handleAgregar() {
    agregarAlCarrito(producto, cantidad);
    setAgregadoExitoso(true);
    setTimeout(() => {
      setAgregadoExitoso(false);
    }, 4500);
  }

  return (
    <>
      {/* Navegación de migas de pan */}
      <nav style={{ marginBottom: "20px", fontSize: "0.88rem", color: "var(--texto-tenue)" }}>
        <Link to="/" style={{ color: "var(--azul)", textDecoration: "none" }}>Inicio</Link>
        {" / "}
        <Link to="/productos" style={{ color: "var(--azul)", textDecoration: "none" }}>Productos</Link>
        {" / "}
        <span>{producto.categoria}</span>
        {" / "}
        <span style={{ color: "var(--texto)" }}>{producto.nombre}</span>
      </nav>

      <section
        className="panel"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "36px",
          alignItems: "start",
        }}
      >
        {/* Columna Imagen */}
        <div
          style={{
            background: "#06090e",
            border: "1px solid var(--borde-fuerte)",
            borderRadius: "var(--radio)",
            padding: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "340px",
          }}
        >
          <img
            src={producto.imagen}
            alt={producto.nombre}
            style={{ maxWidth: "100%", maxHeight: "300px", objectFit: "contain" }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/img/audio-placeholder.svg";
            }}
          />
        </div>

        {/* Columna Información y Compra */}
        <div>
          <span className="categoria-badge" style={{ marginBottom: "12px" }}>
            {producto.categoria}
          </span>
          <h2 style={{ fontSize: "1.8rem", marginBottom: "8px", marginTop: "8px" }}>
            {producto.nombre}
          </h2>
          <p style={{ color: "var(--texto-tenue)", fontSize: "0.88rem", marginBottom: "20px" }}>
            Código de Producto: <strong>AUD-{producto.id.toString().padStart(4, "0")}</strong> · En stock disponible
          </p>

          {/* Bloque de Precios con Descuento Duoc */}
          <div
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid var(--borde)",
              borderRadius: "var(--radio-sm)",
              padding: "18px 20px",
              marginBottom: "24px",
            }}
          >
            {tieneDescuentoDuoc ? (
              <div>
                <span style={{ textDecoration: "line-through", color: "var(--texto-tenue)", fontSize: "1rem" }}>
                  Precio Normal: ${precioUnitario.toLocaleString("es-CL")} CLP
                </span>
                <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginTop: "4px" }}>
                  <strong style={{ fontSize: "2rem", color: "var(--verde)", fontFamily: "var(--fuente-titulo)" }}>
                    ${precioConDescuento.toLocaleString("es-CL")} CLP
                  </strong>
                  <span className="categoria-badge" style={{ fontSize: "0.78rem" }}>
                    🎓 20% Dcto Duoc UC
                  </span>
                </div>
                <small style={{ color: "var(--verde)", display: "block", marginTop: "4px" }}>
                  ¡Ahorras ${ahorroUnitario.toLocaleString("es-CL")} CLP por tu beneficio institucional!
                </small>
              </div>
            ) : (
              <div>
                <strong style={{ fontSize: "2rem", color: "var(--azul)", fontFamily: "var(--fuente-titulo)" }}>
                  ${precioUnitario.toLocaleString("es-CL")} CLP
                </strong>
                <small style={{ color: "var(--texto-tenue)", display: "block", marginTop: "6px" }}>
                  💡 ¿Eres alumno o docente Duoc UC? <Link to="/login" style={{ color: "var(--azul)" }}>Inicia sesión</Link> para acceder al 20% de descuento.
                </small>
              </div>
            )}
          </div>

          {/* Selector de cantidad y Botón de compra */}
          <div style={{ display: "flex", gap: "14px", alignItems: "center", flexWrap: "wrap", marginBottom: "20px" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                border: "1px solid var(--borde-fuerte)",
                borderRadius: "var(--radio-sm)",
                background: "#080c12",
              }}
            >
              <button
                type="button"
                className="btn-outline"
                style={{ border: "none", padding: "10px 16px", fontSize: "1.1rem" }}
                onClick={() => setCantidad((prev) => Math.max(1, prev - 1))}
                aria-label="Disminuir cantidad"
              >
                −
              </button>
              <span style={{ minWidth: "36px", textAlign: "center", fontWeight: 700 }}>
                {cantidad}
              </span>
              <button
                type="button"
                className="btn-outline"
                style={{ border: "none", padding: "10px 16px", fontSize: "1.1rem" }}
                onClick={() => setCantidad((prev) => prev + 1)}
                aria-label="Aumentar cantidad"
              >
                +
              </button>
            </div>

            <button
              type="button"
              className="primary"
              onClick={handleAgregar}
              style={{ flex: "1", minWidth: "200px" }}
            >
              🛒 Agregar al Carrito
            </button>
          </div>

          {/* Feedback de agregado */}
          {agregadoExitoso && (
            <div
              className="admin-alert"
              style={{
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "8px",
                marginBottom: "20px",
              }}
            >
              <span>✅ <strong>¡Agregaste {cantidad} unidad(es) al carrito!</strong></span>
              <div style={{ display: "flex", gap: "10px", marginTop: "6px" }}>
                <Link to="/carrito" className="primary" style={{ textDecoration: "none", padding: "8px 16px", fontSize: "0.85rem" }}>
                  Ver Carrito de Compras
                </Link>
                <Link to="/productos" className="btn-outline" style={{ textDecoration: "none", padding: "8px 16px", fontSize: "0.85rem" }}>
                  Seguir Comprando
                </Link>
              </div>
            </div>
          )}

          {/* Ficha técnica del equipo */}
          <div
            style={{
              borderTop: "1px solid var(--borde)",
              paddingTop: "20px",
              marginTop: "20px",
              display: "grid",
              gap: "10px",
              fontSize: "0.9rem",
            }}
          >
            <h3 style={{ fontSize: "1rem", color: "var(--azul)", marginBottom: "4px" }}>
              Especificaciones y Garantía
            </h3>
            <div style={{ display: "flex", justifyContent: "space-between", color: "var(--texto-secundario)" }}>
              <span>Categoría:</span>
              <strong>{producto.categoria}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", color: "var(--texto-secundario)" }}>
              <span>Garantía Oficial:</span>
              <strong>12 Meses (Soporte Técnico Especializado)</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", color: "var(--texto-secundario)" }}>
              <span>Despacho:</span>
              <span style={{ color: "var(--verde)" }}>Disponible para todo Chile</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
