import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useParams } from "react-router-dom";
import "@testing-library/jest-dom";
import useWebSocket from "react-use-websocket";
import { DatosJugadorContext } from "../contexts/DatosJugadorContext.jsx";
import { UsarMovimientoContext } from "../contexts/UsarMovimientoContext.jsx";
import CartasMovimiento from "../containers/Game/components/CartasMovimiento.jsx";

jest.mock("react-router-dom", () => ({
  useParams: jest.fn(),
}));

jest.mock('react-use-websocket');

describe("CartasMovimiento", () => {
  const mockUsarMovimiento = {
    usarMovimiento: {
      cartaHovering: false,
      fichaHovering: false,
      cartaSeleccionada: null,
      fichasSeleccionadas: [],
      highlightCarta: { state: false, key: '' },
      cartasUsadas: [] 
    },
    setUsarMovimiento: jest.fn(),
  }

  beforeEach(() => {
    useParams.mockReturnValue({ match_id: "1" });

    useWebSocket.mockReturnValue({
      lastJsonMessage: {
        key: "GET_MOVEMENT_CARD",
        payload: {
          movement_card: [
            { id: 1, type: "DIAGONAL" },
            { id: 2, type: "INVERSE_DIAGONAL" },
            { id: 3, type: "LINE" },
          ],
        },
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Debe renderizar correctamente las cartas del jugador cuando recibe el mensaje GET_MOVEMENT_CARD", () => {
    const mockDatosJugador = {
      datosJugador: { player_id: "123" },
      setDatosJugador: jest.fn(),
    };

    render(
      <UsarMovimientoContext.Provider value={mockUsarMovimiento}>
        <DatosJugadorContext.Provider value={mockDatosJugador}>
          <CartasMovimiento />
        </DatosJugadorContext.Provider>,
      </UsarMovimientoContext.Provider>
    );

    expect(screen.getByAltText("DIAGONAL")).toBeInTheDocument();
    expect(screen.getByAltText("INVERSE_DIAGONAL")).toBeInTheDocument();
    expect(screen.getByAltText("LINE")).toBeInTheDocument();
  });

  test("Debe mostrar un mensaje de error cuando el WebSocket recibe un key incorrecto", () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    useWebSocket.mockReturnValue({
      lastJsonMessage: {
        key: "INVALID_KEY",
        payload: [],
      },
    });

    const mockDatosJugador = {
      datosJugador: { player_id: "123" },
      setDatosJugador: jest.fn(),
    };

    render(
      <UsarMovimientoContext.Provider value={mockUsarMovimiento}>
        <DatosJugadorContext.Provider value={mockDatosJugador}>
          <CartasMovimiento />
        </DatosJugadorContext.Provider>,
      </UsarMovimientoContext.Provider>
    );

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "key incorrecto recibido del websocket",
    );

    consoleErrorSpy.mockRestore();
  });

  test("No debe renderizar cartas si no hay mensajes del WebSocket", () => {
    useWebSocket.mockReturnValue({
      lastJsonMessage: null,
    });

    const mockDatosJugador = {
      datosJugador: { player_id: "123" },
      setDatosJugador: jest.fn(),
    };

    render(
      <UsarMovimientoContext.Provider value={mockUsarMovimiento}>
        <DatosJugadorContext.Provider value={mockDatosJugador}>
          <CartasMovimiento />
        </DatosJugadorContext.Provider>,
      </UsarMovimientoContext.Provider>
    );

    expect(screen.queryByAltText("DIAGONAL")).not.toBeInTheDocument();
    expect(screen.queryByAltText("INVERSE_DIAGONAL")).not.toBeInTheDocument();
    expect(screen.queryByAltText("LINE")).not.toBeInTheDocument();
  });

  test("Debe permitir seleccionar una carta al hacer click si no ha sido usada", () => {
    const mockDatosJugador = {
      datosJugador: { player_id: "123" },
      setDatosJugador: jest.fn(),
    };
  
    render(
      <UsarMovimientoContext.Provider value={mockUsarMovimiento}>
        <DatosJugadorContext.Provider value={mockDatosJugador}>
          <CartasMovimiento />
        </DatosJugadorContext.Provider>,
      </UsarMovimientoContext.Provider>
    );
  
    const carta = screen.getByAltText("DIAGONAL");
    fireEvent.click(carta);
  
    expect(mockUsarMovimiento.setUsarMovimiento).toHaveBeenCalledWith({
      ...mockUsarMovimiento.usarMovimiento,
      cartaSeleccionada: "DIAGONAL",
      highlightCarta: { state: true, key: 0 },
    });
  });

  test("Debe deseleccionar una carta si ya está seleccionada al hacer click nuevamente", () => {
    const mockUsarMovimientoSeleccionado = {
      usarMovimiento: {
        ...mockUsarMovimiento.usarMovimiento,
        cartaSeleccionada: "DIAGONAL",
        highlightCarta: { state: true, key: 0 },
      },
      setUsarMovimiento: jest.fn(),
    };
  
    const mockDatosJugador = {
      datosJugador: { player_id: "123" },
      setDatosJugador: jest.fn(),
    };
  
    render(
      <UsarMovimientoContext.Provider value={mockUsarMovimientoSeleccionado}>
        <DatosJugadorContext.Provider value={mockDatosJugador}>
          <CartasMovimiento />
        </DatosJugadorContext.Provider>,
      </UsarMovimientoContext.Provider>
    );
  
    const carta = screen.getByAltText("DIAGONAL");
    fireEvent.click(carta);
  
    expect(mockUsarMovimientoSeleccionado.setUsarMovimiento).toHaveBeenCalledWith({
      ...mockUsarMovimientoSeleccionado.usarMovimiento,
      cartaSeleccionada: null,
      fichasSeleccionadas: [],
      highlightCarta: { state: false, key: null },
    });
  });

  test("No debe permitir seleccionar una carta que ya ha sido usada", () => {
    const mockUsarMovimientoConCartaUsada = {
      usarMovimiento: {
        ...mockUsarMovimiento.usarMovimiento,
        cartasUsadas: ["DIAGONAL"],
      },
      setUsarMovimiento: jest.fn(),
    };
  
    const mockDatosJugador = {
      datosJugador: { player_id: "123" },
      setDatosJugador: jest.fn(),
    };
  
    render(
      <UsarMovimientoContext.Provider value={mockUsarMovimientoConCartaUsada}>
        <DatosJugadorContext.Provider value={mockDatosJugador}>
          <CartasMovimiento />
        </DatosJugadorContext.Provider>,
      </UsarMovimientoContext.Provider>
    );
  
    const carta = screen.getByAltText("DIAGONAL");
    fireEvent.click(carta);
  
    expect(mockUsarMovimientoConCartaUsada.setUsarMovimiento).not.toHaveBeenCalled();
  });

  test("Debe aplicar effecto de hover correctamente al pasar el mouse sobre una carta", () => {
    const mockDatosJugador = {
      datosJugador: { player_id: "123" },
      setDatosJugador: jest.fn(),
    };
  
    render(
      <UsarMovimientoContext.Provider value={mockUsarMovimiento}>
        <DatosJugadorContext.Provider value={mockDatosJugador}>
          <CartasMovimiento />
        </DatosJugadorContext.Provider>,
      </UsarMovimientoContext.Provider>
    );
  
    const carta = screen.getByAltText("DIAGONAL");
    fireEvent.mouseEnter(carta);
  
    expect(mockUsarMovimiento.setUsarMovimiento).toHaveBeenCalledWith({
      ...mockUsarMovimiento.usarMovimiento,
      cartaHovering: true,
    });
  
    fireEvent.mouseLeave(carta);
  
    expect(mockUsarMovimiento.setUsarMovimiento).toHaveBeenCalledWith({
      ...mockUsarMovimiento.usarMovimiento,
      cartaHovering: false,
    });
  });
});
