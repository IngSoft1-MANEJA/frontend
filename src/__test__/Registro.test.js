import React from "react";
import { render, screen, act, waitFor } from "@testing-library/react";
import { Registro } from "../containers/Game/components/Registro";
import { DatosJugadorContext } from "../contexts/DatosJugadorContext";
import { DatosPartidaContext } from "../contexts/DatosPartidaContext";
import { EventoContext } from "../contexts/EventoContext";
import { WebsocketEvents } from "../services/ServicioWebsocket";
import { JugadorGanoMotivo } from "../services/ServicioPartida";
import { ServicioFigura } from "../services/ServicioFigura";

jest.mock("../services/ServicioFigura", () => ({
  ...jest.requireActual("../services/ServicioFigura"),
  cartaStringName: jest.fn().mockReturnValue("T_90"),
}));

describe("Registro Component", () => {
  const datosJugadorMock = { player_id: "1", is_owner: true };
  const datosPartidaMock = { current_player_name: "Player1" };
  const setRegistroMock = jest.fn();
  jest.useFakeTimers();
  jest.spyOn(global, "setInterval");

  const renderRegistro = (ultimoEventoMock) => {
    return render(
      <DatosJugadorContext.Provider value={{ datosJugador: datosJugadorMock }}>
        <DatosPartidaContext.Provider
          value={{ datosPartida: datosPartidaMock }}
        >
          <EventoContext.Provider value={{ ultimoEvento: ultimoEventoMock }}>
            <Registro />
          </EventoContext.Provider>
        </DatosPartidaContext.Provider>
      </DatosJugadorContext.Provider>,
    );
  };

  it("debería mostrar el mensaje de unión a la partida cuando el evento es GET_PLAYER_MATCH_INFO", async () => {
    const eventoMock = {
      key: "GET_PLAYER_MATCH_INFO",
      payload: { turn_order: 1 },
    };

    renderRegistro(eventoMock);

    act(() => {
      jest.advanceTimersByTime(150);
    });

    await waitFor(() =>
      expect(
        screen.getByText("Te has unido a la partida, tu orden de turno es: 1"),
      ).toBeInTheDocument(),
    );
  });

  it("debería mostrar el mensaje cuando el jugador recibe una carta de figura", async () => {
    const eventoMock = {
      key: "PLAYER_RECEIVE_SHAPE_CARD",
      payload: [{ player: "Player1", shape_cards: [[1, 1]] }],
    };

    renderRegistro(eventoMock);

    act(() => {
      jest.advanceTimersByTime(150);
    });

    await waitFor(() =>
      expect(
        screen.getByText(
          'El jugador "Player1" ha recibido la carta de figura "T_90".',
        ),
      ).toBeInTheDocument(),
    );
  });

  it("debería mostrar el mensaje cuando el jugador termina su turno", async () => {
    const eventoMock = {
      key: "END_PLAYER_TURN",
      payload: { current_player_name: "Player1", next_player_name: "Player2" },
    };

    renderRegistro(eventoMock);

    act(() => {
      jest.advanceTimersByTime(150);
    });

    await waitFor(() =>
      expect(
        screen.getByText('El jugador "Player1" ha terminado su turno.'),
      ).toBeInTheDocument(),
    );
    await waitFor(() =>
      expect(screen.getByText('Turno de "Player2".')).toBeInTheDocument(),
    );
  });

  it("debería mostrar el mensaje de deshacer movimiento", async () => {
    const eventoMock = {
      key: WebsocketEvents.UNDO_PARTIAL_MOVE,
      payload: {
        tiles: [
          [0, 1],
          [1, 0],
        ],
      },
    };

    renderRegistro(eventoMock);

    act(() => {
      jest.advanceTimersByTime(150);
    });

    await waitFor(() =>
      expect(
        screen.getByText('El jugador "Player1" ha deshecho un movimiento.'),
      ).toBeInTheDocument(),
    );
  });

  it("debería mostrar el mensaje de ganador si el jugador gana la partida", async () => {
    const eventoMock = {
      key: WebsocketEvents.WINNER,
      payload: { reason: JugadorGanoMotivo.NORMAL, player_id: "1" },
    };

    renderRegistro(eventoMock);

    act(() => {
      jest.advanceTimersByTime(150);
    });

    await waitFor(() =>
      expect(screen.getByText("Has ganado la partida!")).toBeInTheDocument(),
    );
  });

  it("debería mostrar el mensaje de perdedor si otro jugador gana la partida", async () => {
    const eventoMock = {
      key: WebsocketEvents.WINNER,
      payload: { reason: JugadorGanoMotivo.NORMAL, player_id: "2" },
    };

    renderRegistro(eventoMock);

    act(() => {
      jest.advanceTimersByTime(150);
    });

    await waitFor(() =>
      expect(screen.getByText("Has perdido la partida.")).toBeInTheDocument(),
    );
  });

  it("no debería añadir eventos si `ultimoEvento` es null", () => {
    renderRegistro(null);

    act(() => {
      jest.advanceTimersByTime(150);
    });

    expect(
      screen.queryByText("Te has unido a la partida"),
    ).not.toBeInTheDocument();
  });
});
