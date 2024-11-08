import React from "react";
import { jest } from "@jest/globals";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { ListaPartidas } from "../containers/App/components/ListaPartidas.jsx";
import { ListarPartidasMock } from "../__mocks__/ListarPartidas.mock.js";
import { DatosJugadorProvider } from "../contexts/DatosJugadorContext.jsx";
import { DatosPartidaProvider } from "../contexts/DatosPartidaContext.jsx";
import useWebSocket from "react-use-websocket";

const mockedUsedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

jest.mock("react-use-websocket", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockMatchList = {
  key: "MATCHES_LIST",
  payload: { matches: ListarPartidasMock },
};

describe("ListarPartidas", () => {
  afterEach(cleanup);
  afterEach(() => {
    jest.clearAllMocks();
  });

  const customRender = () => {
    return render(
      <DatosPartidaProvider>
        <DatosJugadorProvider>
          <ListaPartidas />
        </DatosJugadorProvider>
      </DatosPartidaProvider>,
    );
  };

  test("debe renderizar las partidas correctamente", () => {
    useWebSocket.mockImplementation((url) => ({
      lastJsonMessage: mockMatchList,
    }));

    customRender();

    ListarPartidasMock.forEach((partida) => {
      expect(screen.getByText(partida.id.toString())).toBeInTheDocument();
      expect(screen.getByText(partida.match_name)).toBeInTheDocument();
      expect(
        screen.getByText(`${partida.current_players}/${partida.max_players}`),
      ).toBeInTheDocument();
    });
  });

  test("debe sustituir la lista de partidas cuando le llegan partidas", () => {
    useWebSocket.mockImplementation((url) => ({
      lastJsonMessage: mockMatchList,
    }));

    const { rerender } = customRender();

    ListarPartidasMock.forEach((partida) => {
      expect(screen.getByText(partida.id.toString())).toBeInTheDocument();
      expect(screen.getByText(partida.match_name)).toBeInTheDocument();
      expect(
        screen.getByText(`${partida.current_players}/${partida.max_players}`),
      ).toBeInTheDocument();
    });

    const nuevaListaEvento = {
      key: "MATCHES_LIST",
      payload: {
        matches: [
          {
            id: 3,
            max_players: 4,
            current_players: 2,
            match_name: "Partida 3",
          },
          {
            id: 4,
            max_players: 2,
            current_players: 1,
            match_name: "Partida 4",
          },
        ],
      },
    };

    useWebSocket.mockImplementation(() => ({
      lastJsonMessage: nuevaListaEvento,
    }));

    rerender(
      <DatosPartidaProvider>
        <DatosJugadorProvider>
          <ListaPartidas />
        </DatosJugadorProvider>
      </DatosPartidaProvider>,
    );

    expect(screen.queryByText("Partida 1")).not.toBeInTheDocument();
    expect(screen.queryByText("Partida 2")).not.toBeInTheDocument();

    nuevaListaEvento.payload.matches.forEach((partida) => {
      expect(screen.getByText(partida.id.toString())).toBeInTheDocument();
      expect(screen.getByText(partida.match_name)).toBeInTheDocument();
      expect(
        screen.getByText(`${partida.current_players}/${partida.max_players}`),
      ).toBeInTheDocument();
    });
  });

  test("muestra mensaje de que no hay partidas disponibles cuando se reciba una lista vacia de partidas", () => {
    const emptyListEvent = { key: "MATCHES_LIST", payload: { matches: [] } };
    useWebSocket.mockImplementation((url) => ({
      lastJsonMessage: emptyListEvent,
    }));

    render(
      <DatosPartidaProvider>
        <DatosJugadorProvider>
          <ListaPartidas />
        </DatosJugadorProvider>
      </DatosPartidaProvider>,
    );

    expect(
      screen.queryByText("No se encuentran partidas disponibles"),
    ).toBeInTheDocument();
  });

  test("debe enviar un request a la API para listar partidas por cantidad de jugadores", () => {
    const fetchSpy = jest.spyOn(global, "fetch");
    const mockLista = [
      {
        id: 1,
        match_id: 1,
        max_players: 3,
        current_players: 2,
        match_name: "Partida filtrada 1",
      },
      {
        id: 2,
        match_id: 2,
        max_players: 4,
        current_players: 2,
        match_name: "Partida filtrada 2",
      },
    ];
    fetchSpy.mockResolvedValue(mockLista);

    render(
      <DatosPartidaProvider>
        <DatosJugadorProvider>
          <ListaPartidas />
        </DatosJugadorProvider>
      </DatosPartidaProvider>
    );

    const botonDropdown = screen.getByText(/Filtrar/i);

    act(() => {
      fireEvent.click(botonDropdown);
    });

    const dropdown = screen.getByText(/Máximo de Jugadores/).parentNode.parentNode;
    const filtroJugadores = dropdown.querySelector("input");
    const botonFiltrar = dropdown.querySelector("button");

    act(() => {
      fireEvent.change(filtroJugadores, { target: { value: "2" } });
      fireEvent.click(botonFiltrar);
    });

    expect(fetchSpy).toHaveBeenCalledWith(`${BACKEND_URL}/matches?max_players=2`);

    mockLista.forEach((partida) => {
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
