import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import ProductoCard from "../components/ProductoCard.jsx";

describe("Componente ProductoCard (ProductoCard.jsx) - Renderizado y Props", () => {
  const productoMock = {
    id: 101,
    nombre: "Interfaz Focusrite Scarlett Solo 4ta Gen",
    categoria: "Interfaces de Audio",
    precio: 139990,
    imagen: "/img/scarlett-2i2.svg",
  };

  // Prueba 6: Renderizado correcto de información y atributos recibidos por props
  it("6. Renderiza adecuadamente el nombre, categoría, imagen y precio formateado en CLP", () => {
    render(<ProductoCard producto={productoMock} />);

    // Verificar nombre del producto en el encabezado
    const titulo = screen.getByRole("heading", { level: 3 });
    expect(titulo).toHaveTextContent("Interfaz Focusrite Scarlett Solo 4ta Gen");

    // Verificar etiqueta de categoría
    expect(screen.getByText("Interfaces de Audio")).toBeInTheDocument();

    // Verificar precio formateado según la configuración regional chilena
    const precioRegex = /139[.,]990/;
    expect(screen.getByText(precioRegex)).toBeInTheDocument();

    // Verificar elemento de imagen y su texto alternativo
    const imagen = screen.getByRole("img");
    expect(imagen).toHaveAttribute("src", "/img/scarlett-2i2.svg");
    expect(imagen).toHaveAttribute(
      "alt",
      "Interfaz Focusrite Scarlett Solo 4ta Gen"
    );
  });

  // Prueba 7: Resiliencia visual y fallback de imagen ante error de carga
  it("7. Cambia el origen de la imagen al placeholder por defecto si ocurre un evento onError", () => {
    render(<ProductoCard producto={productoMock} />);

    const imagen = screen.getByRole("img");

    // Disparamos evento de fallo en la carga de la imagen
    fireEvent.error(imagen);

    // Debe cambiar su atributo src al SVG comodín definido en el componente
    expect(imagen.src).toContain("/img/audio-placeholder.svg");
  });
});
