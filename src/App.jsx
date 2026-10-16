import { Route, Routes } from "react-router-dom";
import LayoutPrincipal from "./layouts/LayoutPrincipal.jsx";
import Inicio from "./pages/Inicio.jsx";
import Productos from "./pages/Productos.jsx";
import DetalleProducto from "./pages/DetalleProducto.jsx";
import Carrito from "./pages/Carrito.jsx";
import Contacto from "./pages/Contacto.jsx";
import Login from "./pages/Login.jsx";
import Registro from "./pages/Registro.jsx";
import Admin from "./pages/Admin.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";

/**
 * Enrutador principal de Tienda Sonido Vivo con soporte de autenticación y carrito de compras global.
 */
export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          <Route element={<LayoutPrincipal />}>
            <Route index element={<Inicio />} />
            <Route path="productos" element={<Productos />} />
            <Route path="producto/:id" element={<DetalleProducto />} />
            <Route path="carrito" element={<Carrito />} />
            <Route path="contacto" element={<Contacto />} />
            <Route path="login" element={<Login />} />
            <Route path="registro" element={<Registro />} />
            <Route path="admin" element={<Admin />} />
          </Route>
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}
