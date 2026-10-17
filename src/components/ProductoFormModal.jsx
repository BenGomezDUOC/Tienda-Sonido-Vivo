import { useEffect, useState } from "react";

const CATEGORIAS_AUDIO = [
  "Audífonos",
  "Micrófonos",
  "Interfaces de Audio",
  "Monitores y Parlantes",
  "Instrumentos y Mezcladores",
  "Accesorios",
];

const IMAGENES_PREDEFINIDAS = [
  { label: "Audífonos ATH-M50x", path: "/img/Audífonos de Estudio Audio-Technica ATH-M50x.png" },
  { label: "Audífonos In-Ear Shure SE215", path: "/img/Audífonos In-Ear Profesionales Shure SE215 PRO.avif" },
  { label: "Audífonos Sony WH-1000XM5", path: "/img/Audífonos Inalámbricos Sony WH-1000XM5.webp" },
  { label: "Micrófono Shure SM7B", path: "/img/Micrófono Dinámico Vocal Shure SM7B.webp" },
  { label: "Micrófono USB Rode NT-USB", path: "/img/Micrófono USB Rode NT-USB Mini.jpg" },
  { label: "Interfaz Scarlett 2i2 4th Gen", path: "/img/Interfaz de Audio Focusrite Scarlett 2i2 4th Gen.jpg" },
  { label: "Monitores Yamaha HS5", path: "/img/Monitores de Estudio Yamaha HS5 (Par).jpg" },
  { label: "Parlante Marshall Acton III", path: "/img/Parlante Bluetooth Marshall Acton III.webp" },
  { label: "Controlador Novation Launchkey 49", path: "/img/Controlador MIDI Novation Launchkey 49 MK3.png" },
  { label: "Consola Behringer Xenyx Q802", path: "/img/Consola de Mezcla Behringer Xenyx Q802USB.jpg" },
  { label: "Tornamesa Audio-Technica LP120X", path: "/img/Tornamesa Audio-Technica AT-LP120XUSB.jpg" },
  { label: "Pack Cables XLR 5m", path: "/img/Pack Cables de Micrófono XLR Macho a Hembra 5m.webp" },
  { label: "Placeholder Genérico", path: "/img/audio-placeholder.svg" },
];

/**
 * Modal interactivo para Crear y Editar productos de audio.
 * Maneja validaciones de formulario y previsualización de imagen.
 */
export default function ProductoFormModal({
  isOpen,
  onClose,
  onSave,
  productoAEditar,
}) {
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState(CATEGORIAS_AUDIO[0]);
  const [precio, setPrecio] = useState("");
  const [imagen, setImagen] = useState(IMAGENES_PREDEFINIDAS[0].path);
  const [error, setError] = useState("");

  const esEdicion = Boolean(productoAEditar);

  // Precargar datos si viene un producto a editar o limpiar si es nuevo
  useEffect(() => {
    if (productoAEditar) {
      setNombre(productoAEditar.nombre || "");
      setCategoria(productoAEditar.categoria || CATEGORIAS_AUDIO[0]);
      setPrecio(String(productoAEditar.precio || ""));
      setImagen(productoAEditar.imagen || IMAGENES_PREDEFINIDAS[0].path);
    } else {
      setNombre("");
      setCategoria(CATEGORIAS_AUDIO[0]);
      setPrecio("");
      setImagen(IMAGENES_PREDEFINIDAS[0].path);
    }
    setError("");
  }, [productoAEditar, isOpen]);

  if (!isOpen) return null;

  function handleSubmit(e) {
    e.preventDefault();

    // Validaciones
    if (!nombre.trim()) {
      setError("El nombre del equipo es obligatorio.");
      return;
    }

    const precioNum = Number(precio);
    if (!precio || isNaN(precioNum) || precioNum <= 0) {
      setError("El precio debe ser un número mayor a $0 CLP.");
      return;
    }

    setError("");
    onSave({
      nombre: nombre.trim(),
      categoria,
      precio: precioNum,
      imagen,
    });
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-box"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-header">
          <h3>
            {esEdicion
              ? `✏️ Editar Equipo #${productoAEditar.id}`
              : "➕ Agregar Nuevo Equipo de Audio"}
          </h3>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Cerrar modal"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form" noValidate>
          {error && <div className="modal-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="form-nombre">Nombre del Equipo *</label>
            <input
              id="form-nombre"
              type="text"
              placeholder="Ej: Micrófono Shure MV7 USB/XLR"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="form-categoria">Categoría de Audio *</label>
            <select
              id="form-categoria"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="form-select"
            >
              {CATEGORIAS_AUDIO.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="form-precio">Precio en CLP ($) *</label>
            <input
              id="form-precio"
              type="number"
              min="1"
              step="100"
              placeholder="Ej: 189990"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="form-imagen">Ilustración / Imagen del Equipo</label>
            <select
              id="form-imagen"
              value={imagen}
              onChange={(e) => setImagen(e.target.value)}
              className="form-select"
            >
              {IMAGENES_PREDEFINIDAS.map((imgItem) => (
                <option key={imgItem.path} value={imgItem.path}>
                  {imgItem.label} ({imgItem.path})
                </option>
              ))}
            </select>

            {/* Previsualización en vivo */}
            <div className="form-img-preview">
              <span>Vista previa:</span>
              <img
                src={imagen}
                alt="Vista previa"
                className="preview-thumb"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/img/audio-placeholder.svg";
                }}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn-outline"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button type="submit" className="primary">
              {esEdicion ? "Guardar Cambios" : "Crear Equipo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
