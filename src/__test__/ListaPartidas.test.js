import React from "react";
import { jest } from "@jest/globals";
import {
  render,
  screen,
  waitFor,
  cleanup,
  fireEvent,
} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { ListaPartidas } from "../containers/App/components/ListaPartidas.jsx";
import { ListarPartidasMock } from "../__mocks__/ListarPartidas.mock.js";
import {
  DatosJugadorContext,
  DatosJugadorProvider,
} from "../contexts/DatosJugadorContext.jsx";
import * as reactRouterDom from "react-router-dom";
import {
  DatosPartidaContext,
  DatosPartidaProvider,
} from "../contexts/DatosPartidaContext.jsx";

const mockedUsedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(ListarPartidasMock),
  }),
);

describe("ListarPartidas", () => {
  afterEach(cleanup);
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("debe renderizar las partidas correctamente", async () => {
    render(
      <DatosPartidaProvider>
        <DatosJugadorProvider>
          <ListaPartidas />
        </DatosJugadorProvider>
        ,
      </DatosPartidaProvider>,
    );

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    await waitFor(() => {
      ListarPartidasMock.forEach((partida) => {
        expect(
          screen.getByText(partida.match_id.toString()),
        ).toBeInTheDocument();
        expect(screen.getByText(partida.match_name)).toBeInTheDocument();
        expect(
          screen.getByText(partida.current_players.toString()),
        ).toBeInTheDocument();
        expect(
          screen.getByText(partida.max_players.toString()),
        ).toBeInTheDocument();
      });
    });
  });

  test("debe manejar errores de fetch y registrar el mensaje de error en la consola", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    fetch.mockImplementationOnce(() => Promise.reject("API is down"));

    render(
      <DatosPartidaProvider>
        <DatosJugadorProvider>
          <ListaPartidas />
        </DatosJugadorProvider>
      </DatosPartidaProvider>,
    );

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error en fetch de partidas: API is down",
      );
    });

    consoleErrorSpy.mockRestore();
  });

  test("debe refrescar las partidas al hacer clic en el botón de refresco", async () => {
    render(
      <DatosPartidaProvider>
        <DatosJugadorProvider>
          <ListaPartidas />
        </DatosJugadorProvider>
        ,
      </DatosPartidaProvider>,
    );

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    fireEvent.click(screen.getByText("Refrescar"));

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));

    await waitFor(() => {
      ListarPartidasMock.forEach((partida) => {
        expect(
          screen.getByText(partida.match_id.toString()),
        ).toBeInTheDocument();
        expect(screen.getByText(partida.match_name)).toBeInTheDocument();
        expect(
          screen.getByText(partida.current_players.toString()),
        ).toBeInTheDocument();
        expect(
          screen.getByText(partida.max_players.toString()),
        ).toBeInTheDocument();
      });
    });
  });
});
