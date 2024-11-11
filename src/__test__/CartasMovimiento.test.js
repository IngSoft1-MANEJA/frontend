import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { useParams } from "react-router-dom";
import "@testing-library/jest-dom";
import { DatosJugadorContext } from "../contexts/DatosJugadorContext.jsx";
import { UsarMovimientoContext } from "../contexts/UsarMovimientoContext.jsx";
import CartasMovimiento from "../containers/Game/components/CartasMovimiento.jsx";
import { EventoContext } from "../contexts/EventoContext.jsx";
import { CompletarFiguraProvider } from "../contexts/CompletarFiguraContext.jsx";
import {
  HabilitarAccionesUsuarioContext,
  HabilitarAccionesUsuarioProvider,
} from "../contexts/HabilitarAccionesUsuarioContext.jsx";

jest.mock("react-router-dom", () => ({
  useParams: jest.fn(),
}));

jest.mock("react-use-websocket");

describe("CartasMovimiento", () => {
  const mockUsarMovimiento = {
    usarMovimiento: {
      cartaHovering: false,
      fichaHovering: false,
      cartaSeleccionada: null,
      fichasSeleccionadas: [],
      highlightCarta: { state: false, key: "" },
      cartasUsadas: [],
    },
    setUsarMovimiento: jest.fn(),
  };

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
            <CompletarFiguraProvider>
              <HabilitarAccionesUsuarioProvider>
                <CartasMovimiento />
              </HabilitarAccionesUsuarioProvider>
            </CompletarFiguraProvider>
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
            <CompletarFiguraProvider>
              <HabilitarAccionesUsuarioProvider>
                <CartasMovimiento />
              </HabilitarAccionesUsuarioProvider>
            </CompletarFiguraProvider>
          </EventoContext.Provider>
        </DatosJugadorContext.Provider>
      </UsarMovimientoContext.Provider>,
    );

    expect(screen.queryByAltText("Diagonal")).not.toBeInTheDocument();
    expect(screen.queryByAltText("Inverse L")).not.toBeInTheDocument();
    expect(screen.queryByAltText("Line")).not.toBeInTheDocument();
  });

  test("Al clickear una carta la agrega a cartas seleccionadas", async () => {
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

    const mockDatosJugador = {
      datosJugador: { player_id: "123", is_player_turn: true },
      setDatosJugador: jest.fn(),
    };

    render(
      <UsarMovimientoContext.Provider value={mockUsarMovimiento}>
        <DatosJugadorContext.Provider value={mockDatosJugador}>
          <EventoContext.Provider value={eventoValue}>
            <CompletarFiguraProvider>
              <HabilitarAccionesUsuarioProvider>
                <CartasMovimiento />
              </HabilitarAccionesUsuarioProvider>
            </CompletarFiguraProvider>
          </EventoContext.Provider>
        </DatosJugadorContext.Provider>
      </UsarMovimientoContext.Provider>,
    );

    const cartaDiagonal = screen.getByAltText("Diagonal");
    fireEvent.click(cartaDiagonal);

    expect(mockUsarMovimiento.setUsarMovimiento).toHaveBeenCalledWith({
      ...mockUsarMovimiento.usarMovimiento,
      cartaSeleccionada: [1, "Diagonal"],
      highlightCarta: { state: true, key: 0 },
    });
  });

  test("Si existen cartas usadas, se reparten nuevas cartas en mensaje GET_MOVEMENT_CARD", async () => {
    const eventoValueRepuesto = {
      ultimoEvento: {
        key: "GET_MOVEMENT_CARD",
        payload: {
          movement_card: [
            [4, "L"],
            [5, "Line Border"],
          ],
        },
      },
    };

    const mockUsarMovimientoUsados = {
      usarMovimiento: {
        cartaHovering: false,
        fichaHovering: false,
        cartaSeleccionada: null,
        fichasSeleccionadas: [],
        highlightCarta: { state: false, key: "" },
        cartasUsadas: [
          [1, "Diagonal"],
          [3, "Line"],
        ],
      },
      setUsarMovimiento: jest.fn(),
    };

    const mockDatosJugador = {
      datosJugador: { player_id: "123", is_player_turn: true },
      setDatosJugador: jest.fn(),
    };

    render(
      <UsarMovimientoContext.Provider value={mockUsarMovimientoUsados}>
        <DatosJugadorContext.Provider value={mockDatosJugador}>
          <EventoContext.Provider value={eventoValueRepuesto}>
            <CompletarFiguraProvider>
              <HabilitarAccionesUsuarioProvider>
                <CartasMovimiento />
              </HabilitarAccionesUsuarioProvider>
            </CompletarFiguraProvider>
          </EventoContext.Provider>
        </DatosJugadorContext.Provider>
      </UsarMovimientoContext.Provider>,
    );

    expect(screen.getByAltText("L")).toBeInTheDocument();
    expect(screen.getByAltText("Line Border")).toBeInTheDocument();
    expect(screen.queryByAltText("Diagonal")).not.toBeInTheDocument();
    expect(screen.queryByAltText("Line")).not.toBeInTheDocument();
  });

  test("Al clickear una carta no ocurre nada si habilitarAccionesUsuario es false", async () => {
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

    const mockDatosJugador = {
      datosJugador: { player_id: "123", is_player_turn: true },
      setDatosJugador: jest.fn(),
    };

    render(
      <UsarMovimientoContext.Provider value={mockUsarMovimiento}>
        <DatosJugadorContext.Provider value={mockDatosJugador}>
          <EventoContext.Provider value={eventoValue}>
            <CompletarFiguraProvider>
              <HabilitarAccionesUsuarioContext.Provider
                value={{ habilitarAccionesUsuario: false }}
              >
                <CartasMovimiento />
              </HabilitarAccionesUsuarioContext.Provider>
            </CompletarFiguraProvider>
          </EventoContext.Provider>
        </DatosJugadorContext.Provider>
      </UsarMovimientoContext.Provider>,
    );

    const cartaDiagonal = screen.getByAltText("Diagonal");
    fireEvent.click(cartaDiagonal);

    expect(mockUsarMovimiento.setUsarMovimiento).not.toHaveBeenCalled();
  });
});
