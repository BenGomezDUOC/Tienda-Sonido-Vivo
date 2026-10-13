/**
 * ProductoCard recibe un producto mediante props.
 * Componente modular reutilizable para Tienda Sonido Vivo.
 */
export default function ProductoCard({ producto }) {
  return (
    <article className="producto-card">
      <img
        src={producto.imagen}
        alt={producto.nombre}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "/img/audio-placeholder.svg";
        }}
      />
      <div className="producto-body">
        <span className="categoria">{producto.categoria}</span>
        <h3>{producto.nombre}</h3>
        <p className="precio">${producto.precio.toLocaleString("es-CL")}</p>
      </div>
    </article>
  );
}
