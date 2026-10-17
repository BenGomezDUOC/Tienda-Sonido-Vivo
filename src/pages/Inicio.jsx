import { Link } from "react-router-dom";

/**
 * Página Inicio de Tienda Sonido Vivo.
 * Banner de bienvenida y accesos rápidos a categorías con imágenes reales.
 */
export default function Inicio() {
  return (
    <>
      <section className="hero">
        <span className="hero-eyebrow">🎵 BIENVENIDO A TIENDA SONIDO VIVO</span>
        <h2>VIVE LA MÚSICA CON LA MÁXIMA FIDELIDAD Y POTENCIA</h2>
        <p>
          Tu tienda especializada en venta de productos de audio, equipos de estudio
          y accesorios en Chile. Todo lo que necesitas para tu home studio,
          presentaciones en vivo, podcasting y disfrute audiófilo.
        </p>
        <div className="hero-stats">
          <div className="hero-stat">
            <strong>Hi-Res</strong>
            <span>Audio de alta fidelidad profesional</span>
          </div>
          <div className="hero-stat">
            <strong>100%</strong>
            <span>Despachos a todo Chile</span>
          </div>
          <div className="hero-stat">
            <strong>Garantía</strong>
            <span>Soporte y asesoría técnica especializada</span>
          </div>
        </div>
      </section>

      <section className="panel">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "10px" }}>
          <div>
            <h2>Categorías Principales de Audio</h2>
            <p>
              Explora nuestra selección de marcas líderes mundiales: Shure, Audio-Technica,
              Yamaha, Focusrite, Sony y Marshall.
            </p>
          </div>
          <Link to="/productos" className="btn-outline" style={{ textDecoration: "none" }}>
            Ver Todo el Catálogo →
          </Link>
        </div>

        <div className="destacados-preview">
          <Link to="/productos" className="destacado-mini">
            <img
              src="/img/Audífonos de Estudio Audio-Technica ATH-M50x.png"
              alt="Audífonos & In-Ears"
              className="destacado-img"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/img/audio-placeholder.svg";
              }}
            />
            <strong>Audífonos & In-Ears</strong>
            <small>Audio-Technica, Shure, Sony</small>
          </Link>

          <Link to="/productos" className="destacado-mini">
            <img
              src="/img/Micrófono Dinámico Vocal Shure SM7B.webp"
              alt="Micrófonos de Estudio"
              className="destacado-img"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/img/audio-placeholder.svg";
              }}
            />
            <strong>Micrófonos de Estudio</strong>
            <small>Shure SM7B, Rode NT-USB</small>
          </Link>

          <Link to="/productos" className="destacado-mini">
            <img
              src="/img/Interfaz de Audio Focusrite Scarlett 2i2 4th Gen.jpg"
              alt="Interfaces de Grabación"
              className="destacado-img"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/img/audio-placeholder.svg";
              }}
            />
            <strong>Interfaces de Grabación</strong>
            <small>Focusrite Scarlett 2i2 4th Gen</small>
          </Link>

          <Link to="/productos" className="destacado-mini">
            <img
              src="/img/Monitores de Estudio Yamaha HS5 (Par).jpg"
              alt="Monitores & Parlantes"
              className="destacado-img"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/img/audio-placeholder.svg";
              }}
            />
            <strong>Monitores & Parlantes</strong>
            <small>Yamaha HS5, Marshall Acton III</small>
          </Link>
        </div>
      </section>
    </>
  );
}
