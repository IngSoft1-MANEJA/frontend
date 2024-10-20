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
import { act } from 'react'; // Importa 'act' para controlar los efectos.
import { waitFor } from "@testing-library/react";

jest.mock("react-use-websocket");

jest.spyOn(reactRouterDom, "useNavigate").mockReturnValue(jest.fn());

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

  it("debería mostrar el modal cuando el dueño cancela la partida", () => {
    useWebSocket.mockReturnValue({
      lastJsonMessage: { key: "PLAYER_LEFT", payload: { name: "test", is_owner: true } },
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
      </reactRouterDom.MemoryRouter>
    );
  
    const modalTexto = screen.getByText("El dueño de la sala ha cancelado la partida.");
    expect(modalTexto).toBeInTheDocument();
  });
});
