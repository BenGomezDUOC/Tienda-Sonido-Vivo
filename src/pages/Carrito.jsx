import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

/**
 * Página Carrito de Compras — Tienda Sonido Vivo.
 * Control de cantidades, desglose de subtotal, beneficio Duoc UC (20%) y simulación de compra.
 */
export default function Carrito() {
  const {
    items,
    totalItems,
    subtotal,
    tieneDescuentoDuoc,
    montoDescuento,
    total,
    modificarCantidad,
    eliminarDelCarrito,
    vaciarCarrito,
  } = useCart();

  const { usuario } = useAuth();
  const navigate = useNavigate();

  const [ordenFinalizada, setOrdenFinalizada] = useState(null);

  function handleFinalizarCompra() {
    const orden = {
      id: "SV-" + Math.floor(100000 + Math.random() * 900000),
      fecha: new Date().toLocaleDateString("es-CL"),
      total,
      totalItems,
      descuentoDuocAplicado: tieneDescuentoDuoc,
      cliente: usuario ? usuario.nombre : "Cliente Invitado",
    };

    vaciarCarrito();
    setOrdenFinalizada(orden);
  }

  // Modal / Confirmación de orden de compra simulada
  if (ordenFinalizada) {
    return (
      <section className="form-card" style={{ textAlign: "center", padding: "40px 24px" }}>
        <span style={{ fontSize: "3.5rem", display: "block", marginBottom: "12px" }}>🎉</span>
        <h2>¡Pedido Confirmado con Éxito!</h2>
        <p>Gracias <strong>{ordenFinalizada.cliente}</strong>, hemos recibido tu compra en Tienda Sonido Vivo.</p>

        <div
          style={{
            background: "rgba(0, 229, 153, 0.08)",
            border: "1px solid var(--verde)",
            borderRadius: "var(--radio-sm)",
            padding: "20px",
            margin: "24px 0",
            textAlign: "left",
            display: "grid",
            gap: "8px",
            fontSize: "0.92rem",
          }}
        >
          <div><strong>N° de Orden:</strong> {ordenFinalizada.id}</div>
          <div><strong>Fecha de Emisión:</strong> {ordenFinalizada.fecha}</div>
          <div><strong>Total Equipos:</strong> {ordenFinalizada.totalItems} unidades</div>
          <div><strong>Total Pagado:</strong> ${ordenFinalizada.total.toLocaleString("es-CL")} CLP</div>
          {ordenFinalizada.descuentoDuocAplicado && (
            <div style={{ color: "var(--verde)", fontWeight: 700 }}>
              🎓 Incluye 20% de descuento institucional Duoc UC
            </div>
          )}
        </div>

        <button type="button" className="primary" onClick={() => navigate("/productos")}>
          Volver a la Tienda
        </button>
      </section>
    );
  }

  // Estado Carrito Vacío
  if (items.length === 0) {
    return (
      <section className="panel" style={{ textAlign: "center", padding: "50px 24px" }}>
        <span style={{ fontSize: "3.5rem", display: "block", marginBottom: "12px" }}>🛒</span>
        <h2>Tu Carrito de Audio Está Vacío</h2>
        <p>Aún no has agregado ningún micrófono, audífono o interfaz a tu lista de compra.</p>
        <Link to="/productos" className="primary" style={{ display: "inline-block", marginTop: "18px", textDecoration: "none" }}>
          Explorar Catálogo de Productos
        </Link>
      </section>
    );
  }

  return (
    <>
      <div className="admin-header">
        <div>
          <h2>Carrito de Compras ({totalItems} {totalItems === 1 ? "equipo" : "equipos"})</h2>
          <p>Revisa tu equipamiento de audio antes de procesar el pedido.</p>
        </div>
        <div>
          <button type="button" onClick={vaciarCarrito} className="btn-danger-sm" title="Vaciar todos los productos">
            🗑️ Vaciar Carrito
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "28px", alignItems: "start" }}>
        {/* Tabla de Productos en el Carrito */}
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Equipo</th>
                <th>Precio Unit.</th>
                <th style={{ textAlign: "center" }}>Cantidad</th>
                <th>Subtotal</th>
                <th style={{ textAlign: "center" }}>Quitar</th>
              </tr>
            </thead>
            <tbody>
              {items.map(({ id, producto, cantidad }) => {
                const itemSubtotal = Number(producto.precio || 0) * cantidad;
                return (
                  <tr key={id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <img
                          src={producto.imagen}
                          alt={producto.nombre}
                          className="admin-thumb"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/img/audio-placeholder.svg";
                          }}
                        />
                        <div>
                          <Link
                            to={`/producto/${producto.id}`}
                            style={{ color: "var(--texto)", fontWeight: 700, textDecoration: "none" }}
                          >
                            {producto.nombre}
                          </Link>
                          <small style={{ display: "block", color: "var(--texto-tenue)", fontSize: "0.78rem" }}>
                            {producto.categoria}
                          </small>
                        </div>
                      </div>
                    </td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      ${Number(producto.precio).toLocaleString("es-CL")}
                    </td>
                    <td>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: "1px solid var(--borde-fuerte)",
                          borderRadius: "var(--radio-sm)",
                          background: "#080c12",
                          width: "fit-content",
                          margin: "0 auto",
                        }}
                      >
                        <button
                          type="button"
                          className="btn-outline"
                          style={{ border: "none", padding: "4px 10px", fontSize: "0.95rem" }}
                          onClick={() => modificarCantidad(id, cantidad - 1)}
                          title="Restar unidad"
                        >
                          −
                        </button>
                        <span style={{ minWidth: "26px", textAlign: "center", fontWeight: 700 }}>
                          {cantidad}
                        </span>
                        <button
                          type="button"
                          className="btn-outline"
                          style={{ border: "none", padding: "4px 10px", fontSize: "0.95rem" }}
                          onClick={() => modificarCantidad(id, cantidad + 1)}
                          title="Sumar unidad"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td style={{ color: "var(--azul)", fontWeight: 700, whiteSpace: "nowrap" }}>
                      ${itemSubtotal.toLocaleString("es-CL")}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <button
                        type="button"
                        onClick={() => eliminarDelCarrito(id)}
                        className="btn-danger-sm"
                        style={{ padding: "4px 8px" }}
                        title="Eliminar del carrito"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Resumen del Pedido con Descuento Duoc */}
        <div className="panel" style={{ margin: 0, position: "sticky", top: "20px" }}>
          <h3 style={{ fontSize: "1.2rem", marginBottom: "16px", borderBottom: "1px solid var(--borde)", paddingBottom: "10px" }}>
            Resumen de la Compra
          </h3>

          <div style={{ display: "grid", gap: "12px", fontSize: "0.95rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--texto-secundario)" }}>Subtotal ({totalItems} items):</span>
              <strong>${subtotal.toLocaleString("es-CL")} CLP</strong>
            </div>

            {tieneDescuentoDuoc ? (
              <div
                style={{
                  background: "rgba(0, 229, 153, 0.08)",
                  border: "1px solid rgba(0, 229, 153, 0.3)",
                  borderRadius: "var(--radio-sm)",
                  padding: "10px 14px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", color: "var(--verde)", fontWeight: 700 }}>
                  <span>Descuento Duoc UC (20%):</span>
                  <span>− ${montoDescuento.toLocaleString("es-CL")} CLP</span>
                </div>
                <small style={{ color: "var(--verde)", display: "block", marginTop: "4px", fontSize: "0.78rem" }}>
                  🎓 Beneficio activo por tu cuenta {usuario?.email}
                </small>
              </div>
            ) : (
              <div
                style={{
                  background: "rgba(0, 194, 255, 0.05)",
                  border: "1px dashed var(--borde-fuerte)",
                  borderRadius: "var(--radio-sm)",
                  padding: "10px 14px",
                  fontSize: "0.82rem",
                  color: "var(--texto-tenue)",
                }}
              >
                💡 ¿Estudias o trabajas en Duoc UC?{" "}
                <Link to="/login" style={{ color: "var(--azul)", fontWeight: 700 }}>
                  Inicia sesión
                </Link>{" "}
                con tu correo institucional para obtener 20% de descuento automático.
              </div>
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                borderTop: "1px solid var(--borde)",
                paddingTop: "14px",
                marginTop: "6px",
              }}
            >
              <span style={{ fontSize: "1.1rem", fontWeight: 700 }}>Total Final:</span>
              <strong style={{ fontSize: "1.7rem", color: tieneDescuentoDuoc ? "var(--verde)" : "var(--azul)", fontFamily: "var(--fuente-titulo)" }}>
                ${total.toLocaleString("es-CL")} CLP
              </strong>
            </div>

            <button
              type="button"
              className="primary"
              onClick={handleFinalizarCompra}
              style={{ width: "100%", marginTop: "12px", padding: "14px" }}
            >
              💳 Finalizar Compra (Simular Pago)
            </button>

            <Link
              to="/productos"
              className="btn-outline"
              style={{ textAlign: "center", textDecoration: "none", width: "100%", display: "block", marginTop: "4px" }}
            >
              ← Continuar Comprando
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
