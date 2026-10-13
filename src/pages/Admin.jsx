/**
 * Página Admin — Tienda Sonido Vivo.
 * Panel de métricas y gestión de catálogo de audio.
 */
export default function Admin() {
  return (
    <section className="panel">
      <h2>Panel Administrador — Tienda Sonido Vivo</h2>
      <p>
        Acceso al resumen operativo de inventario y pedidos de equipos de audio.
      </p>

      <div className="admin-grid">
        <article className="kpi">
          <strong>12</strong>
          <span>Equipos de Audio Activos</span>
        </article>

        <article className="kpi">
          <strong>1</strong>
          <span>Administrador Activo</span>
        </article>

        <article className="kpi">
          <strong>0</strong>
          <span>Pedidos Pendientes</span>
        </article>
      </div>
    </section>
  );
}
