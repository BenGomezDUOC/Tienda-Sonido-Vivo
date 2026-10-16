import { createContext, useContext, useEffect, useState } from "react";
import {
  autenticarUsuario,
  cerrarSesion,
  getSesionActual,
  registrarUsuario,
} from "../services/authStorage.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const sesion = getSesionActual();
    if (sesion) {
      setUsuario(sesion);
    }
    setCargando(false);
  }, []);

  function handleLogin(identificador, password) {
    const res = autenticarUsuario(identificador, password);
    if (res.ok) {
      setUsuario(res.usuario);
    }
    return res;
  }

  function handleLogout() {
    cerrarSesion();
    setUsuario(null);
  }

  function handleRegistro(datos) {
    const res = registrarUsuario(datos);
    if (res.ok) {
      setUsuario(res.usuario);
    }
    return res;
  }

  const esAdmin = usuario?.rol === "admin";
  const tieneDescuentoDuoc = Boolean(usuario?.descuentoDuoc);

  return (
    <AuthContext.Provider
      value={{
        usuario,
        cargando,
        esAdmin,
        tieneDescuentoDuoc,
        login: handleLogin,
        logout: handleLogout,
        registro: handleRegistro,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser utilizado dentro de un AuthProvider");
  }
  return context;
}
