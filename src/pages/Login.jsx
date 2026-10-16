import { useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Página Login — Tienda Sonido Vivo.
 * Autenticación simulada y redirección controlada al panel de administración.
 */
export default function Login() {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();

    if (!usuario.trim() || !password.trim()) {
      setError("Por favor ingresa usuario y contraseña.");
      return;
    }

    setError("");
    setCargando(true);

    // Simulación de autenticación
    setTimeout(() => {
      setCargando(false);
      navigate("/admin");
    }, 400);
  }

  return (
    <section className="form-card">
      <h2>Login Administrador</h2>
      <p>
        Ingresa tus credenciales para administrar el catálogo de equipos,
        stock y pedidos de Tienda Sonido Vivo.
      </p>

      <form onSubmit={handleSubmit} noValidate>
        {error && <div className="modal-error" style={{ marginBottom: "16px" }}>{error}</div>}

        <div className="form-group">
          <label htmlFor="usuario">Usuario o Correo</label>
          <input
            id="usuario"
            type="text"
            placeholder="admin o admin@sonidovivo.cl"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            autoComplete="username"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>

        <button className="primary" type="submit" disabled={cargando}>
          {cargando ? "Accediendo..." : "Ingresar al Panel"}
        </button>
      </form>
    </section>
  );
}
