import React from "react";
import { render, screen } from "@testing-library/react";
import { useParams } from "react-router-dom";
import { useWebSocket } from "react-use-websocket";
import { DatosJugadorContext } from "../contexts/DatosJugadorContext.jsx";
import { CartasFiguras } from "../containers/Game/components/CartasFiguras.jsx";
import { EventoContext } from "../contexts/EventoContext.jsx";

jest.mock("react-router-dom", () => ({
  useParams: jest.fn(),
}));

jest.mock("react-use-websocket", () => ({
  useWebSocket: jest.fn(),
}));

describe("CartasFiguras", () => {
  beforeEach(() => {
    useParams.mockReturnValue({ match_id: "1" });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Debe renderizar correctamente las cartas del jugador cuando recibe el mensaje PLAYER_RECIEVE_ALL_SHAPES", () => {
    const mockDatosJugador = {
      datosJugador: { player_id: "123" },
      setDatosJugador: jest.fn(),
    };

    const mockInfoJugador = {
      ultimoEvento: {
        key: "GET_PLAYER_MATCH_INFO",
        payload: { turn_order: 1 },
      },
    };

    const mockEvento = {
      ultimoEvento: {
        key: "PLAYER_RECIEVE_ALL_SHAPES",
        payload: [{
          turn_order: 1,
          shape_cards: [
            [1, 1 ],
            [2, 2 ],
            [3, 3 ],
          ],
        }],
      },
    };

    const { rerender } = render(
      <DatosJugadorContext.Provider value={mockDatosJugador}>
        <EventoContext.Provider value={mockInfoJugador}>
          <CartasFiguras />
        </EventoContext.Provider>
      </DatosJugadorContext.Provider>,
    );

    rerender(
      <DatosJugadorContext.Provider value={mockDatosJugador}>
        <EventoContext.Provider value={mockEvento}>
          <CartasFiguras />
        </EventoContext.Provider>
      </DatosJugadorContext.Provider>,
    );

    expect(screen.getByAltText("1")).toBeInTheDocument();
    expect(screen.getByAltText("2")).toBeInTheDocument();
    expect(screen.getByAltText("3")).toBeInTheDocument();
  });

  test("No debe renderizar cartas si no hay mensajes del WebSocket", () => {
    const eventoValue = { ultimoEvento: null };

    const mockDatosJugador = {
      datosJugador: { player_id: "123" },
      setDatosJugador: jest.fn(),
    };

    render(
      <DatosJugadorContext.Provider value={mockDatosJugador}>
        <EventoContext.Provider value={eventoValue}>
          <CartasFiguras />
        </EventoContext.Provider>
      </DatosJugadorContext.Provider>,
    );

    expect(screen.queryByAltText("1")).not.toBeInTheDocument();
    expect(screen.queryByAltText("2")).not.toBeInTheDocument();
    expect(screen.queryByAltText("3")).not.toBeInTheDocument();
  });
});
