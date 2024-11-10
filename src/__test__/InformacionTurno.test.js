import React from "react";
import { screen, render, waitFor, cleanup } from "@testing-library/react";
import { jest } from "@jest/globals";
import { InformacionTurno } from "../containers/Game/components/InformacionTurno.jsx";
import useWebSocket from "react-use-websocket";
import { WEBSOCKET_URL } from "../variablesConfiguracion";
import { Player } from "../__mocks__/InformacionTurno.mock.js";
import { EventoContext } from "../contexts/EventoContext.jsx";
import { HabilitarAccionesUsuarioProvider } from "../contexts/HabilitarAccionesUsuarioContext.jsx";
import { FigurasContext } from "../contexts/FigurasContext.jsx";

jest.mock("react-use-websocket");

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({ match_id: 1 }),
}));

const mockFiguras = {
  figuras: {
    historial: [],
    figuras_actuales: [],
    color_prohibido: "",
  },
  agregarFiguras: jest.fn(),
  deshacerFiguras: jest.fn(),
  setFiguras: jest.fn(),
};

describe("InformacionTurno", () => {
  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  test("se muestran los turnos por pantalla en GET_PLAYER_MATCH_INFO", () => {
    const eventoValue = {
      ultimoEvento: {
        key: "GET_PLAYER_MATCH_INFO",
        payload: {
          current_turn_player: "Player 1",
        },
      },
    };
    render(
      <EventoContext.Provider value={eventoValue}>
        <FigurasContext.Provider value={mockFiguras}>
          <HabilitarAccionesUsuarioProvider>
            <InformacionTurno {...Player} />
          </HabilitarAccionesUsuarioProvider>
        </FigurasContext.Provider>
      </EventoContext.Provider>,
    );
    const turnoActual = screen.getByText("Player 1");

    expect(turnoActual).toBeInTheDocument();
  });

  test("se muestra el nuevo turno por pantalla en END_PLAYER_TURN", () => {
    const eventoValue = {
      ultimoEvento: {
        key: "END_PLAYER_TURN",
        payload: {
          next_player_name: "Player 1",
        },
      },
    };
    render(
      <EventoContext.Provider value={eventoValue}>
        <HabilitarAccionesUsuarioProvider>
          <FigurasContext.Provider value={mockFiguras}>
            <InformacionTurno {...Player} />
          </FigurasContext.Provider>
        </HabilitarAccionesUsuarioProvider>
      </EventoContext.Provider>,
    );
    const turnoActual = screen.getByText("Player 1");

    expect(turnoActual).toBeInTheDocument();
  });
});
