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
import * as reactRouterDom from "react-router-dom";

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
    render(<ListaPartidas />);

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

  test("debe manejar errores de fetch", async () => {
    fetch.mockImplementationOnce(() => Promise.reject("API is down"));
    render(<ListaPartidas />);

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    await waitFor(() => {
      expect(
        screen.getByText("No hay partidas disponibles"),
      ).toBeInTheDocument();
    });
  });

  test("debe refrescar las partidas al hacer clic en el botón de refresco", async () => {
    render(<ListaPartidas />);

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
