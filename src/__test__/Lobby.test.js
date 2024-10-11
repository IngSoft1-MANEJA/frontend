import { useContext } from "react";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import Lobby from "../containers/Lobby/Lobby";
import useWebSocket from "react-use-websocket";
import * as reactRouterDom from "react-router-dom";
import { WEBSOCKET_URL } from "../variablesConfiguracion";
import {
  DatosJugadorProvider,
  DatosJugadorContext,
} from "../contexts/DatosJugadorContext";
import {
  DatosPartidaContext,
  DatosPartidaProvider,
} from "../contexts/DatosPartidaContext";
import { EventoProvider } from "../contexts/EventoContext";

jest.mock("react-use-websocket");

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({ match_id: 1, player_id: 2 }),
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
        <DatosPartidaProvider>
          <DatosJugadorProvider>
            <EventoProvider>
              <Lobby />
            </EventoProvider>
          </DatosJugadorProvider>
        </DatosPartidaProvider>
      </reactRouterDom.MemoryRouter>,
    );
    expect(useWebSocket).toHaveBeenCalledTimes(1);
    const websocket_url = `${WEBSOCKET_URL}/matches/1/ws/2`;
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
        <DatosPartidaProvider>
          <DatosJugadorProvider>
            <EventoProvider>
              <Lobby />
            </EventoProvider>
          </DatosJugadorProvider>
        </DatosPartidaProvider>
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
        <DatosPartidaProvider>
          <DatosJugadorProvider>
            <EventoProvider>
              <Lobby />
            </EventoProvider>
          </DatosJugadorProvider>
        </DatosPartidaProvider>
      </reactRouterDom.MemoryRouter>,
    );
    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledWith(
      "key incorrecto recibido del websocket",
    );
  });
  it("deberia mostrar el boton abandonar si el contexto is_owner es true", () => {
    useWebSocket.mockReturnValue({ lastJsonMessage: null });

    // Mock de useContext para DatosJugadorContext con is_owner = true
    render(
      <reactRouterDom.MemoryRouter>
        <DatosPartidaProvider>
          <DatosJugadorContext.Provider
            value={{
              datosJugador: { is_owner: true },
              setDatosJugador: jest.fn(),
            }}
          >
            <EventoProvider>
              <Lobby />
            </EventoProvider>
          </DatosJugadorContext.Provider>
        </DatosPartidaProvider>
      </reactRouterDom.MemoryRouter>,
    );
    const boton = screen.getByText("Abandonar");
    expect(boton).toBeDisabled();
  });
});
