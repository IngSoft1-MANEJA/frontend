import React from "react";
import { screen, render, waitFor, cleanup } from "@testing-library/react";
import { jest } from "@jest/globals";
import { InformacionTurno } from "../containers/Game/components/InformacionTurno.jsx";
import useWebSocket from "react-use-websocket";
import { WEBSOCKET_URL } from "../variablesConfiguracion";
import { Player } from "../__mocks__/InformacionTurno.mock.js";

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

  test("deberia conectarse a el websocket", () => {
    useWebSocket.mockReturnValue({
      lastJsonMessage: null,
    });
    render(<InformacionTurno {...Player}/>);
    expect(useWebSocket).toHaveBeenCalledTimes(1);
    const websocket_url = `${WEBSOCKET_URL}/1/ws/${Player.player_id}`;
    expect(useWebSocket).toHaveBeenCalledWith(
      websocket_url,
      expect.objectContaining({ share: true }),
    );
  });

  test("se muestran los turnos por pantalla", () => {
    useWebSocket.mockReturnValue({
      lastJsonMessage: { key: "GET_TURN_ORDER", payload: {
        current_turn: "Player 1"
      }},
    });
    render(<InformacionTurno {...Player}/>);
    const turnoActual = screen.getByText("Player 1");

    expect(turnoActual).toBeInTheDocument();
  });

  test("loggea un mensaje de error si el key es incorrecto", () => {
    useWebSocket.mockReturnValue({ lastJsonMessage: { key: "INVALID_KEY" } });
    console.error = jest.fn();
    render(<InformacionTurno {...Player}/>);
    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledWith(
      "key incorrecto recibido del websocket",
    );
  });

});
