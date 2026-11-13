import { createContext, useContext, useEffect, useState } from "react";
import {
  cerrarSesionApi,
  getPerfilMeApi,
  getSesionActual,
  loginApi,
  registroApi,
} from "../services/authApi.js";
import {
  autenticarUsuario as autenticarUsuarioLocal,
  registrarUsuario as registrarUsuarioLocal,
} from "../services/authStorage.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function inicializarSesion() {
      // 1. Cargar sesión cached en localStorage inmediatamente para evitar parpadeos
      const sesionCached = getSesionActual();
      if (sesionCached) {
        setUsuario(sesionCached);
      }

      // 2. Si hay token, revalidar contra el backend Spring Boot (/api/auth/me)
      try {
        const perfilRemoto = await getPerfilMeApi();
        if (perfilRemoto) {
          setUsuario(perfilRemoto);
        }
      } catch (e) {
        // Si no responde el backend, se mantiene la sesión local cached
      } finally {
        setCargando(false);
      }
    }

    inicializarSesion();
  }, []);

  async function handleLogin(identificador, password) {
    // 1. Intentar autenticar contra el backend Spring Boot
    const res = await loginApi(identificador, password);
    if (res.ok) {
      setUsuario(res.usuario);
      return res;
    }

    // 2. Si el backend falló por problemas de conexión, probar fallback local
    if (res.error && res.error.includes("Failed to fetch")) {
      const resLocal = autenticarUsuarioLocal(identificador, password);
      if (resLocal.ok) {
        const rolUpper = String(resLocal.usuario.rol || "").toUpperCase();
        const normalizado = {
          ...resLocal.usuario,
          rol: rolUpper === "ADMIN" || resLocal.usuario.rol === "admin" ? "admin" : "cliente",
          descuentoDuoc: Boolean(resLocal.usuario.descuentoDuoc),
        };
        setUsuario(normalizado);
        return { ok: true, usuario: normalizado };
      }
    }

    return res;
  }

  function handleLogout() {
    cerrarSesionApi();
    setUsuario(null);
  }

  async function handleRegistro(datos) {
    // 1. Intentar registrar en Spring Boot + MySQL
    const res = await registroApi(datos);
    if (res.ok) {
      setUsuario(res.usuario);
      return res;
    }

    // 2. Si el backend falló por conectividad, registrar en fallback local
    if (res.error && res.error.includes("Failed to fetch")) {
      const resLocal = registrarUsuarioLocal(datos);
      if (resLocal.ok) {
        setUsuario(resLocal.usuario);
        return resLocal;
      }
    }

    return res;
  }

  const esAdmin =
    usuario?.rol === "admin" ||
    usuario?.rol === "ROLE_ADMIN" ||
    usuario?.rolSpring === "ROLE_ADMIN";

  const tieneDescuentoDuoc = Boolean(
    usuario?.descuentoDuoc || usuario?.esDuoc
  );

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
