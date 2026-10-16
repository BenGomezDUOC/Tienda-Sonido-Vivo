import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

/**
 * Navbar interactivo de Tienda Sonido Vivo.
 * Muestra rutas principales, estado de sesión, rol de administración y badge de beneficio Duoc UC.
 */
export default function Navbar() {
  const { usuario, logout, esAdmin, tieneDescuentoDuoc } = useAuth();

  return (
    <nav className="site-nav">
      <div className="nav-inner" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
          <NavLink to="/" end>
            Inicio
          </NavLink>
          <NavLink to="/productos">
            Productos
          </NavLink>
          <NavLink to="/contacto">
            Contacto
          </NavLink>
          {esAdmin && (
            <NavLink to="/admin">
              ⚙️ Admin
            </NavLink>
          )}
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
          {usuario ? (
            <>
              {tieneDescuentoDuoc && (
                <span
                  className="categoria-badge"
                  title="20% de descuento aplicado en el carrito por tu correo institucional Duoc UC"
                  style={{ fontSize: "0.75rem", padding: "4px 10px" }}
                >
                  🎓 20% Duoc
                </span>
              )}
              <span style={{ fontSize: "0.85rem", color: "var(--texto-secundario)", fontWeight: 700 }}>
                {usuario.rol === "admin" ? "🛡️ " : "👤 "}
                {usuario.nombre.split(" ")[0]}
              </span>
              <button
                type="button"
                onClick={logout}
                className="btn-outline"
                style={{ padding: "4px 10px", fontSize: "0.78rem" }}
                title="Cerrar sesión activa"
              >
                Salir
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">
                Login
              </NavLink>
              <NavLink to="/registro">
                Registro
              </NavLink>
              <NavLink to="/admin" title="Panel de Administración (requiere cuenta admin)">
                Admin
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
