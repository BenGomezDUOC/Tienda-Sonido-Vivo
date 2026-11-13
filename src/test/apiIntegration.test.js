import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  API_BASE_URL,
  getAuthToken,
  removeAuthToken,
  setAuthToken,
} from "../services/api.js";
import {
  esCorreoDuoc,
  esMayorDeEdad,
  normalizarUsuario,
} from "../services/authApi.js";
import { getProductosApi } from "../services/productosApi.js";

describe("Integración API REST y Seguridad JWT (EP3)", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("1. Almacena, recupera y remueve el token JWT en localStorage correctamente", () => {
    expect(getAuthToken()).toBeNull();

    const mockToken = "eyJhbGciOiJIUzI1NiJ9.testToken";
    setAuthToken(mockToken);
    expect(getAuthToken()).toBe(mockToken);

    removeAuthToken();
    expect(getAuthToken()).toBeNull();
  });

  it("2. normalizarUsuario mapea correctamente los roles de Spring Security (ROLE_ADMIN a admin)", () => {
    const rawUserAdmin = {
      id: 1,
      nombre: "Administrador Sonido Vivo",
      email: "admin@sonidovivo.cl",
      rol: "ROLE_ADMIN",
      esDuoc: false,
    };

    const usuario = normalizarUsuario(rawUserAdmin);
    expect(usuario.rol).toBe("admin");
    expect(usuario.esAdmin).toBe(true);
    expect(usuario.descuentoDuoc).toBe(false);
  });

  it("3. normalizarUsuario activa descuentoDuoc cuando esDuoc es true", () => {
    const rawUserCliente = {
      id: 2,
      nombre: "Alumno Duoc",
      email: "alumno@duocuc.cl",
      rol: "ROLE_CLIENTE",
      esDuoc: true,
    };

    const usuario = normalizarUsuario(rawUserCliente);
    expect(usuario.rol).toBe("cliente");
    expect(usuario.esAdmin).toBe(false);
    expect(usuario.descuentoDuoc).toBe(true);
  });

  it("4. esCorreoDuoc identifica correos @duocuc.cl y @duoc.cl", () => {
    expect(esCorreoDuoc("alumno@duocuc.cl")).toBe(true);
    expect(esCorreoDuoc("profesor@duoc.cl")).toBe(true);
    expect(esCorreoDuoc("externo@gmail.com")).toBe(false);
    expect(esCorreoDuoc("")).toBe(false);
  });

  it("5. esMayorDeEdad valida correctamente usuarios con al menos 18 años", () => {
    const hoy = new Date();
    const mayor = `${hoy.getFullYear() - 20}-01-15`;
    const menor = `${hoy.getFullYear() - 15}-01-15`;

    expect(esMayorDeEdad(mayor)).toBe(true);
    expect(esMayorDeEdad(menor)).toBe(false);
    expect(esMayorDeEdad("")).toBe(false);
  });

  it("6. getProductosApi realiza fetch a /productos y mapea datos", async () => {
    const mockProductos = [
      {
        id: 1,
        nombre: "Audífonos Audio-Technica ATH-M50x",
        precio: 159990,
        categoria: "Audífonos",
        imagen: "/img/m50x.png",
        stock: 15,
      },
    ];

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: {
        get: (h) => (h === "content-type" ? "application/json" : null),
      },
      json: async () => mockProductos,
    });

    const resultado = await getProductosApi();
    expect(global.fetch).toHaveBeenCalledWith(
      `${API_BASE_URL}/productos`,
      expect.objectContaining({ method: "GET" })
    );
    expect(resultado.length).toBe(1);
    expect(resultado[0].nombre).toBe("Audífonos Audio-Technica ATH-M50x");
  });
});
