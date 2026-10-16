import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext.jsx";

const CART_KEY = "sonido_vivo_carrito";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(CART_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });

  const [alertaCarrito, setAlertaCarrito] = useState("");
  const { tieneDescuentoDuoc } = useAuth();

  // Guardar en localStorage ante cualquier cambio
  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch (e) {
      console.error("Error al guardar carrito en localStorage:", e);
    }
  }, [items]);

  function mostrarNotificacion(msg) {
    setAlertaCarrito(msg);
    setTimeout(() => {
      setAlertaCarrito("");
    }, 3500);
  }

  // Agregar producto al carrito
  function agregarAlCarrito(producto, cantidad = 1) {
    const qty = Math.max(1, Number(cantidad) || 1);
    setItems((prev) => {
      const index = prev.findIndex((i) => i.id === producto.id);
      if (index !== -1) {
        const actualizados = [...prev];
        actualizados[index] = {
          ...actualizados[index],
          cantidad: actualizados[index].cantidad + qty,
        };
        return actualizados;
      }
      return [...prev, { id: producto.id, producto, cantidad: qty }];
    });
    mostrarNotificacion(`🛒 ¡Agregado "${producto.nombre}" al carrito!`);
  }

  // Modificar cantidad (+ / - o input directo)
  function modificarCantidad(id, nuevaCantidad) {
    const qty = Number(nuevaCantidad);
    if (qty <= 0) {
      eliminarDelCarrito(id);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, cantidad: qty } : i))
    );
  }

  // Eliminar un item específico
  function eliminarDelCarrito(id) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  // Vaciar carrito
  function vaciarCarrito() {
    setItems([]);
  }

  // Cálculos financieros
  const totalItems = items.reduce((acc, i) => acc + (Number(i.cantidad) || 0), 0);
  const subtotal = items.reduce(
    (acc, i) => acc + (Number(i.producto.precio) || 0) * (Number(i.cantidad) || 0),
    0
  );

  const porcentajeDescuento = tieneDescuentoDuoc ? 20 : 0;
  const montoDescuento = tieneDescuentoDuoc
    ? Math.round(subtotal * (porcentajeDescuento / 100))
    : 0;
  const total = subtotal - montoDescuento;

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        subtotal,
        tieneDescuentoDuoc,
        porcentajeDescuento,
        montoDescuento,
        total,
        alertaCarrito,
        agregarAlCarrito,
        modificarCantidad,
        eliminarDelCarrito,
        vaciarCarrito,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    // Retorno defensivo para componentes renderizados sin CartProvider (ej: tests)
    return {
      items: [],
      totalItems: 0,
      subtotal: 0,
      tieneDescuentoDuoc: false,
      porcentajeDescuento: 0,
      montoDescuento: 0,
      total: 0,
      alertaCarrito: "",
      agregarAlCarrito: () => {},
      modificarCantidad: () => {},
      eliminarDelCarrito: () => {},
      vaciarCarrito: () => {},
    };
  }
  return context;
}
