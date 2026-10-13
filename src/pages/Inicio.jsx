/**
 * Página Inicio de Tienda Sonido Vivo.
 * Venta de productos de audio, equipos y accesorios.
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
        <h2>Categorías Principales de Audio</h2>
        <p>
          Explora nuestra selección de marcas líderes mundiales: Shure, Audio-Technica,
          Yamaha, Focusrite, Sony y Marshall.
        </p>
        <div className="destacados-preview">
          <div className="destacado-mini">
            <span>🎧</span>
            <strong>Audífonos & In-Ears</strong>
          </div>
          <div className="destacado-mini">
            <span>🎙️</span>
            <strong>Micrófonos de Estudio</strong>
          </div>
          <div className="destacado-mini">
            <span>🎛️</span>
            <strong>Interfaces de Grabación</strong>
          </div>
          <div className="destacado-mini">
            <span>🔊</span>
            <strong>Monitores & Parlantes</strong>
          </div>
        </div>
      </section>
    </>
  );
}
