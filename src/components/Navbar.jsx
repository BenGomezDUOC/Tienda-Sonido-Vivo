import { NavLink } from "react-router-dom";

/**
 * Navbar reutilizable de Tienda Sonido Vivo con React Router (Tutorial 02).
 * Antes (01B): recibía paginaActual y onNavegar como props.
 * Ahora (02): NavLink modifica la URL y detecta automáticamente la ruta activa.
 */
export default function Navbar() {
  return (
    <nav className="site-nav">
      <div className="nav-inner">
        <NavLink to="/" end>
          Inicio
        </NavLink>
        <NavLink to="/productos">
          Productos
        </NavLink>
        <NavLink to="/contacto">
          Contacto
        </NavLink>
        <NavLink to="/login">
          Login
        </NavLink>
        <NavLink to="/admin">
          Admin
        </NavLink>
      </div>
    </nav>
  );
}
