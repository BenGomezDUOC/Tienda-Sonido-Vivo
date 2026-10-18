/**
 * Servicio de almacenamiento y gestión de Reseñas y Calificaciones (1 a 5 estrellas).
 * Persistencia en localStorage bajo la clave "sonido_vivo_resenas".
 */

const RESENAS_KEY = "sonido_vivo_resenas";

// Reseñas base iniciales orientadas al equipamiento de audio profesional
const RESENAS_BASE = {
  1: [
    {
      id: "r1_1",
      autor: "Camilo Sound (Home Studio)",
      calificacion: 5,
      comentario: "Respuesta en frecuencia impecable para monitorear grabaciones y mezclar voces. Las almohadillas aíslan muy bien el ruido ambiental en sesiones largas.",
      fecha: "14/10/2026",
    },
    {
      id: "r1_2",
      autor: "Esteban Riquelme",
      calificacion: 5,
      comentario: "Los mejores audífonos de monitoreo en este rango de precio. Bajos definidos sin ser exagerados y construcción plegable muy resistente.",
      fecha: "05/10/2026",
    },
  ],
  2: [
    {
      id: "r2_1",
      autor: "Matías - Podcast Chile",
      calificacion: 5,
      comentario: "El estándar absoluto para locución y podcasting. Rechaza el ruido fuera de eje y da una calidez vocal insuperable.",
      fecha: "16/10/2026",
    },
    {
      id: "r2_2",
      autor: "Paula Valdés (Voz Comercial)",
      calificacion: 5,
      comentario: "Construcción blindada como un tanque. La cápsula dinámica maneja niveles de presión sonora altísimos sin distorsionar.",
      fecha: "10/10/2026",
    },
  ],
  3: [
    {
      id: "r3_1",
      autor: "Felipe Soto",
      calificacion: 5,
      comentario: "Los preamplificadores de 4ta generación tienen un piso de ruido bajísimo. El modo Air le aporta un brillo cristalino a las guitarras acústicas.",
      fecha: "12/10/2026",
    },
  ],
  4: [
    {
      id: "r4_1",
      autor: "Rodrigo Bass",
      calificacion: 5,
      comentario: "Claridad quirúrgica en los medios y agudos. Si tu mezcla suena balanceada en los HS5, sonará bien en cualquier sistema de sonido.",
      fecha: "08/10/2026",
    },
  ],
  5: [
    {
      id: "r5_1",
      autor: "Ignacio M.",
      calificacion: 5,
      comentario: "Estética vintage hermosa y un sonido estéreo amplio con presencia cálida para sala de estar o sala de escucha.",
      fecha: "06/10/2026",
    },
  ],
  6: [
    {
      id: "r6_1",
      autor: "Javier Beats",
      calificacion: 5,
      comentario: "Integración perfecta con Ableton Live y Logic Pro. Los pads RGB tienen excelente sensibilidad a la velocidad para programar baterías.",
      fecha: "15/10/2026",
    },
  ],
  7: [
    {
      id: "r7_1",
      autor: "Francisca Streaming",
      calificacion: 4,
      comentario: "Conectar vía USB y listo. El filtro antipop magnético incorporado y la salida de audífonos con latencia cero son muy prácticos.",
      fecha: "11/10/2026",
    },
  ],
  8: [
    {
      id: "r8_1",
      autor: "Gonzalo Araya",
      calificacion: 5,
      comentario: "La cancelación activa de ruido es de nivel superior. Ideal para viajes y para escuchar referencias de audio en movimiento.",
      fecha: "09/10/2026",
    },
  ],
  9: [
    {
      id: "r9_1",
      autor: "Claudio Producciones",
      calificacion: 4,
      comentario: "Mezcladora compacta muy versátil para dos micrófonos XLR. Los ecualizadores británicos responden de forma muy musical.",
      fecha: "03/10/2026",
    },
  ],
  10: [
    {
      id: "r10_1",
      autor: "Nicolás Baterista",
      calificacion: 5,
      comentario: "Aislamiento de ruido excelente para monitoreo in-ear en vivo. El cable desmontable reforzado con Kevlar dura años.",
      fecha: "07/10/2026",
    },
  ],
  11: [
    {
      id: "r11_1",
      autor: "ViniloFan Santiago",
      calificacion: 5,
      comentario: "Tracción directa suave y silenciosa con salida USB para digitalizar colecciones de vinilo en alta fidelidad.",
      fecha: "04/10/2026",
    },
  ],
  12: [
    {
      id: "r12_1",
      autor: "Cristóbal Sonidista",
      calificacion: 5,
      comentario: "Conectores metálicos firmes y blindaje libre de ruidos o interferencias. Accesorios fundamentales para cualquier setup.",
      fecha: "02/10/2026",
    },
  ],
};

/**
 * Obtiene todas las reseñas almacenadas en localStorage o inicializa con la base.
 */
function getTodasLasResenas() {
  try {
    const raw = localStorage.getItem(RESENAS_KEY);
    if (!raw) {
      localStorage.setItem(RESENAS_KEY, JSON.stringify(RESENAS_BASE));
      return RESENAS_BASE;
    }
    const data = JSON.parse(raw);
    return typeof data === "object" && data !== null ? data : RESENAS_BASE;
  } catch (err) {
    console.error("Error al leer reseñas de localStorage:", err);
    return RESENAS_BASE;
  }
}

/**
 * Obtiene las reseñas de un producto específico.
 */
export function getResenasPorProducto(productoId) {
  const todas = getTodasLasResenas();
  const idNum = Number(productoId);
  return todas[idNum] || [];
}

/**
 * Agrega una nueva reseña con calificación (1 a 5 estrellas) para un producto.
 */
export function agregarResena(productoId, { autor, calificacion, comentario }) {
  const todas = getTodasLasResenas();
  const idNum = Number(productoId);
  const lista = todas[idNum] ? [...todas[idNum]] : [];

  const nueva = {
    id: "r_" + Date.now(),
    autor: autor.trim() || "Cliente Verificado",
    calificacion: Math.min(5, Math.max(1, Number(calificacion) || 5)),
    comentario: comentario.trim(),
    fecha: new Date().toLocaleDateString("es-CL"),
  };

  // Se añade al inicio para mostrar la más reciente primero
  const listaActualizada = [nueva, ...lista];
  todas[idNum] = listaActualizada;

  try {
    localStorage.setItem(RESENAS_KEY, JSON.stringify(todas));
  } catch (err) {
    console.error("Error al guardar reseña:", err);
  }

  return listaActualizada;
}

/**
 * Calcula el promedio de estrellas y cantidad de reseñas de un producto.
 */
export function getPromedioResenas(productoId) {
  const resenas = getResenasPorProducto(productoId);
  if (!resenas || resenas.length === 0) {
    return { promedio: 5.0, total: 0 };
  }
  const suma = resenas.reduce((acc, r) => acc + (Number(r.calificacion) || 5), 0);
  const promedio = Number((suma / resenas.length).toFixed(1));
  return { promedio, total: resenas.length };
}
