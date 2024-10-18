import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useParams } from "react-router-dom";
import "@testing-library/jest-dom";
import useWebSocket from "react-use-websocket";
import { DatosJugadorContext } from "../contexts/DatosJugadorContext.jsx";
import { UsarMovimientoContext } from "../contexts/UsarMovimientoContext.jsx";
import CartasMovimiento from "../containers/Game/components/CartasMovimiento.jsx";
import { EventoContext } from "../contexts/EventoContext.jsx";

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
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Debe renderizar correctamente las cartas del jugador cuando recibe el mensaje GET_MOVEMENT_CARD", () => {
    const mockDatosJugador = {
      datosJugador: { player_id: "123", is_player_turn: true },
      setDatosJugador: jest.fn(),
    };

    const eventoValue = {
      ultimoEvento: {
        key: "GET_MOVEMENT_CARD",
        payload: {
          movement_card: [
            [1, "Diagonal"],
            [2, "Inverse L"],
            [3, "Line"],
          ],
        },
      },
    };

    render(
      <UsarMovimientoContext.Provider value={mockUsarMovimiento}>
        <DatosJugadorContext.Provider value={mockDatosJugador}>
            <EventoContext.Provider value={eventoValue}>
              <CartasMovimiento />
            </EventoContext.Provider>
        </DatosJugadorContext.Provider>
      </UsarMovimientoContext.Provider>,
    );

    expect(screen.getByAltText("Diagonal")).toBeInTheDocument();
    expect(screen.getByAltText("Inverse L")).toBeInTheDocument();
    expect(screen.getByAltText("Line")).toBeInTheDocument();
  });

  test("No debe renderizar cartas si no hay mensajes del WebSocket", () => {
    const eventoValue = {
      ultimoEvento: null,
    };

    const mockDatosJugador = {
      datosJugador: { player_id: "123", is_player_turn: true },
      setDatosJugador: jest.fn(),
    };

    render(
      <UsarMovimientoContext.Provider value={mockUsarMovimiento}>
        <DatosJugadorContext.Provider value={mockDatosJugador}>
          <EventoContext.Provider value={eventoValue}>
            <CartasMovimiento />
          </EventoContext.Provider>
        </DatosJugadorContext.Provider>
      </UsarMovimientoContext.Provider>,
    );

    expect(screen.queryByAltText("Diagonal")).not.toBeInTheDocument();
    expect(screen.queryByAltText("Inverse L")).not.toBeInTheDocument();
    expect(screen.queryByAltText("Line")).not.toBeInTheDocument();
  });
});
