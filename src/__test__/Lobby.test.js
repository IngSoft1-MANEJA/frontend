import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import Lobby from "../containers/Lobby/Lobby";
import useWebSocket from "react-use-websocket";
import * as reactRouterDom from "react-router-dom";
import { WEBSOCKET_URL } from "../variablesConfiguracion";

jest.mock("react-use-websocket");

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({ idPartida: 1, idJugador: 2 }),
}));

afterEach(() => {
  jest.clearAllMocks();
  cleanup();
});

describe("Lobby", () => {
  it("deberia conectarse a el websocket", () => {
    useWebSocket.mockReturnValue({
      lastJsonMessage: null,
    });
    render(
      <reactRouterDom.MemoryRouter>
        <Lobby />
      </reactRouterDom.MemoryRouter>,
    );
    expect(useWebSocket).toHaveBeenCalledTimes(1);
    const websocket_url = `${WEBSOCKET_URL}/1/ws/2`;
    expect(useWebSocket).toHaveBeenCalledWith(
      websocket_url,
      expect.objectContaining({ share: true }),
    );
  });

  it("deberia mostrar una alerta cuando un jugador se une", () => {
    useWebSocket.mockReturnValue({
      lastJsonMessage: { key: "PLAYER_JOIN", payload: { name: "test" } },
    });
    const { container } = render(
      <reactRouterDom.MemoryRouter>
        <Lobby />
      </reactRouterDom.MemoryRouter>,
    );
    const alerta = screen.getByText("jugador test se ha unido.");
    expect(alerta).toBeInTheDocument();
    expect(container.getElementsByClassName("animate-shake").length).toBe(1);
  });

  it("deberia loggear un mensaje de error si el key es incorrecto", () => {
    useWebSocket.mockReturnValue({ lastJsonMessage: { key: "INVALID_KEY" } });
    console.error = jest.fn();
    render(
      <reactRouterDom.MemoryRouter>
        <Lobby />
      </reactRouterDom.MemoryRouter>,
    );
    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledWith(
      "key incorrecto recibido del websocket",
    );
  });
});
