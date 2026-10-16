import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { esCorreoDuoc } from "../services/authStorage.js";

/**
 * Página Registro — Tienda Sonido Vivo.
 * Permite a nuevos clientes registrarse con beneficio de descuento institucional Duoc UC.
 */
export default function Registro() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { registro } = useAuth();
  const navigate = useNavigate();

  const calificaDuoc = esCorreoDuoc(email);

  function handleSubmit(e) {
    e.preventDefault();

    if (!nombre.trim() || !email.trim() || !fechaNacimiento || !password.trim()) {
      setError("Todos los campos marcados con (*) son obligatorios.");
      return;
    }

    if (password.length < 4) {
      setError("La contraseña debe tener al menos 4 caracteres.");
      return;
    }

    const res = registro({
      nombre,
      email,
      fechaNacimiento,
      password,
    });

    if (!res.ok) {
      setError(res.error);
      return;
    }

    setError("");
    navigate("/productos");
  }

  return (
    <section className="form-card">
      <h2>Crear Cuenta en Sonido Vivo</h2>
      <p>
        Regístrate para guardar tu carrito, acceder a promociones exclusivas y
        disfrutar de equipamiento de audio profesional en Chile.
      </p>

      <form onSubmit={handleSubmit} noValidate>
        {error && <div className="modal-error" style={{ marginBottom: "16px" }}>{error}</div>}

        <div className="form-group">
          <label htmlFor="reg-nombre">Nombre Completo *</label>
          <input
            id="reg-nombre"
            type="text"
            placeholder="Ej: Sofía Valenzuela"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            autoFocus
          />
        </div>

        <div className="form-group">
          <label htmlFor="reg-email">Correo Electrónico *</label>
          <input
            id="reg-email"
            type="email"
            placeholder="ejemplo@correo.cl o nombre@duocuc.cl"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {calificaDuoc ? (
            <div
              className="admin-alert"
              style={{ padding: "8px 12px", marginTop: "6px", fontSize: "0.85rem", gap: "6px" }}
            >
              🎓 <strong>¡Beneficio activado!</strong> Tu correo institucional te otorga 20% de descuento permanente.
            </div>
          ) : (
            <small style={{ color: "var(--texto-tenue)", fontSize: "0.8rem", marginTop: "4px" }}>
              💡 Alumnos y docentes: usa tu correo institucional (ej: <code>@duocuc.cl</code>) para activar 20% de descuento automático.
            </small>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="reg-nacimiento">Fecha de Nacimiento * (Mayor de 18 años)</label>
          <input
            id="reg-nacimiento"
            type="date"
            value={fechaNacimiento}
            onChange={(e) => setFechaNacimiento(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="reg-password">Contraseña *</label>
          <input
            id="reg-password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="primary" type="submit" style={{ width: "100%", marginTop: "8px" }}>
          Crear Mi Cuenta
        </button>

        <p style={{ textAlign: "center", marginTop: "18px", fontSize: "0.9rem" }}>
          ¿Ya tienes una cuenta?{" "}
          <Link to="/login" style={{ color: "var(--azul)", fontWeight: 700 }}>
            Inicia sesión aquí
          </Link>
        </p>
      </form>
    </section>
  );
}
