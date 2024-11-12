import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import * as reactRouterDom from "react-router-dom";
import useWebSocket from "react-use-websocket";
import "@testing-library/jest-dom";
import { TerminarTurno } from "../containers/Game/components/TerminarTurno";
import { DatosJugadorContext } from "../contexts/DatosJugadorContext";
import { DatosPartidaProvider } from "../contexts/DatosPartidaContext";
import { UsarMovimientoContext } from "../contexts/UsarMovimientoContext";
import { EventoContext, EventoProvider } from "../contexts/EventoContext";
import { ServicioPartida } from "../services/ServicioPartida";
import {
  HabilitarAccionesUsuarioContext,
  HabilitarAccionesUsuarioProvider,
} from "../contexts/HabilitarAccionesUsuarioContext";

jest.mock("react-use-websocket");
jest.mock("../services/ServicioPartida");

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({ match_id: 1 }),
}));

describe("TerminarTurno Component", () => {
  const mockUsarMovimiento = {
    usarMovimiento: {
      cartaSeleccionada: "test",
      fichasSeleccionadas: [],
      cartasUsadas: [],
      highlightCarta: { state: false, key: "" },
      movimientosPosibles: [],
    },
    setUsarMovimiento: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renderiza componente", () => {
    render(
      <reactRouterDom.MemoryRouter>
        <DatosPartidaProvider>
          <DatosJugadorContext.Provider
            value={{
              datosJugador: { player_id: 123, player_turn: 1 },
              setDatosJugador: jest.fn(),
            }}
          >
            <EventoProvider>
              <UsarMovimientoContext.Provider value={mockUsarMovimiento}>
                <HabilitarAccionesUsuarioProvider>
                  <TerminarTurno />
                </HabilitarAccionesUsuarioProvider>
              </UsarMovimientoContext.Provider>
            </EventoProvider>
          </DatosJugadorContext.Provider>
        </DatosPartidaProvider>
      </reactRouterDom.MemoryRouter>,
    );

    expect(screen.getByText("Terminar turno")).toBeInTheDocument();
  });

  test("boton desabilitado en START_MATCH si el turno no es del jugador", () => {
    const datosJugadorValue = {
      datosJugador: { player_id: 123, player_turn: 1 },
      setDatosJugador: jest.fn(),
    };
    const ultimoEventoValue = {
      ultimoEvento: {
        key: "START_MATCH",
        payload: { player_name: "Player 2", turn_order: 2 },
      },
    };
    render(
      <reactRouterDom.MemoryRouter>
        <DatosPartidaProvider>
          <DatosJugadorContext.Provider value={datosJugadorValue}>
            <EventoContext.Provider value={ultimoEventoValue}>
              <UsarMovimientoContext.Provider value={mockUsarMovimiento}>
                <HabilitarAccionesUsuarioProvider>
                  <TerminarTurno />
                </HabilitarAccionesUsuarioProvider>
              </UsarMovimientoContext.Provider>
            </EventoContext.Provider>
          </DatosJugadorContext.Provider>
        </DatosPartidaProvider>
      </reactRouterDom.MemoryRouter>,
    );

    const button = screen.getByText("Terminar turno");
    expect(button).toBeDisabled();
  });

  test("habilita boton en GET_PLAYER_MATCH_INFO si es el turno del jugador", async () => {
    const eventoValue = {
      ultimoEvento: {
        key: "GET_PLAYER_MATCH_INFO",
        payload: {
          current_turn_player: "Player 1",
          current_turn_order: 1,
          turn_order: 1,
          last_movements: [],
        },
      },
    };

    const datosJugadorValue = {
      datosJugador: { player_id: 123, player_turn: 1 },
      setDatosJugador: jest.fn(),
    };

    render(
      <reactRouterDom.MemoryRouter>
        <DatosPartidaProvider>
          <DatosJugadorContext.Provider value={datosJugadorValue}>
            <EventoContext.Provider value={eventoValue}>
              <UsarMovimientoContext.Provider value={mockUsarMovimiento}>
                <HabilitarAccionesUsuarioProvider>
                  <TerminarTurno />
                </HabilitarAccionesUsuarioProvider>
              </UsarMovimientoContext.Provider>
            </EventoContext.Provider>
          </DatosJugadorContext.Provider>
        </DatosPartidaProvider>
      </reactRouterDom.MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Terminar turno")).not.toBeDisabled();
    });
  });

  test("boton desabilitado si el turno no es del jugador", () => {
    const eventoValue = {
      ultimoEvento: {
        key: "END_PLAYER_TURN",
        payload: {
          current_player_name: "Player 2",
          next_player_name: "Player 3",
          next_player_turn: 3,
        },
      },
    };
    const datosJugadorValue = {
      datosJugador: { player_id: 123, player_turn: 1 },
      setDatosJugador: jest.fn(),
    };
    render(
      <reactRouterDom.MemoryRouter>
        <DatosPartidaProvider>
          <DatosJugadorContext.Provider value={datosJugadorValue}>
            <EventoContext.Provider value={eventoValue}>
              <UsarMovimientoContext.Provider value={mockUsarMovimiento}>
                <HabilitarAccionesUsuarioProvider>
                  <TerminarTurno />
                </HabilitarAccionesUsuarioProvider>
              </UsarMovimientoContext.Provider>
            </EventoContext.Provider>
          </DatosJugadorContext.Provider>
        </DatosPartidaProvider>
      </reactRouterDom.MemoryRouter>,
    );

    const button = screen.getByText("Terminar turno");
    expect(button).toBeDisabled();
  });

  test("habilita boton en turno de jugador", async () => {
    const eventoValue = {
      ultimoEvento: {
        key: "END_PLAYER_TURN",
        payload: {
          current_player_name: "Player 4",
          next_player_name: "Player 1",
          next_player_turn: 1,
        },
      },
    };

    const datosJugadorValue = {
      datosJugador: { player_id: 123, player_turn: 1 },
      setDatosJugador: jest.fn(),
    };

    render(
      <reactRouterDom.MemoryRouter>
        <DatosPartidaProvider>
          <DatosJugadorContext.Provider value={datosJugadorValue}>
            <EventoContext.Provider value={eventoValue}>
              <UsarMovimientoContext.Provider value={mockUsarMovimiento}>
                <HabilitarAccionesUsuarioProvider>
                  <TerminarTurno />
                </HabilitarAccionesUsuarioProvider>
              </UsarMovimientoContext.Provider>
            </EventoContext.Provider>
          </DatosJugadorContext.Provider>
        </DatosPartidaProvider>
      </reactRouterDom.MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Terminar turno")).not.toBeDisabled();
    });
  });

  test("muestra alerta en mensaje GET_PLAYER_MATCH_INFO", async () => {
    const eventoValue = {
      ultimoEvento: {
        key: "GET_PLAYER_MATCH_INFO",
        payload: {
          current_turn_player: "Player 1",
          turn_order: 1,
        },
      },
    };
    render(
      <reactRouterDom.MemoryRouter>
        <DatosPartidaProvider>
          <DatosJugadorContext.Provider
            value={{
              datosJugador: { player_id: 123, player_turn: 1 },
              setDatosJugador: jest.fn(),
            }}
          >
            <EventoContext.Provider value={eventoValue}>
              <UsarMovimientoContext.Provider value={mockUsarMovimiento}>
                <HabilitarAccionesUsuarioProvider>
                  <TerminarTurno />
                </HabilitarAccionesUsuarioProvider>
              </UsarMovimientoContext.Provider>
            </EventoContext.Provider>
          </DatosJugadorContext.Provider>
        </DatosPartidaProvider>
      </reactRouterDom.MemoryRouter>,
    );

    const alerta = screen.getByText("Turno de Player 1.");
    expect(alerta).toBeInTheDocument();
  });

  test("muestra alerta en mensaje END_PLAYER_TURN", async () => {
    const eventoValue = {
      ultimoEvento: {
        key: "END_PLAYER_TURN",
        payload: {
          current_player_name: "Player 1",
          next_player_name: "Player 2",
          next_player_turn: 2,
        },
      },
    };
    render(
      <reactRouterDom.MemoryRouter>
        <DatosPartidaProvider>
          <DatosJugadorContext.Provider
            value={{
              datosJugador: { player_id: 123, player_turn: 1 },
              setDatosJugador: jest.fn(),
            }}
          >
            <EventoContext.Provider value={eventoValue}>
              <UsarMovimientoContext.Provider value={mockUsarMovimiento}>
                <HabilitarAccionesUsuarioProvider>
                  <TerminarTurno />
                </HabilitarAccionesUsuarioProvider>
              </UsarMovimientoContext.Provider>
            </EventoContext.Provider>
          </DatosJugadorContext.Provider>
        </DatosPartidaProvider>
      </reactRouterDom.MemoryRouter>,
    );
    setTimeout(() => {
      const alerta = screen.getByText("Player 1 ha terminado su turno.");
      expect(alerta).toBeInTheDocument();
    }, 1500);

    const alerta2 = screen.getByText("Turno de Player 2.");
    expect(alerta2).toBeInTheDocument();
  });

  test("llama a terminar turno cuando el boton es clickeado", async () => {
    const eventoValue = {
      ultimoEvento: {
        key: "END_PLAYER_TURN",
        payload: {
          current_player_name: "Player 3",
          next_player_name: "Player 1",
          next_player_turn: 1,
        },
      },
    };

    render(
      <reactRouterDom.MemoryRouter>
        <DatosPartidaProvider>
          <DatosJugadorContext.Provider
            value={{
              datosJugador: { player_id: 123, player_turn: 1 },
              setDatosJugador: jest.fn(),
            }}
          >
            <EventoContext.Provider value={eventoValue}>
              <UsarMovimientoContext.Provider value={mockUsarMovimiento}>
                <HabilitarAccionesUsuarioProvider>
                  <TerminarTurno />
                </HabilitarAccionesUsuarioProvider>
              </UsarMovimientoContext.Provider>
            </EventoContext.Provider>
          </DatosJugadorContext.Provider>
        </DatosPartidaProvider>
      </reactRouterDom.MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Terminar turno")).not.toBeDisabled();
    });

    const button = screen.getByText("Terminar turno");
    fireEvent.click(button);

    expect(ServicioPartida.terminarTurno).toHaveBeenCalledWith(1, 123);
  });

  test("se llama a setHabilitarAccionesUsuario en false cuando llega END_PLAYER_TURN y no sea el turno del jugador", async () => {
    const eventoValue = {
      ultimoEvento: {
        key: "END_PLAYER_TURN",
        payload: {
          current_player_name: "Player 1",
          next_player_name: "Player 2",
          next_player_turn: 2,
        },
      },
    };
    const mockSetHabilitarAccionesUsuario = jest.fn();
    render(
      <reactRouterDom.MemoryRouter>
        <DatosPartidaProvider>
          <DatosJugadorContext.Provider
            value={{
              datosJugador: { player_id: 123, player_turn: 1 },
              setDatosJugador: jest.fn(),
            }}
          >
            <EventoContext.Provider value={eventoValue}>
              <UsarMovimientoContext.Provider value={mockUsarMovimiento}>
                <HabilitarAccionesUsuarioContext.Provider
                  value={{
                    setHabilitarAccionesUsuario:
                      mockSetHabilitarAccionesUsuario,
                  }}
                >
                  <TerminarTurno />
                </HabilitarAccionesUsuarioContext.Provider>
              </UsarMovimientoContext.Provider>
            </EventoContext.Provider>
          </DatosJugadorContext.Provider>
        </DatosPartidaProvider>
      </reactRouterDom.MemoryRouter>,
    );

    expect(mockSetHabilitarAccionesUsuario).toHaveBeenCalledWith(false);
  });

  test("se llama a setHabilitarAccionesUsuario en true cuando llega END_PLAYER_TURN y no sea el turno del jugador", async () => {
    const eventoValue = {
      ultimoEvento: {
        key: "END_PLAYER_TURN",
        payload: {
          current_player_name: "Player 1",
          next_player_name: "Player 2",
          next_player_turn: 2,
        },
      },
    };
    const mockSetHabilitarAccionesUsuario = jest.fn();
    render(
      <reactRouterDom.MemoryRouter>
        <DatosPartidaProvider>
          <DatosJugadorContext.Provider
            value={{
              datosJugador: { player_id: 123, player_turn: 2 },
              setDatosJugador: jest.fn(),
            }}
          >
            <EventoContext.Provider value={eventoValue}>
              <UsarMovimientoContext.Provider value={mockUsarMovimiento}>
                <HabilitarAccionesUsuarioContext.Provider
                  value={{
                    setHabilitarAccionesUsuario:
                      mockSetHabilitarAccionesUsuario,
                  }}
                >
                  <TerminarTurno />
                </HabilitarAccionesUsuarioContext.Provider>
              </UsarMovimientoContext.Provider>
            </EventoContext.Provider>
          </DatosJugadorContext.Provider>
        </DatosPartidaProvider>
      </reactRouterDom.MemoryRouter>,
    );

    expect(mockSetHabilitarAccionesUsuario).toHaveBeenCalledWith(true);
  });
});
