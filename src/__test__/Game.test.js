import {
  cleanup,
  fireEvent,
  screen,
  render,
  act,
} from "@testing-library/react";
import {
  DatosJugadorContext,
  DatosJugadorProvider,
} from "../contexts/DatosJugadorContext";
import {
  DatosPartidaContext,
  DatosPartidaProvider,
} from "../contexts/DatosPartidaContext";
import Game from "../containers/Game/Game";
import { MemoryRouter } from "react-router-dom";
import { EventoProvider } from "../contexts/EventoContext";
import useWebSocket from "react-use-websocket";
import { TilesProvider } from "../contexts/tilesContext";
import { FigurasProvider } from "../contexts/FigurasContext";
import { HabilitarAccionesUsuarioProvider } from "../contexts/habilitarAccionesUsuarioContext";

jest.mock("../containers/Game/components/Ficha.jsx", () => ({
  Ficha: ({ color }) => (
    <div data-testid="ficha" style={{ backgroundColor: color }}></div>
  ),
}));

jest.mock("react-use-websocket");

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

afterEach(() => {
  jest.clearAllMocks();
  cleanup();
});

describe("Game", () => {
  it("deberia mostrar el board cuando recibe GET_PLAYER_MATCH_INFO", () => {
    useWebSocket.mockReturnValue({
      sendMessage: jest.fn(),
      lastMessage: {
        data: JSON.stringify({
          key: "GET_PLAYER_MATCH_INFO",
          payload: {
            board: [
              ["red", "red", "red", "red", "red", "red"],
              ["red", "red", "red", "red", "red", "red"],
              ["red", "red", "red", "red", "red", "red"],
              ["green", "green", "green", "green", "green", "green"],
              ["green", "green", "green", "green", "green", "green"],
              ["green", "green", "green", "green", "green", "green"],
            ],
          },
        }),
      },
      readyState: 0,
    });
    render(
      <MemoryRouter>
        <EventoProvider>
          <DatosJugadorProvider>
            <DatosPartidaProvider>
              <TilesProvider>
                <FigurasProvider>
                  <HabilitarAccionesUsuarioProvider>
                    <Game />
                  </HabilitarAccionesUsuarioProvider>
                </FigurasProvider>
              </TilesProvider>
            </DatosPartidaProvider>
          </DatosJugadorProvider>
        </EventoProvider>
      </MemoryRouter>
    );

    const fichasItem = screen.getAllByTestId("ficha");

    fichasItem.forEach((element, i) => {
      if (i < 18) {
        expect(element).toHaveStyle("backgroundColor: red");
      } else {
        expect(element).toHaveStyle("backgroundColor: green");
      }
    });
  });

  it("deberia mostrar el modal de ganador cuando recibe PLAYER_WIN", () => {
    useWebSocket.mockReturnValue({
      sendMessage: jest.fn(),
      lastMessage: {
        data: JSON.stringify({
          key: "WINNER",
          payload: {
            player_id: 1,
            reason: "FORFEIT",
          },
        }),
      },
      readyState: 0,
    });
    render(
      <MemoryRouter>
        <EventoProvider>
          <DatosJugadorProvider>
            <DatosPartidaProvider>
              <TilesProvider>
                <FigurasProvider>
                  <HabilitarAccionesUsuarioProvider>
                  <Game />
                  </HabilitarAccionesUsuarioProvider>
                </FigurasProvider>
              </TilesProvider>
            </DatosPartidaProvider>
          </DatosJugadorProvider>
        </EventoProvider>
      </MemoryRouter>,
    );

    const modal = screen.getByText(
      "¡Ganaste!, todos los demás jugadores han abandonado la partida.",
    );
    expect(modal).toBeInTheDocument();
  });

  it("deberia no mostrar el modal de ganador cuando no se ha recibido un PLAYER_WIN", () => {
    useWebSocket.mockReturnValue({
      sendMessage: jest.fn(),
      lastMessage: {
        data: JSON.stringify({
          key: "GET_PLAYER_MATCH_INFO",
          payload: {
            board: [
              ["red", "red", "red", "red", "red", "red"],
              ["red", "red", "red", "red", "red", "red"],
              ["red", "red", "red", "red", "red", "red"],
              ["green", "green", "green", "green", "green", "green"],
              ["green", "green", "green", "green", "green", "green"],
              ["green", "green", "green", "green", "green", "green"],
            ],
          },
        }),
      },
      readyState: 0,
    });
    render(
      <MemoryRouter>
        <EventoProvider>
          <DatosJugadorProvider>
            <DatosPartidaProvider>
              <TilesProvider>
                <FigurasProvider>
                  <HabilitarAccionesUsuarioProvider>
                    <Game />
                  </HabilitarAccionesUsuarioProvider>
                </FigurasProvider>
              </TilesProvider>
            </DatosPartidaProvider>
          </DatosJugadorProvider>
        </EventoProvider>
      </MemoryRouter>
    );

    const modal = screen.queryByText(
      "¡Ganaste!, todos los demás jugadores han abandonado la partida.",
    );
    expect(modal).not.toBeInTheDocument();
  });

  it("deberia limpiar los contextos y navegar al home cuando se llama a moverJugadorAlHome", async () => {
    useWebSocket.mockReturnValue({
      sendMessage: jest.fn(),
      lastMessage: {
        data: JSON.stringify({
          key: "WINNER",
          payload: {
            player_id: 1,
            reason: "FORFEIT",
          },
        }),
      },
      readyState: 0,
    });
    const mockSetDatosJugador = jest.fn();
    const mockSetDatosPartida = jest.fn();
    render(
      <MemoryRouter>
        <EventoProvider>
          <DatosJugadorContext.Provider
            value={{
              datosJugador: { player_id: 1, is_owner: false },
              setDatosJugador: mockSetDatosJugador,
            }}
          >
            <DatosPartidaContext.Provider
              value={{
                datosPartida: { current_turn: "name", max_players: 3 },
                setDatosPartida: mockSetDatosPartida,
              }}
            >
              <TilesProvider>
                <FigurasProvider>
                  <HabilitarAccionesUsuarioProvider>
                    <Game />
                  </HabilitarAccionesUsuarioProvider>
                </FigurasProvider>
              </TilesProvider>
            </DatosPartidaContext.Provider>
          </DatosJugadorContext.Provider>
        </EventoProvider>
      </MemoryRouter>
    );

    const button = screen.getByText("Volver al home");

    act(() => {
      fireEvent.click(button);
    });

    expect(mockNavigate).toHaveBeenCalledWith("/");
    expect(mockSetDatosJugador).toHaveBeenCalledWith({
      player_id: null,
      is_owner: false,
    });
    expect(mockSetDatosPartida).toHaveBeenCalledWith({
      current_turn: "",
      max_players: 2,
    });
  });
});
