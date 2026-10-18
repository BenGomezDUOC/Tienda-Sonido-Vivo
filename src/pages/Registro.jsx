import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { esCorreoDuoc, esMayorDeEdad } from "../services/authStorage.js";

/**
 * Página Registro — Tienda Sonido Vivo.
 * Permite a nuevos clientes registrarse con beneficio de descuento institucional Duoc UC.
 * Cada campo cuenta con su propio mensaje de error y validación específica.
 */
export default function Registro() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [password, setPassword] = useState("");
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState("");
  const { registro } = useAuth();
  const navigate = useNavigate();

  const calificaDuoc = esCorreoDuoc(email);

  function validarCampos() {
    const nuevosErrores = {};

    // 1. Validación de Nombre
    if (!nombre.trim()) {
      nuevosErrores.nombre = "El nombre completo es obligatorio.";
    } else if (nombre.trim().length < 3) {
      nuevosErrores.nombre = "El nombre debe tener al menos 3 caracteres.";
    }

    // 2. Validación de Correo
    const emailNorm = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailNorm) {
      nuevosErrores.email = "El correo electrónico es obligatorio.";
    } else if (!emailRegex.test(emailNorm)) {
      nuevosErrores.email = "Ingresa un formato de correo electrónico válido (ej: nombre@correo.cl).";
    }

    // 3. Validación de Fecha de Nacimiento
    if (!fechaNacimiento) {
      nuevosErrores.fechaNacimiento = "La fecha de nacimiento es obligatoria.";
    } else if (!esMayorDeEdad(fechaNacimiento)) {
      nuevosErrores.fechaNacimiento = "Debes ser mayor de 18 años para registrarte en la tienda.";
    }

    // 4. Validación de Contraseña
    if (!password.trim()) {
      nuevosErrores.password = "La contraseña es obligatoria.";
    } else if (password.length < 4) {
      nuevosErrores.password = "La contraseña debe tener al menos 4 caracteres.";
    }

    return nuevosErrores;
  }

  function handleSubmit(e) {
    e.preventDefault();

    const nuevosErrores = validarCampos();
    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      setErrorGeneral("");
      return;
    }

    setErrores({});
    setErrorGeneral("");

    const res = registro({
      nombre,
      email,
      fechaNacimiento,
      password,
    });

    if (!res.ok) {
      if (res.error && res.error.toLowerCase().includes("correo")) {
        setErrores({ email: res.error });
      } else if (res.error && res.error.toLowerCase().includes("18 años")) {
        setErrores({ fechaNacimiento: res.error });
      } else {
        setErrorGeneral(res.error);
      }
      return;
    }

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
        {errorGeneral && <div className="modal-error" style={{ marginBottom: "16px" }}>{errorGeneral}</div>}

        <div className="form-group">
          <label htmlFor="reg-nombre">Nombre Completo *</label>
          <input
            id="reg-nombre"
            type="text"
            placeholder="Ej: Sofía Valenzuela"
            value={nombre}
            className={errores.nombre ? "input-error" : ""}
            onChange={(e) => {
              setNombre(e.target.value);
              if (errores.nombre) setErrores((prev) => ({ ...prev, nombre: "" }));
            }}
            autoFocus
          />
          {errores.nombre && <span className="field-error">{errores.nombre}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="reg-email">Correo Electrónico *</label>
          <input
            id="reg-email"
            type="email"
            placeholder="ejemplo@correo.cl o nombre@duocuc.cl"
            value={email}
            className={errores.email ? "input-error" : ""}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errores.email) setErrores((prev) => ({ ...prev, email: "" }));
            }}
          />
          {errores.email && <span className="field-error">{errores.email}</span>}
          {calificaDuoc ? (
            <div
              className="admin-alert"
              style={{ padding: "8px 12px", marginTop: "6px", fontSize: "0.85rem", gap: "6px" }}
            >
              🎓 <strong>¡Beneficio activado!</strong> Tu correo institucional te otorga 20% de descuento permanente.
            </div>
          ) : (
            !errores.email && (
              <small style={{ color: "var(--texto-tenue)", fontSize: "0.8rem", marginTop: "4px" }}>
                💡 Alumnos y docentes: usa tu correo institucional (ej: <code>@duocuc.cl</code>) para activar 20% de descuento automático.
              </small>
            )
          )}
        </div>

        <div className="form-group">
          <label htmlFor="reg-nacimiento">Fecha de Nacimiento * (Mayor de 18 años)</label>
          <input
            id="reg-nacimiento"
            type="date"
            value={fechaNacimiento}
            className={errores.fechaNacimiento ? "input-error" : ""}
            onChange={(e) => {
              setFechaNacimiento(e.target.value);
              if (errores.fechaNacimiento) setErrores((prev) => ({ ...prev, fechaNacimiento: "" }));
            }}
          />
          {errores.fechaNacimiento && (
            <span className="field-error">{errores.fechaNacimiento}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="reg-password">Contraseña *</label>
          <input
            id="reg-password"
            type="password"
            placeholder="••••••••"
            value={password}
            className={errores.password ? "input-error" : ""}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errores.password) setErrores((prev) => ({ ...prev, password: "" }));
            }}
          />
          {errores.password && <span className="field-error">{errores.password}</span>}
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
