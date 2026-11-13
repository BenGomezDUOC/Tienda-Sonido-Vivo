import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

/**
 * Página Login — Tienda Sonido Vivo.
 * Autenticación REST con Spring Boot, JWT y control de roles (ROLE_ADMIN / ROLE_CLIENTE).
 */
export default function Login() {
  const [identificador, setIdentificador] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);
  const { login, usuario: usuarioActivo, logout } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (!identificador.trim() || !password.trim()) {
      setError("Por favor ingresa tu correo electrónico y contraseña.");
      return;
    }

    setEnviando(true);
    setError("");

    try {
      const res = await login(identificador, password);

      if (!res.ok) {
        setError(res.error || "Credenciales incorrectas.");
        setEnviando(false);
        return;
      }

      setError("");
      const rol = res.usuario.rol?.toLowerCase();
      if (rol === "admin" || res.usuario.esAdmin) {
        navigate("/admin");
      } else {
        navigate("/productos");
      }
    } catch (err) {
      setError(err.message || "Error al conectar con el servidor.");
    } finally {
      setEnviando(false);
    }
  }

  // Si ya hay sesión iniciada, mostrar tarjeta con opción de cerrar sesión o ir al panel
  if (usuarioActivo) {
    const esAdmin =
      usuarioActivo.rol === "admin" ||
      usuarioActivo.rol === "ROLE_ADMIN" ||
      usuarioActivo.esAdmin;

    return (
      <section className="form-card">
        <h2>Sesión Activa</h2>
        <div
          className="admin-alert"
          style={{ flexDirection: "column", alignItems: "flex-start", gap: "10px" }}
        >
          <span>
            👤 Conectado como: <strong>{usuarioActivo.nombre}</strong> ({usuarioActivo.email})
          </span>
          <span style={{ fontSize: "0.85rem", color: "var(--texto-secundario)" }}>
            Rol: <strong>{usuarioActivo.rol.toUpperCase()}</strong>
            {(usuarioActivo.descuentoDuoc || usuarioActivo.esDuoc) &&
              " · 🎓 20% Descuento Duoc Activo"}
          </span>
          <div style={{ display: "flex", gap: "10px", marginTop: "12px", flexWrap: "wrap" }}>
            {esAdmin && (
              <button
                type="button"
                className="primary"
                onClick={() => navigate("/admin")}
              >
                Ir al Panel Admin
              </button>
            )}
            <button
              type="button"
              className="btn-outline"
              onClick={() => navigate("/productos")}
            >
              Ver Catálogo
            </button>
            <button
              type="button"
              className="btn-danger-sm"
              onClick={logout}
              style={{ padding: "8px 14px" }}
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="form-card">
      <h2>Iniciar Sesión en Sonido Vivo</h2>
      <p>
        Accede con tu cuenta persistida en MySQL para gestionar pedidos o administrar el inventario.
      </p>

      {/* Caja de ayuda para la evaluación / presentación en vivo */}
      <div
        style={{
          background: "rgba(0, 194, 255, 0.08)",
          border: "1px dashed var(--azul)",
          borderRadius: "var(--radio-sm)",
          padding: "12px 16px",
          marginBottom: "20px",
          fontSize: "0.85rem",
          color: "var(--texto-secundario)",
        }}
      >
        <strong style={{ color: "var(--azul)", display: "block", marginBottom: "4px" }}>
          🔑 Credenciales Sembradas en MySQL (EP3):
        </strong>
        • <strong>Administrador:</strong> <code>admin@sonidovivo.cl</code> / <code>duoc123</code> (acceso CRUD total)<br />
        • <strong>Cliente Duoc:</strong> <code>alumno@duocuc.cl</code> / <code>duoc123</code> (20% descuento automático)<br />
        • O regístrate con tu correo para crear un nuevo usuario en la base de datos.
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {error && (
          <div className="modal-error" style={{ marginBottom: "16px" }}>
            {error}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="login-id">Correo Electrónico *</label>
          <input
            id="login-id"
            type="email"
            placeholder="admin@sonidovivo.cl o alumno@duocuc.cl"
            value={identificador}
            onChange={(e) => setIdentificador(e.target.value)}
            autoComplete="username"
            autoFocus
            disabled={enviando}
          />
        </div>

        <div className="form-group">
          <label htmlFor="login-password">Contraseña *</label>
          <input
            id="login-password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            disabled={enviando}
          />
        </div>

        <button
          className="primary"
          type="submit"
          style={{ width: "100%", marginTop: "8px" }}
          disabled={enviando}
        >
          {enviando ? "Autenticando..." : "Ingresar con JWT"}
        </button>

        <p style={{ textAlign: "center", marginTop: "18px", fontSize: "0.9rem" }}>
          ¿No tienes una cuenta aún?{" "}
          <Link to="/registro" style={{ color: "var(--azul)", fontWeight: 700 }}>
            Regístrate aquí
          </Link>
        </p>
      </form>
    </section>
  );
}
