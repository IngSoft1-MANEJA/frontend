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
import { ListaPartidas } from "../containers/App/components/ListaPartidas.jsx"; // Ajusta la ruta según sea necesario
import { ListarPartidasMock } from "../__mocks__/ListarPartidas.mock.js"; // Ajusta la ruta según sea necesario

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
        expect(screen.getByText(partida.id.toString())).toBeInTheDocument();
        expect(screen.getByText(partida.nombre)).toBeInTheDocument();
        expect(
          screen.getByText(partida.jugadoresActuales.toString()),
        ).toBeInTheDocument();
        expect(
          screen.getByText(partida.jugadoresMaximos.toString()),
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
        expect(screen.getByText(partida.id.toString())).toBeInTheDocument();
        expect(screen.getByText(partida.nombre)).toBeInTheDocument();
        expect(
          screen.getByText(partida.jugadoresActuales.toString()),
        ).toBeInTheDocument();
        expect(
          screen.getByText(partida.jugadoresMaximos.toString()),
        ).toBeInTheDocument();
      });
    });
  });
});
