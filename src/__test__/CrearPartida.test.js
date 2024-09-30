import React from "react";
import {
  render,
  screen,
  fireEvent,
  cleanup,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { jest } from "@jest/globals";
import { CrearPartida } from "../containers/App/components/CrearPartida.jsx";
import {
  CrearPartidaMock,
  CrearPartidaMockError,
} from "../__mocks__/CrearPartidaForm.mock.js";
import * as reactRouterDom from "react-router-dom";
import { BACKEND_URL } from "../variablesConfiguracion.js";
import {
  DatosJugadorContext,
  DatosJugadorProvider,
} from "../contexts/DatosJugadorContext.jsx";

const mockedUsedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve({ player_name: "test", match_id: 1, player_id: 2 }),
  }),
);

describe("CrearPartida", () => {
  beforeAll(() => {
    HTMLDialogElement.prototype.showModal = jest.fn();
    HTMLDialogElement.prototype.close = jest.fn();
  });

  afterEach(cleanup);
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders CrearPartida component", () => {
    render(
      <reactRouterDom.MemoryRouter>
        <DatosJugadorProvider>
          <CrearPartida />
        </DatosJugadorProvider>
      </reactRouterDom.MemoryRouter>,
    );
    expect(screen.getByText("Crear sala")).toBeInTheDocument();
  });

  test("opens the modal correctly after clicking the button", () => {
    render(
      <reactRouterDom.MemoryRouter>
        <DatosJugadorProvider>
          <CrearPartida />
        </DatosJugadorProvider>
      </reactRouterDom.MemoryRouter>,
    );

    const openButton = screen.getByText("Crear sala");
    fireEvent.click(openButton);

    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();
  });

  test("closes the modal correctly after clicking the close button", async () => {
    render(
      <reactRouterDom.MemoryRouter>
        <DatosJugadorProvider>
          <CrearPartida />
        </DatosJugadorProvider>
      </reactRouterDom.MemoryRouter>,
    );

    const openButton = screen.getByText("Crear sala");
    fireEvent.click(openButton);

    const closeButton = screen.getByText("✕");
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(HTMLDialogElement.prototype.close).toHaveBeenCalled();
    });
  });

  test("inputs get cleared after closing the modal", async () => {
    render(
      <reactRouterDom.MemoryRouter>
        <DatosJugadorProvider>
          <CrearPartida />
        </DatosJugadorProvider>
      </reactRouterDom.MemoryRouter>,
    );

    const openButton = screen.getByText("Crear sala");
    fireEvent.click(openButton);

    const nombreJugadorInput = screen.getByLabelText("nombreJugador");
    const nombreSalaInput = screen.getByLabelText("nombreSala");
    const cantidadJugadoresInput = screen.getByLabelText("cantidadJugadores");

    await userEvent.type(nombreJugadorInput, CrearPartidaMock.nombreJugador);
    await userEvent.type(nombreSalaInput, CrearPartidaMock.nombreSala);
    await userEvent.type(
      cantidadJugadoresInput,
      CrearPartidaMock.cantidadJugadores,
    );

    await waitFor(() => {
      expect(nombreJugadorInput).toHaveValue(CrearPartidaMock.nombreJugador);
      expect(nombreSalaInput).toHaveValue(CrearPartidaMock.nombreSala);
      expect(cantidadJugadoresInput).toHaveValue(
        CrearPartidaMock.cantidadJugadores.toString(),
      );
    });

    const closeButton = screen.getByText("✕");
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(HTMLDialogElement.prototype.close).toHaveBeenCalled();
    });

    fireEvent.click(openButton);

    await waitFor(() => {
      expect(nombreJugadorInput).toHaveValue("");
      expect(nombreSalaInput).toHaveValue("");
      expect(cantidadJugadoresInput).toHaveValue("");
    });
  });

  test("fetch is not called when input values are incorrect", async () => {
    render(
      <reactRouterDom.MemoryRouter>
        <DatosJugadorProvider>
          <CrearPartida />
        </DatosJugadorProvider>
      </reactRouterDom.MemoryRouter>,
    );

    const openButton = screen.getByText("Crear sala");
    fireEvent.click(openButton);

    const nombreJugadorInput = screen.getByLabelText("nombreJugador");
    const nombreSalaInput = screen.getByLabelText("nombreSala");
    const cantidadJugadoresInput = screen.getByLabelText("cantidadJugadores");
    const submitButton = screen.getByText("Crear sala");

    await userEvent.type(
      nombreJugadorInput,
      CrearPartidaMockError.nombreJugador,
    );
    await userEvent.type(nombreSalaInput, CrearPartidaMockError.nombreSala);
    await userEvent.type(
      cantidadJugadoresInput,
      CrearPartidaMockError.cantidadJugadores,
    );

    await waitFor(() => {
      expect(nombreJugadorInput).toHaveValue(
        CrearPartidaMockError.nombreJugador,
      );
      expect(nombreSalaInput).toHaveValue(CrearPartidaMockError.nombreSala);
      expect(cantidadJugadoresInput).toHaveValue(
        CrearPartidaMockError.cantidadJugadores,
      );
    });

    fireEvent.click(submitButton);

    expect(fetch).not.toHaveBeenCalled();
  });

  test("fetch is executed without issues and returns expected value", async () => {
    render(
      <reactRouterDom.MemoryRouter>
        <DatosJugadorProvider>
          <CrearPartida />
        </DatosJugadorProvider>
      </reactRouterDom.MemoryRouter>,
    );

    const openButton = screen.getByText("Crear sala");
    fireEvent.click(openButton);

    const nombreJugadorInput = screen.getByLabelText("nombreJugador");
    const nombreSalaInput = screen.getByLabelText("nombreSala");
    const cantidadJugadoresInput = screen.getByLabelText("cantidadJugadores");
    const submitButton = screen.getByText("Crear sala de partida");

    expect(nombreJugadorInput).toHaveValue("");
    expect(nombreSalaInput).toHaveValue("");
    expect(cantidadJugadoresInput).toHaveValue("");

    await userEvent.type(nombreJugadorInput, CrearPartidaMock.nombreJugador);
    await userEvent.type(nombreSalaInput, CrearPartidaMock.nombreSala);
    await userEvent.type(
      cantidadJugadoresInput,
      CrearPartidaMock.cantidadJugadores,
    );

    await waitFor(() => {
      expect(nombreJugadorInput).toHaveValue(CrearPartidaMock.nombreJugador);
      expect(nombreSalaInput).toHaveValue(CrearPartidaMock.nombreSala);
      expect(cantidadJugadoresInput).toHaveValue(
        CrearPartidaMock.cantidadJugadores,
      );
    });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        `${BACKEND_URL}/matches`,
        expect.objectContaining({
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            match_name: CrearPartidaMock.nombreSala,
            player_name: CrearPartidaMock.nombreJugador,
            max_players: CrearPartidaMock.cantidadJugadores,
          }),
        }),
      );
    });

    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledTimes(1);
      expect(mockedUsedNavigate).toHaveBeenCalledWith("/lobby/1/player/2");
    });
  });
});
