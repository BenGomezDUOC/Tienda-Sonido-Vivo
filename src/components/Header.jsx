import { Link } from "react-router-dom";

/**
 * Header reutilizable de Tienda Sonido Vivo.
 * Logotipo oficial e identidad de marca.
 */
export default function Header() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" style={{ textDecoration: "none", color: "inherit", display: "inline-block" }}>
          <div className="logo">
            <img
              src="/img/Sonido Vivo.svg"
              alt="Logo Sonido Vivo"
              className="logo-img"
            />
            <span className="logo-text">
              SONIDO <span className="logo-accent">VIVO</span>
            </span>
          </div>
        </Link>
        <p>Venta de equipos de audio profesional, instrumentos y accesorios · DSY1104</p>
      </div>
    </header>
  );
}
