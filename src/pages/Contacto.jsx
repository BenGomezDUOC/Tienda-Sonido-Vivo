/**
 * Página Contacto — Tienda Sonido Vivo.
 * Consultas sobre productos de audio, asesoría técnica y cotizaciones.
 */
export default function Contacto() {
  return (
    <section className="form-card">
      <h2>Contacto y Asesoría en Audio</h2>
      <p>
        ¿Tienes dudas sobre compatibilidad de micrófonos, interfaces o requieres
        cotizar equipamiento para tu estudio o escenario? Escríbenos.
      </p>

      <form>
        <div className="form-group">
          <label htmlFor="nombre">Nombre Completo</label>
          <input id="nombre" type="text" placeholder="Ej: Camilo Vega" />
        </div>

        <div className="form-group">
          <label htmlFor="correo">Correo Electrónico</label>
          <input id="correo" type="email" placeholder="ejemplo@correo.cl" />
        </div>

        <div className="form-group">
          <label htmlFor="telefono">Teléfono / WhatsApp</label>
          <input id="telefono" type="tel" placeholder="+56 9 1234 5678" />
        </div>

        <div className="form-group">
          <label htmlFor="mensaje">Mensaje o Consulta sobre Equipos</label>
          <textarea
            id="mensaje"
            rows="5"
            placeholder="Detalla tu consulta técnica, requerimiento o cotización..."
          ></textarea>
        </div>

        <button className="primary" type="button">
          Enviar Consulta
        </button>
      </form>
    </section>
  );
}
