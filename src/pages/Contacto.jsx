import { useState } from "react";

/**
 * Página Contacto — Tienda Sonido Vivo.
 * Captura consultas de asesoría técnica y cotizaciones con validación y confirmación.
 */
export default function Contacto() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (!nombre.trim() || !correo.trim() || !mensaje.trim()) {
      setError("Por favor completa los campos obligatorios (Nombre, Correo y Mensaje).");
      return;
    }

    if (!correo.includes("@") || !correo.includes(".")) {
      setError("Por favor ingresa un formato de correo electrónico válido.");
      return;
    }

    setError("");
    setEnviado(true);
  }

  function handleNuevoMensaje() {
    setNombre("");
    setCorreo("");
    setTelefono("");
    setMensaje("");
    setEnviado(false);
    setError("");
  }

  return (
    <section className="form-card">
      <h2>Contacto y Asesoría en Audio</h2>
      <p>
        ¿Tienes dudas sobre compatibilidad de micrófonos, interfaces o requieres
        cotizar equipamiento para tu estudio o escenario? Escríbenos.
      </p>

      {enviado ? (
        <div className="admin-alert" style={{ flexDirection: "column", alignItems: "flex-start", gap: "10px" }}>
          <span>🎉 <strong>¡Consulta enviada con éxito!</strong></span>
          <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--texto-secundario)" }}>
            Gracias {nombre}, nuestro equipo de especialistas en audio revisará tu solicitud y te contactará a {correo} a la brevedad.
          </p>
          <button type="button" className="btn-outline" onClick={handleNuevoMensaje} style={{ marginTop: "8px" }}>
            Enviar otra consulta
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          {error && <div className="modal-error" style={{ marginBottom: "16px" }}>{error}</div>}

          <div className="form-group">
            <label htmlFor="nombre">Nombre Completo *</label>
            <input
              id="nombre"
              type="text"
              placeholder="Ej: Camilo Vega"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="correo">Correo Electrónico *</label>
            <input
              id="correo"
              type="email"
              placeholder="ejemplo@correo.cl"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="telefono">Teléfono / WhatsApp (Opcional)</label>
            <input
              id="telefono"
              type="tel"
              placeholder="+56 9 1234 5678"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="mensaje">Mensaje o Consulta sobre Equipos *</label>
            <textarea
              id="mensaje"
              rows="5"
              placeholder="Detalla tu consulta técnica, requerimiento o cotización..."
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
            ></textarea>
          </div>

          <button className="primary" type="submit">
            Enviar Consulta
          </button>
        </form>
      )}
    </section>
  );
}
