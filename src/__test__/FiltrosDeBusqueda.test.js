import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import FiltrosDeBusqueda from "../containers/App/components/FiltrosDeBusqueda";

describe("FiltrosDeBusqueda", () => {
  it("deberia renderizar componente", () => {
    render(<FiltrosDeBusqueda />);
  });

  it("deberia ejecutar alFiltrarPorMaximoDeJugadores al escoger una cantidad de maxima de jugadores", () => {
    const alFiltrarPorMaximoDeJugadores = jest.fn();
    render(<FiltrosDeBusqueda alFiltrarPorMaximoDeJugadores={alFiltrarPorMaximoDeJugadores} />);
    const filtroDeJugadores = screen.getByPlaceholderText(/Número de jugadores/i);
    fireEvent.change(filtroDeJugadores, { target: { value: 2 } });
    fireEvent.click(screen.getByText("Filtrar"));
    expect(alFiltrarPorMaximoDeJugadores).toHaveBeenCalledWith(2);
  });

  it("deberia agregar un badge al escoger una cantidad de maxima de jugadores", () => {
    const alFiltrarPorMaximoDeJugadores = jest.fn();
    render(<FiltrosDeBusqueda alFiltrarPorMaximoDeJugadores={alFiltrarPorMaximoDeJugadores} />);
    const filtroDeJugadores = screen.getByPlaceholderText(/Número de jugadores/i);
    act(() => {
      fireEvent.change(filtroDeJugadores, { target: { value: 2 } });
      fireEvent.click(screen.getByText("Filtrar"));
    });

    const badge = screen.queryByText(/Máximo de jugadores: 2/i);
    expect(badge).toBeInTheDocument();

  });

  it("deberia mostrar error al escoger una cantidad de maxima de jugadores invalida", () => {
    const alFiltrarPorMaximoDeJugadores = jest.fn();
    render(<FiltrosDeBusqueda alFiltrarPorMaximoDeJugadores={alFiltrarPorMaximoDeJugadores} />);
    const filtroDeJugadores = screen.getByPlaceholderText(/Número de jugadores/i);

    act(() => {
      fireEvent.change(filtroDeJugadores, { target: { value: "asdf" } });
      fireEvent.click(screen.getByText("Filtrar"));
    });

    let mensajeError = screen.queryByText("El número de jugadores debe ser un número entero");
    expect(mensajeError).toBeInTheDocument();

    act(() => {
      fireEvent.change(filtroDeJugadores, { target: { value: 2 } });
      fireEvent.click(screen.getByText("Filtrar"));
    });

    mensajeError = screen.queryByText("El número de jugadores debe ser un número entero");
    expect(mensajeError).not.toBeInTheDocument();
  });

  it("deberia mostrar error al escoger una cantidad de maxima de jugadores <= 0 o > 4", () => {
    const alFiltrarPorMaximoDeJugadores = jest.fn();
    render(<FiltrosDeBusqueda alFiltrarPorMaximoDeJugadores={alFiltrarPorMaximoDeJugadores} />);
    const filtroDeJugadores = screen.getByPlaceholderText(/Número de jugadores/i);

    act(() => {
      fireEvent.change(filtroDeJugadores, { target: { value: -1 } });
      fireEvent.click(screen.getByText("Filtrar"));
    });

    let mensajeError = screen.queryByText("El número de jugadores debe ser mayor a 0 y menor o igual a 4");
    expect(mensajeError).toBeInTheDocument();

    act(() => {
      fireEvent.change(filtroDeJugadores, { target: { value: 1 } });
      fireEvent.click(screen.getByText("Filtrar"));
    });

    mensajeError = screen.queryByText("El número de jugadores debe ser mayor a 0 y menor o igual a 4");
    expect(mensajeError).not.toBeInTheDocument();

    act(() => {
      fireEvent.change(filtroDeJugadores, { target: { value: 0 } });
      fireEvent.click(screen.getByText("Filtrar"));
    });

    mensajeError = screen.queryByText("El número de jugadores debe ser mayor a 0 y menor o igual a 4");
    expect(mensajeError).toBeInTheDocument();

    act(() => {
      fireEvent.change(filtroDeJugadores, { target: { value: 4 } });
      fireEvent.click(screen.getByText("Filtrar"));
    });

    mensajeError = screen.queryByText("El número de jugadores debe ser mayor a 0 y menor o igual a 4");
    expect(mensajeError).not.toBeInTheDocument();

    act(() => {
      fireEvent.change(filtroDeJugadores, { target: { value: 5 } });
      fireEvent.click(screen.getByText("Filtrar"));
    });

    mensajeError = screen.queryByText("El número de jugadores debe ser mayor a 0 y menor o igual a 4");
    expect(mensajeError).toBeInTheDocument();
  });

  it("no deberia aparecer el badge al escoger una cantidad maxima de jugadores no aceptable", () => {
    const alFiltrarPorMaximoDeJugadores = jest.fn();
    render(<FiltrosDeBusqueda alFiltrarPorMaximoDeJugadores={alFiltrarPorMaximoDeJugadores} />);
    const filtroDeJugadores = screen.getByPlaceholderText(/Número de jugadores/i);

    act(() => {
      fireEvent.change(filtroDeJugadores, { target: { value: -1 } });
      fireEvent.click(screen.getByText("Filtrar"));
    });

    const mensajeError = screen.queryByText("El número de jugadores debe ser mayor a 0 y menor o igual a 4");
    expect(mensajeError).toBeInTheDocument();

    const badge = screen.queryByText(/Máximo de jugadores: -1/i);
    expect(badge).not.toBeInTheDocument();
  });

  it("deberia eliminar el mensaje de error si se escoge una cantidad de jugadores aceptable", () => {
    const alFiltrarPorMaximoDeJugadores = jest.fn();
    render(<FiltrosDeBusqueda alFiltrarPorMaximoDeJugadores={alFiltrarPorMaximoDeJugadores} />);
    const filtroDeJugadores = screen.getByPlaceholderText(/Número de jugadores/i);

    act(() => {
      fireEvent.change(filtroDeJugadores, { target: { value: -1 } });
      fireEvent.click(screen.getByText("Filtrar"));
    });

    let mensajeError = screen.queryByText("El número de jugadores debe ser mayor a 0 y menor o igual a 4");
    expect(mensajeError).toBeInTheDocument();

    act(() => {
      fireEvent.change(filtroDeJugadores, { target: { value: 1 } });
      fireEvent.click(screen.getByText("Filtrar"));
    });

    mensajeError = screen.queryByText("El número de jugadores debe ser mayor a 0 y menor o igual a 4");
    expect(mensajeError).not.toBeInTheDocument();
  });

  it("deberia eliminar el badge al hacer click en la x y correr alFiltrarPorMaximoDeJugadores con null", () => {
    const alFiltrarPorMaximoDeJugadores = jest.fn();
    render(<FiltrosDeBusqueda alFiltrarPorMaximoDeJugadores={alFiltrarPorMaximoDeJugadores} />);
    const filtroDeJugadores = screen.getByPlaceholderText(/Número de jugadores/i);
    act(() => {
      fireEvent.change(filtroDeJugadores, { target: { value: 2 } });
      fireEvent.click(screen.getByText("Filtrar"));
    });

    let badge = screen.queryByText(/Máximo de jugadores: 2/i);
    expect(badge).toBeInTheDocument();

    act(() => {
      fireEvent.click(screen.getByText("✕"));
    });

    badge = screen.queryByText(/Máximo de jugadores: 2/i);
    expect(badge).not.toBeInTheDocument();
    expect(alFiltrarPorMaximoDeJugadores).toHaveBeenCalledWith(null);
  });
});
