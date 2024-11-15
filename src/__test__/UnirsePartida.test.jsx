import React from "react";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import {
  render,
  fireEvent,
  screen,
  cleanup,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import UnirsePartida from "../containers/App/components/UnirsePartida";
import {
  DatosJugadorContext,
  DatosJugadorProvider,
} from "../contexts/DatosJugadorContext";
import { DatosPartidaProvider } from "../contexts/DatosPartidaContext";
import { BACKEND_URL } from "../variablesConfiguracion";
import { MemoryRouter } from "react-router-dom";

const server = setupServer(
  http.post(`${BACKEND_URL}/matches/:id`, () => {
    return HttpResponse.json(null, { status: 200 });
  }),
);

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("UnirsePartida", () => {
  beforeAll(() => {
    server.listen({ onUnhandledRequest: "error" });
    HTMLDialogElement.prototype.showModal = jest.fn();
    HTMLDialogElement.prototype.close = jest.fn();
    HTMLFormElement.prototype.requestSubmit = jest.fn();
  });

  afterEach(cleanup);
  afterEach(() => {
    jest.clearAllMocks();
    server.resetHandlers();
  });

  afterAll(() => server.close());

  it("deberia renderizar correctamente", () => {
    render(
      <DatosPartidaProvider>
        <DatosJugadorProvider>
          <UnirsePartida idPartida={1} />
        </DatosJugadorProvider>
      </DatosPartidaProvider>,
    );
  });

  it("deberia llamar a showModal se clickea el boton", () => {
    render(
      <DatosPartidaProvider>
        <DatosJugadorProvider>
          <UnirsePartida idPartida={1} />
        </DatosJugadorProvider>
      </DatosPartidaProvider>,
    );

    fireEvent.click(screen.getByText("Unirse a partida"));

    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalledTimes(1);
  });

  it("deberia llamar a close cuando el boton de cerrar se clickea", () => {
    render(
      <DatosPartidaProvider>
        <DatosJugadorProvider>
          <UnirsePartida idPartida={1} />
        </DatosJugadorProvider>
      </DatosPartidaProvider>,
    );

    fireEvent.click(screen.getByText("Unirse a partida"));
    fireEvent.click(screen.getByText("✕"));

    expect(HTMLDialogElement.prototype.close).toHaveBeenCalledTimes(1);
  });

  it("deberia limpiar el input del modal cuando se cierra", () => {
    render(
      <DatosPartidaProvider>
        <DatosJugadorProvider>
          <UnirsePartida idPartida={1} />
        </DatosJugadorProvider>
      </DatosPartidaProvider>,
    );

    fireEvent.click(screen.getByText("Unirse a partida"));

    const el = screen.getByLabelText("Ingresa tu nombre");
    const input = el.parentElement.parentElement.querySelector("input");

    fireEvent.change(input, { target: { value: "test" } });
    expect(input.value).toBe("test");

    fireEvent.click(screen.getByText("✕"));
    expect(input.value).toBe("");
  });

  it("debería mostrar un mensaje de error cuando no se ingresa un nombre de usuario y se hace click en unirse", () => {
    render(
      <DatosPartidaProvider>
        <DatosJugadorProvider>
          <UnirsePartida idPartida={1} />
        </DatosJugadorProvider>
      </DatosPartidaProvider>,
    );

    fireEvent.click(screen.getByText("Unirse a partida"));
    fireEvent.click(screen.getByText("Unirse"));

    const mensajeError = screen.getByText(
      "Por favor, ingrese un nombre de usuario",
    );
    expect(mensajeError).toBeInTheDocument();
  });

  it("debería hacer una solicitud exitosa para unirse a la partida y navegar al lobby", async () => {
    console.error = jest.fn();
    server.use(
      http.post(`${BACKEND_URL}/matches/:id`, async ({ request, params }) => {
        const { id } = params;
        const body = await request.json();

        if (id !== "1" || body.player_name !== "test") {
          return HttpResponse.json(null, { status: 400 });
        }

        return HttpResponse.json(
          { match_id: 1, player_id: 2 },
          { status: 200 },
        );
      }),
    );

    render(
      <MemoryRouter>
        <DatosPartidaProvider>
          <DatosJugadorProvider>
            <UnirsePartida idPartida={1} />
          </DatosJugadorProvider>
        </DatosPartidaProvider>
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByText("Unirse a partida"));

    const el = screen.getByLabelText("Ingresa tu nombre");
    const input = el.parentElement.parentElement.querySelector("input");

    fireEvent.change(input, { target: { value: "test" } });
    fireEvent.click(screen.getByText("Unirse"));

    await waitFor(() => {
      expect(console.error).not.toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith("/lobby/1/player/2");
    });
  });

  it("deberia loggear un mensaje de error en consola si la solicitud falla", async () => {
    console.error = jest.fn();
    server.use(
      http.post(`${BACKEND_URL}/matches/:id`, async ({ request, params }) => {
        return HttpResponse.json(null, { status: 500 });
      }),
    );

    render(
      <MemoryRouter>
        <DatosPartidaProvider>
          <DatosJugadorProvider>
            <UnirsePartida idPartida={1} />
          </DatosJugadorProvider>
        </DatosPartidaProvider>
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByText("Unirse a partida"));

    const el = screen.getByLabelText("Ingresa tu nombre");
    const input = el.parentElement.parentElement.querySelector("input");

    fireEvent.change(input, { target: { value: "test" } });
    fireEvent.click(screen.getByText("Unirse"));

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(
        "Error al unirse a partida - estado: 500",
      );
    });
  });

  it("deberia actualizar el estado de datosJugador con los datos recibidos", async () => {
    server.use(
      http.post(`${BACKEND_URL}/matches/:id`, async ({ request, params }) => {
        const { id } = params;
        const body = await request.json();

        if (id !== "1" || body.player_name !== "test") {
          return HttpResponse.json(null, { status: 400 });
        }

        return HttpResponse.json(
          { match_id: 1, player_id: 2 },
          { status: 200 },
        );
      }),
    );

    const mockSetDatosJugador = jest.fn();
    render(
      <MemoryRouter>
        <DatosPartidaProvider>
          <DatosJugadorContext.Provider
            value={{ datosJugador: {}, setDatosJugador: mockSetDatosJugador }}
          >
            <UnirsePartida idPartida={1} />
          </DatosJugadorContext.Provider>
        </DatosPartidaProvider>
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByText("Unirse a partida"));

    const el = screen.getByLabelText("Ingresa tu nombre");
    const input = el.parentElement.parentElement.querySelector("input");

    fireEvent.change(input, { target: { value: "test" } });
    fireEvent.click(screen.getByText("Unirse"));

    await waitFor(() => {
      expect(mockSetDatosJugador).toHaveBeenCalledWith({
        is_owner: false,
        player_id: 2,
        player_name: "test",
      });
    });
  });
});
