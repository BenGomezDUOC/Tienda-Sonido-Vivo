import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProductoFormModal from "../components/ProductoFormModal.jsx";

describe("Componente ProductoFormModal (ProductoFormModal.jsx) - Validaciones, Interacción y Mocks/Spies", () => {
  // Prueba 8: Validación de campo obligatorio (Nombre vacío)
  it("8. Muestra mensaje de error y no ejecuta onSave si el nombre del producto está vacío", async () => {
    const onSaveMock = vi.fn();
    const onCloseMock = vi.fn();

    render(
      <ProductoFormModal
        isOpen={true}
        onClose={onCloseMock}
        onSave={onSaveMock}
        productoAEditar={null}
      />
    );

    // Intentamos guardar con el nombre en blanco
    const botonGuardar = screen.getByRole("button", { name: /Crear Equipo/i });
    fireEvent.click(botonGuardar);

    // Mensaje de validación visible
    expect(
      screen.getByText("El nombre del equipo es obligatorio.")
    ).toBeInTheDocument();

    // Verificamos que el spy no haya sido ejecutado
    expect(onSaveMock).not.toHaveBeenCalled();
  });

  // Prueba 9: Validación de regla de negocio de precio numérico mayor a 0
  it("9. Muestra mensaje de error de validación cuando el precio es menor o igual a $0 CLP", async () => {
    const onSaveMock = vi.fn();
    const onCloseMock = vi.fn();
    const user = userEvent.setup();

    render(
      <ProductoFormModal
        isOpen={true}
        onClose={onCloseMock}
        onSave={onSaveMock}
        productoAEditar={null}
      />
    );

    // Ingresamos nombre válido pero precio inválido ($0)
    const inputNombre = screen.getByLabelText(/Nombre del Equipo/i);
    const inputPrecio = screen.getByLabelText(/Precio en CLP/i);
    const botonGuardar = screen.getByRole("button", { name: /Crear Equipo/i });

    await user.type(inputNombre, "Micrófono Corbatero");
    await user.clear(inputPrecio);
    await user.type(inputPrecio, "0");

    await user.click(botonGuardar);

    // Verificamos el mensaje de error de validación de rango
    expect(
      screen.getByText("El precio debe ser un número mayor a $0 CLP.")
    ).toBeInTheDocument();

    // El callback mockeado no debe ejecutarse
    expect(onSaveMock).not.toHaveBeenCalled();
  });

  // Prueba 10: Interacción de usuario completa y verificación de Spy con argumentos
  it("10. Simula el flujo completo de llenado del formulario y verifica con un Spy que onSave es llamado con los datos exactos", async () => {
    const onSaveSpy = vi.fn();
    const onCloseSpy = vi.fn();
    const user = userEvent.setup();

    render(
      <ProductoFormModal
        isOpen={true}
        onClose={onCloseSpy}
        onSave={onSaveSpy}
        productoAEditar={null}
      />
    );

    const inputNombre = screen.getByLabelText(/Nombre del Equipo/i);
    const selectCategoria = screen.getByLabelText(/Categoría de Audio/i);
    const inputPrecio = screen.getByLabelText(/Precio en CLP/i);
    const botonGuardar = screen.getByRole("button", { name: /Crear Equipo/i });

    // Simulación de interacción de usuario real
    await user.type(inputNombre, "Monitores Yamaha HS8 Activos");
    await user.selectOptions(selectCategoria, "Monitores y Parlantes");
    await user.type(inputPrecio, "489990");

    await user.click(botonGuardar);

    // Comprobaciones del Spy según la rúbrica (vi.fn() y toHaveBeenCalledWith)
    expect(onSaveSpy).toHaveBeenCalledTimes(1);
    expect(onSaveSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        nombre: "Monitores Yamaha HS8 Activos",
        categoria: "Monitores y Parlantes",
        precio: 489990,
      })
    );

    // No debe existir mensaje de error activo
    expect(
      screen.queryByText(/El nombre del equipo es obligatorio/i)
    ).not.toBeInTheDocument();
  });
});
