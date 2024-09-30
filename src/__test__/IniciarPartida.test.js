import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import IniciarPartida from "../containers/Lobby/components/IniciarPartida";
import { BACKEND_URL } from "../variablesConfiguracion";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const server = setupServer(
  http.patch(`${BACKEND_URL}/matches/:match_id/start/:player_id`, () => {
    return HttpResponse.json(null, { status: 200 });
  }),
);

describe("IniciarPartida", () => {
  beforeEach(() => {
    server.listen({ onUnhandledRequest: "error" });
  });

  afterEach(cleanup);
  afterEach(() => {
    jest.clearAllMocks();
    server.resetHandlers();
  });

  afterAll(() => server.close());
  it("deberia renderizar correctamente", () => {
    render(
      <IniciarPartida
        idPartida={123}
        idJugador={456}
        nJugadoresEnLobby={3}
        maxJugadores={4}
      />,
    );
  });

  it("deberia deshabilitar el boton cuando nJugadoresEnLobby no es igual a maxJugadores o esAnfitrion es falso", () => {
    const { rerender } = render(
      <IniciarPartida
        idPartida={123}
        idJugador={456}
        esAnfitrion={true}
        nJugadoresEnLobby={3}
        maxJugadores={4}
      />,
    );
    expect(screen.getByRole("button")).toBeDisabled();

    rerender(
      <IniciarPartida
        idPartida={123}
        idJugador={456}
        esAnfitrion={false}
        nJugadoresEnLobby={3}
        maxJugadores={4}
      />,
    );
    expect(screen.getByRole("button")).toBeDisabled();

    rerender(
      <IniciarPartida
        idPartida={123}
        idJugador={456}
        esAnfitrion={false}
        nJugadoresEnLobby={4}
        maxJugadores={4}
      />,
    );
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("deberia habilitar el boton cuando nJugadoresEnLobby es igual a maxJugadores y esAnfitrion es true", () => {
    render(
      <IniciarPartida
        idPartida={123}
        esAnfitrion={true}
        idJugador={456}
        nJugadoresEnLobby={4}
        maxJugadores={4}
      />,
    );
    expect(screen.getByRole("button")).not.toBeDisabled();
  });

  it("deberia navegar cuando se hace click en el boton habilitado", async () => {
    server.use(
      http.patch(`${BACKEND_URL}/matches/123/start/456`, () => {
        return HttpResponse.json(null, { status: 200 });
      }),
    );

    render(
      <IniciarPartida
        idPartida={123}
        idJugador={456}
        esAnfitrion={true}
        nJugadoresEnLobby={4}
        maxJugadores={4}
      />,
    );

    fireEvent.click(screen.getByText("Iniciar Partida"));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/matches/123");
    });
  });

  it("deberia no navegar cuando se hace click en el boton pero está deshabilitado", async () => {
    render(
      <IniciarPartida
        idPartida={123}
        idJugador={456}
        esAnfitrion={false}
        nJugadoresEnLobby={3}
        maxJugadores={4}
      />,
    );

    fireEvent.click(screen.getByText("Iniciar Partida"));

    await waitFor(() => {
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  it("deberia loggear error cuando falla el fetch", async () => {
    console.error = jest.fn();
    server.use(
      http.patch(`${BACKEND_URL}/matches/123/start/456`, () => {
        return HttpResponse.json(null, { status: 500 });
      }),
    );

    render(
      <IniciarPartida
        idPartida={123}
        idJugador={456}
        esAnfitrion={true}
        nJugadoresEnLobby={4}
        maxJugadores={4}
      />,
    );

    fireEvent.click(screen.getByText("Iniciar Partida"));

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        "Error al iniciar partida - estado: 500",
      );
    });
  });
});
