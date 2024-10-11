import React from "react";
import { screen, render, waitFor, cleanup } from "@testing-library/react";
import { jest } from "@jest/globals";
import { InformacionTurno } from "../containers/Game/components/InformacionTurno.jsx";
import useWebSocket from "react-use-websocket";
import { WEBSOCKET_URL } from "../variablesConfiguracion";
import { Player } from "../__mocks__/InformacionTurno.mock.js";
import { EventoContext } from "../contexts/EventoContext.jsx";

jest.mock("react-use-websocket");

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({ match_id: 1}),
}));

describe("InformacionTurno", () => {
  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  test("se muestran los turnos por pantalla en START_MATCH", () => {
    const eventoValue = {
      ultimoEvento: { key: "START_MATCH", payload: {
        player_name: "Player 1"
      }},
    };
    render(
      <EventoContext.Provider value={eventoValue}>
        <InformacionTurno {...Player} />
      </EventoContext.Provider>
    );
    const turnoActual = screen.getByText("Player 1");

    expect(turnoActual).toBeInTheDocument();
  });

  test("se muestra el nuevo turno por pantalla en END_PLAYER_TURN", () => {
    const eventoValue = {
      ultimoEvento: { key: "END_PLAYER_TURN", payload: {
        next_player_name: "Player 1"
      }},
    };
    render(
      <EventoContext.Provider value={eventoValue}>
        <InformacionTurno {...Player} />
      </EventoContext.Provider>
    );
    const turnoActual = screen.getByText("Player 1");

    expect(turnoActual).toBeInTheDocument();
  });

  test("loggea un mensaje de error si el key es incorrecto", () => {
    const eventoValue = { ultimoEvento: { key: "INVALID_KEY" } };
    console.error = jest.fn();
    render(
      <EventoContext.Provider value={eventoValue}>
        <InformacionTurno {...Player} />
      </EventoContext.Provider>
    );
    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledWith(
      "key incorrecto recibido del websocket",
    );
  });

});
