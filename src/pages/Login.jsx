import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

/**
 * Página Login — Tienda Sonido Vivo.
 * Autenticación de usuarios clientes y administradores con control de roles.
 */
export default function Login() {
  const [identificador, setIdentificador] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, usuario: usuarioActivo, logout } = useAuth();
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();

    if (!identificador.trim() || !password.trim()) {
      setError("Por favor ingresa usuario/correo y contraseña.");
      return;
    }

    const res = login(identificador, password);

    if (!res.ok) {
      setError(res.error);
      return;
    }

    setError("");
    if (res.usuario.rol === "admin") {
      navigate("/admin");
    } else {
      navigate("/productos");
    }
  }

  // Si ya hay sesión iniciada, mostrar tarjeta con opción de cerrar sesión o ir al panel
  if (usuarioActivo) {
    return (
      <section className="form-card">
        <h2>Sesión Activa</h2>
        <div className="admin-alert" style={{ flexDirection: "column", alignItems: "flex-start", gap: "10px" }}>
          <span>👤 Conectado como: <strong>{usuarioActivo.nombre}</strong> ({usuarioActivo.email})</span>
          <span style={{ fontSize: "0.85rem", color: "var(--texto-secundario)" }}>
            Rol: <strong>{usuarioActivo.rol.toUpperCase()}</strong>
            {usuarioActivo.descuentoDuoc && " · 🎓 20% Descuento Duoc Activo"}
          </span>
          <div style={{ display: "flex", gap: "10px", marginTop: "12px", flexWrap: "wrap" }}>
            {usuarioActivo.rol === "admin" && (
              <button type="button" className="primary" onClick={() => navigate("/admin")}>
                Ir al Panel Admin
              </button>
            )}
            <button type="button" className="btn-outline" onClick={() => navigate("/productos")}>
              Ver Catálogo
            </button>
            <button type="button" className="btn-danger-sm" onClick={logout} style={{ padding: "8px 14px" }}>
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
        Accede a tu cuenta para gestionar pedidos o administrar el inventario de audio.
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
          🔑 Credenciales para Evaluación:
        </strong>
        • <strong>Administrador:</strong> usuario <code>admin</code> / contraseña <code>duoc123</code> (acceso al panel CRUD)<br />
        • <strong>Cliente con Descuento:</strong> Regístrate con cualquier correo <code>@duocuc.cl</code>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {error && <div className="modal-error" style={{ marginBottom: "16px" }}>{error}</div>}

        <div className="form-group">
          <label htmlFor="login-id">Usuario o Correo Electrónico *</label>
          <input
            id="login-id"
            type="text"
            placeholder="admin o tu.correo@ejemplo.cl"
            value={identificador}
            onChange={(e) => setIdentificador(e.target.value)}
            autoComplete="username"
            autoFocus
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
          />
        </div>

        <button className="primary" type="submit" style={{ width: "100%", marginTop: "8px" }}>
          Ingresar
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
