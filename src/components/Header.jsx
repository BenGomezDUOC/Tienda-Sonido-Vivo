/**
 * Header reutilizable de Tienda Sonido Vivo.
 * Venta de productos de audio, equipos y accesorios.
 */
export default function Header() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <div className="logo">
          <span className="logo-icon">🎧</span>
          <span className="logo-text">
            SONIDO <span className="logo-accent">VIVO</span>
          </span>
        </div>
        <p>Venta de equipos de audio profesional, instrumentos y accesorios · DSY1104</p>
      </div>
    </header>
  );
}
