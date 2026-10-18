import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import {
  agregarResena,
  getPromedioResenas,
  getResenasPorProducto,
} from "../services/resenasStorage.js";

const LABELS_ESTRELLAS = {
  1: "Deficiente",
  2: "Regular",
  3: "Bueno",
  4: "Muy Bueno",
  5: "Excelente",
};

/**
 * Componente modular de Reseñas, Comentarios y Calificación (1 a 5 estrellas).
 * Permite a los clientes evaluar los equipos de audio y leer opiniones de la comunidad.
 */
export default function SeccionResenas({ productoId, nombreProducto }) {
  const { usuario } = useAuth();
  const [listaResenas, setListaResenas] = useState(() =>
    getResenasPorProducto(productoId),
  );
  const [calificacion, setCalificacion] = useState(5);
  const [hoverEstrella, setHoverEstrella] = useState(0);
  const [autor, setAutor] = useState(usuario ? usuario.nombre : "");
  const [comentario, setComentario] = useState("");
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");

  const { promedio, total } = getPromedioResenas(productoId);

  function handleSubmit(e) {
    e.preventDefault();

    if (!autor.trim()) {
      setError("Por favor ingresa tu nombre o alias para publicar.");
      return;
    }

    if (!comentario.trim() || comentario.trim().length < 5) {
      setError("Por favor escribe un comentario de al menos 5 caracteres sobre el equipo.");
      return;
    }

    const nuevaLista = agregarResena(productoId, {
      autor,
      calificacion,
      comentario,
    });

    setListaResenas(nuevaLista);
    setComentario("");
    setError("");
    setExito("🎉 ¡Muchas gracias por tu reseña! Tu comentario ha sido publicado.");

    setTimeout(() => {
      setExito("");
    }, 4500);
  }

  function renderEstrellas(score) {
    const redondeado = Math.round(score);
    return "★".repeat(redondeado) + "☆".repeat(5 - redondeado);
  }

  return (
    <section className="resenas-seccion" id="opiniones">
      {/* Cabecera y Resumen de Puntuación */}
      <div className="resenas-header-card">
        <div>
          <h3 style={{ fontSize: "1.35rem", marginBottom: "6px" }}>
            Opiniones y Calificaciones de Clientes
          </h3>
          <p style={{ color: "var(--texto-tenue)", margin: 0, fontSize: "0.9rem" }}>
            Experiencias reales de músicos, sonidistas y creadores de contenido.
          </p>
        </div>

        <div className="resenas-score">
          <div className="resenas-numero">{promedio.toFixed(1)}</div>
          <div>
            <div className="estrellas-doradas" style={{ fontSize: "1.35rem" }}>
              {renderEstrellas(promedio)}
            </div>
            <small style={{ color: "var(--texto-secundario)", display: "block", marginTop: "2px" }}>
              {total} {total === 1 ? "opinión de la comunidad" : "opiniones de la comunidad"}
            </small>
          </div>
        </div>
      </div>

      {/* Formulario para dejar una Reseña */}
      <div className="panel" style={{ marginBottom: "28px" }}>
        <h4 style={{ fontSize: "1.1rem", marginBottom: "12px", color: "var(--azul)" }}>
          ✍️ Deja tu Opinión sobre este Equipo
        </h4>

        {error && <div className="modal-error" style={{ marginBottom: "16px" }}>{error}</div>}
        {exito && <div className="admin-alert" style={{ marginBottom: "16px" }}>{exito}</div>}

        <form onSubmit={handleSubmit}>
          {/* Selector interactivo de 1 a 5 Estrellas */}
          <div className="form-group" style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "6px" }}>
              Tu Calificación:{" "}
              <strong style={{ color: "#fbbf24" }}>
                {LABELS_ESTRELLAS[hoverEstrella || calificacion]}
              </strong>
            </label>
            <div className="estrellas-selector" role="radiogroup" aria-label="Calificación de 1 a 5 estrellas">
              {[1, 2, 3, 4, 5].map((estrella) => {
                const activa = estrella <= (hoverEstrella || calificacion);
                return (
                  <button
                    key={estrella}
                    type="button"
                    className={`estrella-btn ${activa ? "activa" : ""}`}
                    onClick={() => setCalificacion(estrella)}
                    onMouseEnter={() => setHoverEstrella(estrella)}
                    onMouseLeave={() => setHoverEstrella(0)}
                    title={`${estrella} estrella(s) - ${LABELS_ESTRELLAS[estrella]}`}
                  >
                    ★
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px", marginBottom: "16px" }}>
            <div className="form-group">
              <label htmlFor="resena-autor">Tu Nombre o Alias *</label>
              <input
                id="resena-autor"
                type="text"
                placeholder="Ej: David Guetta, Sonidista Pro"
                value={autor}
                onChange={(e) => setAutor(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: "16px" }}>
            <label htmlFor="resena-comentario">Comentario / Experiencia Sonora *</label>
            <textarea
              id="resena-comentario"
              rows="3"
              placeholder={`¿Cómo ha sido tu experiencia con ${nombreProducto}? Calidad de audio, respuesta, materiales...`}
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              style={{
                width: "100%",
                background: "#080c12",
                border: "1px solid var(--borde-fuerte)",
                borderRadius: "var(--radio-sm)",
                color: "var(--texto)",
                padding: "12px",
                fontFamily: "var(--fuente-texto)",
                fontSize: "0.95rem",
                resize: "vertical",
              }}
            />
          </div>

          <button type="submit" className="primary" style={{ padding: "10px 24px" }}>
            Publicar Mi Reseña
          </button>
        </form>
      </div>

      {/* Listado de Opiniones de Clientes */}
      <div className="resenas-grid">
        {listaResenas.length === 0 ? (
          <p style={{ color: "var(--texto-tenue)", fontStyle: "italic", textAlign: "center", padding: "20px" }}>
            Aún no hay opiniones registradas. ¡Sé el primero en calificar este equipo!
          </p>
        ) : (
          listaResenas.map((r) => {
            const iniciales = r.autor
              .split(" ")
              .slice(0, 2)
              .map((w) => w[0]?.toUpperCase())
              .join("");

            return (
              <article key={r.id} className="resena-item">
                <div className="resena-item-header">
                  <div className="resena-autor-info">
                    <div className="resena-avatar">{iniciales || "SV"}</div>
                    <div>
                      <strong style={{ display: "block", color: "var(--texto)", fontSize: "0.98rem" }}>
                        {r.autor}
                      </strong>
                      <span style={{ fontSize: "0.78rem", color: "var(--verde)", fontWeight: 600 }}>
                        ✓ Compra Verificada
                      </span>
                    </div>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <div className="estrellas-doradas" style={{ fontSize: "1.1rem" }}>
                      {renderEstrellas(r.calificacion)}
                    </div>
                    <small style={{ color: "var(--texto-tenue)", fontSize: "0.78rem" }}>
                      {r.fecha}
                    </small>
                  </div>
                </div>

                <p style={{ color: "var(--texto-secundario)", margin: 0, fontSize: "0.94rem", lineHeight: "1.5" }}>
                  "{r.comentario}"
                </p>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}
