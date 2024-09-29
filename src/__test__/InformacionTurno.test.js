import React from "react";
import { screen, render, waitFor, cleanup } from "@testing-library/react";
import { jest } from "@jest/globals";
import { InformacionTurno } from "../containers/App/components/Game/InformacionTurno.jsx";
import useWebSocket from "react-use-websocket";
import { WEBSOCKET_URL } from "../variablesConfiguracion";

jest.mock("react-use-websocket");

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({ match_id: 1, player_id: 1 }),
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
    render(<InformacionTurno />);
    expect(useWebSocket).toHaveBeenCalledTimes(1);
    const websocket_url = `${WEBSOCKET_URL}/1/ws/1`;
    expect(useWebSocket).toHaveBeenCalledWith(
      websocket_url,
      expect.objectContaining({ share: true }),
    );
  });

  test("se muestran los turnos por pantalla", () => {
    useWebSocket.mockReturnValue({
      lastJsonMessage: { key: "GET_TURN_ORDER", payload: {
        current_turn: "Player 1",
        next_turn: "Player 2",
      }},
    });
    render(<InformacionTurno />);
    const turnoActual = screen.getByText("Player 1");
    const turnoSiguiente = screen.getByText("Player 2");

    expect(turnoActual).toBeInTheDocument();
    expect(turnoSiguiente).toBeInTheDocument();
  });

  test("loggea un mensaje de error si el key es incorrecto", () => {
    useWebSocket.mockReturnValue({ lastJsonMessage: { key: "INVALID_KEY" } });
    console.error = jest.fn();
    render(<InformacionTurno />);
    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledWith(
      "key incorrecto recibido del websocket",
    );
  });

});
