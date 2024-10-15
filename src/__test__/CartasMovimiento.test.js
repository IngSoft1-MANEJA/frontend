import React from "react";
import { render, screen } from "@testing-library/react";
import { useParams } from "react-router-dom";
import { useWebSocket } from "react-use-websocket";
import { DatosJugadorContext } from "../contexts/DatosJugadorContext.jsx";
import CartasMovimiento from "../containers/Game/components/CartasMovimiento.jsx";
import { EventoContext } from "../contexts/EventoContext.jsx";

jest.mock("react-router-dom", () => ({
  useParams: jest.fn(),
}));

jest.mock("react-use-websocket", () => ({
  useWebSocket: jest.fn(),
}));

describe("CartasMovimiento", () => {
  beforeEach(() => {
    useParams.mockReturnValue({ match_id: "1" });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Debe renderizar correctamente las cartas del jugador cuando recibe el mensaje GET_MOVEMENT_CARD", () => {
    const mockDatosJugador = {
      datosJugador: { player_id: "123" },
      setDatosJugador: jest.fn(),
    };

    const eventoValue = {
      ultimoEvento: {
        key: "GET_MOVEMENT_CARD",
        payload: {
          movement_card: [
            { id: 1, type: "DIAGONAL" },
            { id: 2, type: "INVERSE_DIAGONAL" },
            { id: 3, type: "LINE" },
          ],
        },
      },
    };

    render(
      <DatosJugadorContext.Provider value={mockDatosJugador}>
        <EventoContext.Provider value={eventoValue}>
          <CartasMovimiento />
        </EventoContext.Provider>
      </DatosJugadorContext.Provider>,
    );

    expect(screen.getByAltText("DIAGONAL")).toBeInTheDocument();
    expect(screen.getByAltText("INVERSE_DIAGONAL")).toBeInTheDocument();
    expect(screen.getByAltText("LINE")).toBeInTheDocument();
  });

  test("No debe renderizar cartas si no hay mensajes del WebSocket", () => {
    const eventoValue = {
      ultimoEvento: null,
    };

    const mockDatosJugador = {
      datosJugador: { player_id: "123" },
      setDatosJugador: jest.fn(),
    };

    render(
      <DatosJugadorContext.Provider value={mockDatosJugador}>
        <EventoContext.Provider value={eventoValue}>
          <CartasMovimiento />
        </EventoContext.Provider>
      </DatosJugadorContext.Provider>,
    );

    expect(screen.queryByAltText("DIAGONAL")).not.toBeInTheDocument();
    expect(screen.queryByAltText("INVERSE_DIAGONAL")).not.toBeInTheDocument();
    expect(screen.queryByAltText("LINE")).not.toBeInTheDocument();
  });
});
