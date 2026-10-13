/**
 * Página Login — Tienda Sonido Vivo.
 * Acceso administrativo al panel de gestión de audio y catálogo.
 */
export default function Login() {
  return (
    <section className="form-card">
      <h2>Login Administrador</h2>
      <p>
        Ingresa tus credenciales para administrar el catálogo de equipos,
        stock y pedidos de Tienda Sonido Vivo.
      </p>

      <form>
        <div className="form-group">
          <label htmlFor="usuario">Usuario o Correo</label>
          <input
            id="usuario"
            type="text"
            placeholder="admin o admin@sonidovivo.cl"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input id="password" type="password" placeholder="••••••••" />
        </div>

        <button className="primary" type="button">
          Ingresar al Panel
        </button>
      </form>
    </section>
  );
}
