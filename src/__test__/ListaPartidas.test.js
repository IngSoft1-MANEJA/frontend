import React from "react";
import { jest } from "@jest/globals";
import { render, screen, waitFor, cleanup, fireEvent } from "@testing-library/react";
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

  test("debe enviar el mensaje correcto al backend al filtrar partidas por nombre", () => {
    const mockSendJsonMessage = jest.fn();
    useWebSocket.mockImplementation(() => ({
      lastJsonMessage: mockMatchList,
      sendJsonMessage: mockSendJsonMessage,
    }));
  
    customRender();
  
    const input = screen.getByPlaceholderText("Buscar partida por nombre...");
    
    // Simula el evento de cambio en el campo de búsqueda
    const searchTerm = "Partida 1";
    fireEvent.change(input, { target: { value: searchTerm } });
  
    // Verifica que `sendJsonMessage` haya sido llamado correctamente
    expect(mockSendJsonMessage).toHaveBeenCalledWith({
      key: "FILTER_MATCHES",
      payload: { match_name: searchTerm },
    });
  });
    

  test("debe llamar a sendJsonMessage al filtrar por maximo de jugadores", () => {
    const mockSendJsonMessage = jest.fn();
    useWebSocket.mockImplementation((url) => ({
      lastJsonMessage: null,
      sendJsonMessage: mockSendJsonMessage,
    }));

    customRender();    

    const filtroDeJugadores = screen.getByPlaceholderText(/Número de jugadores/i);
    fireEvent.change(filtroDeJugadores, { target: { value: "2" } });
    fireEvent.click(screen.getByText("Filtrar"));

    expect(mockSendJsonMessage).toHaveBeenCalledWith({
      key: "FILTER_MATCHES",
      payload: { max_players: "2" },
    });
  });
});
