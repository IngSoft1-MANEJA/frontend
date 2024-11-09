import React from "react";
import {
  act,
  cleanup,
  render,
  screen,
} from "@testing-library/react";
import { useParams } from "react-router-dom";
import { DatosJugadorContext } from "../contexts/DatosJugadorContext.jsx";
import { CartasFiguras } from "../containers/Game/components/CartasFiguras.jsx";
import { EventoContext } from "../contexts/EventoContext.jsx";
import {
  CompletarFiguraContext,
  CompletarFiguraProvider,
} from "../contexts/CompletarFiguraContext.jsx";
import {
  UsarMovimientoContext,
  UsarMovimientoProvider,
} from "../contexts/UsarMovimientoContext.jsx";
import {
  HabilitarAccionesUsuarioProvider,
  HabilitarAccionesUsuarioContext,
} from "../contexts/habilitarAccionesUsuarioContext.jsx";

jest.mock("react-router-dom", () => ({
  useParams: jest.fn(),
}));

jest.mock("react-use-websocket", () => ({
  useWebSocket: jest.fn(),
}));

describe("CartasFiguras", () => {
  beforeEach(() => {
    useParams.mockReturnValue({ match_id: "1" });
  });

  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  const renderComponent = (
    renderFunc,
    datosJugador,
    evento,
    usarMovimiento = { usarMovimiento: { cartaSeleccionada: null } },
    completarFigura = null,
    habilitarAccionesUsuario = {
      habilitarAccionesUsuario: true,
      setHabilitarAccionesUsuario: jest.fn(),
    }
  ) => {
    const completarFiguraConContexto = (
      <CompletarFiguraContext.Provider value={completarFigura}>
        <CartasFiguras />
      </CompletarFiguraContext.Provider>
    );

    const completarFiguraConProvider = (
      <CompletarFiguraProvider>
        <CartasFiguras />
      </CompletarFiguraProvider>
    );
    return renderFunc(
      <DatosJugadorContext.Provider value={datosJugador}>
        <EventoContext.Provider value={evento}>
          <UsarMovimientoContext.Provider value={usarMovimiento}>
            <HabilitarAccionesUsuarioContext.Provider
              value={habilitarAccionesUsuario}
            >
              {completarFigura ? completarFiguraConContexto : completarFiguraConProvider}
            </HabilitarAccionesUsuarioContext.Provider>
          </UsarMovimientoContext.Provider>
        </EventoContext.Provider>
      </DatosJugadorContext.Provider>
    );
  };

  test("Debe renderizar correctamente las cartas del jugador cuando recibe el mensaje PLAYER_RECIEVE_ALL_SHAPES", () => {
    const mockDatosJugador = {
      datosJugador: { player_id: "123" },
      setDatosJugador: jest.fn(),
    };

    const mockInfoJugador = {
      ultimoEvento: {
        key: "GET_PLAYER_MATCH_INFO",
        payload: { turn_order: 1 },
      },
    };

    const mockEvento = {
      ultimoEvento: {
        key: "PLAYER_RECIEVE_ALL_SHAPES",
        payload: [
          {
            turn_order: 1,
            shape_cards: [
              [1, 1],
              [2, 2],
              [3, 3],
            ],
          },
        ],
      },
    };

    const { rerender } = render(
      <DatosJugadorContext.Provider value={mockDatosJugador}>
        <EventoContext.Provider value={mockInfoJugador}>
          <CompletarFiguraProvider>
            <UsarMovimientoProvider>
              <HabilitarAccionesUsuarioProvider>
                <CartasFiguras />
              </HabilitarAccionesUsuarioProvider>
            </UsarMovimientoProvider>
          </CompletarFiguraProvider>
        </EventoContext.Provider>
      </DatosJugadorContext.Provider>
    );

    rerender(
      <DatosJugadorContext.Provider value={mockDatosJugador}>
        <EventoContext.Provider value={mockEvento}>
          <CompletarFiguraProvider>
            <UsarMovimientoProvider>
              <HabilitarAccionesUsuarioProvider>
                <CartasFiguras />
              </HabilitarAccionesUsuarioProvider>
            </UsarMovimientoProvider>
          </CompletarFiguraProvider>
        </EventoContext.Provider>
      </DatosJugadorContext.Provider>
    );

    expect(screen.getByAltText("1")).toBeInTheDocument();
    expect(screen.getByAltText("2")).toBeInTheDocument();
    expect(screen.getByAltText("3")).toBeInTheDocument();
  });

  test("No debe renderizar cartas si no hay mensajes del WebSocket", () => {
    const eventoValue = { ultimoEvento: null };

    const mockDatosJugador = {
      datosJugador: { player_id: "123" },
      setDatosJugador: jest.fn(),
    };

    render(
      <DatosJugadorContext.Provider value={mockDatosJugador}>
        <EventoContext.Provider value={eventoValue}>
          <CompletarFiguraProvider>
            <UsarMovimientoProvider>
              <HabilitarAccionesUsuarioProvider>
                <CartasFiguras />
              </HabilitarAccionesUsuarioProvider>
            </UsarMovimientoProvider>
          </CompletarFiguraProvider>
        </EventoContext.Provider>
      </DatosJugadorContext.Provider>
    );

    expect(screen.queryByAltText("1")).not.toBeInTheDocument();
    expect(screen.queryByAltText("2")).not.toBeInTheDocument();
    expect(screen.queryByAltText("3")).not.toBeInTheDocument();
  });

  const preparaComponenteConFiguras = ({
    usarMovimiento = { usarMovimiento: { cartaSeleccionada: null } },
    completarFigura = null,
    habilitarAccionesUsuario = {
      habilitarAccionesUsuario: true,
      setHabilitarAccionesUsuario: jest.fn(),
    },
  }) => {
    const eventoContext = {
      ultimoEvento: {
        key: "GET_PLAYER_MATCH_INFO",
        payload: { turn_order: 1 },
      },
      setUltimoEvento: jest.fn(),
    };

    const datosJugadorContext = {
      datosJugador: { turn_order: 1, is_player_turn: true },
      setDatosJugador: jest.fn(),
    };
    const { rerender } = renderComponent(
      render,
      datosJugadorContext,
      eventoContext
    );

    const eventoContext2 = {
      ultimoEvento: {
        key: "PLAYER_RECIEVE_ALL_SHAPES",
        payload: [
          {
            turn_order: 1,
            shape_cards: [
              [1, 1],
              [2, 2],
              [3, 3],
            ],
          },
        ],
      },
      setUltimoEvento: jest.fn(),
    };

    renderComponent(
      rerender,
      datosJugadorContext,
      eventoContext2,
      usarMovimiento,
      completarFigura,
      habilitarAccionesUsuario
    );
    return rerender;
  };

  const getCard = (index) => screen.getByAltText(index).parentElement;

  it("debe resaltar solo la figura cliqueada", () => {
    preparaComponenteConFiguras({});
    const figure1 = getCard("1");
    const figure2 = getCard("2");
    const figure3 = getCard("3");
    act(() => {
      figure3.click();
    });
    const hoverClass =
      "hover:cursor-pointer hover:shadow-[0px_0px_15px_rgba(224,138,44,1)] hover:scale-105";
    expect(figure1).not.toHaveClass(hoverClass);
    expect(figure2).not.toHaveClass(hoverClass);
    expect(figure3).toHaveClass(
      "cursor-pointer shadow-[0px_0px_20px_rgba(100,200,44,1)] scale-105"
    );
  });

  it("debe deseleccionar la figura si se cliquea nuevamente", () => {
    preparaComponenteConFiguras({});
    const figure1 = getCard("1");
    const figure2 = getCard("2");
    const figure3 = getCard("3");
    act(() => {
      figure3.click();
    });
    act(() => {
      figure3.click();
    });
    const hoverClass =
      "hover:cursor-pointer hover:shadow-[0px_0px_15px_rgba(224,138,44,1)] hover:scale-105";
    expect(figure1).toHaveClass(hoverClass);
    expect(figure2).toHaveClass(hoverClass);
    expect(figure3).toHaveClass(hoverClass);
  });

  it("debe hacer hover a una figura si no hay ninguna seleccionada", () => {
    preparaComponenteConFiguras({});
    const getCard = (index) => screen.getByAltText(index).parentElement;
    const figure1 = getCard("1");
    const figure2 = getCard("2");
    const figure3 = getCard("3");

    const hoverClass =
      "hover:cursor-pointer hover:shadow-[0px_0px_15px_rgba(224,138,44,1)] hover:scale-105";

    expect(figure1).toHaveClass(hoverClass);
    expect(figure2).toHaveClass(hoverClass);
    expect(figure3).toHaveClass(hoverClass);
  });

  it("no debe poder seleccionar si no es el turno del jugador", () => {
    const rerender = preparaComponenteConFiguras({});
    renderComponent(
      rerender,
      { datosJugador: { is_player_turn: false } },
      { ultimoEvento: null }
    );

    const figure1 = getCard("1");
    const figure2 = getCard("2");
    const figure3 = getCard("3");
    act(() => {
      figure3.click();
    });
    const hoverClass =
      "hover:cursor-pointer hover:shadow-[0px_0px_15px_rgba(224,138,44,1)] hover:scale-105";
    expect(figure1).not.toHaveClass(hoverClass);
    expect(figure2).not.toHaveClass(hoverClass);
    expect(figure3).not.toHaveClass(hoverClass);
    expect(figure3).not.toHaveClass(
      "cursor-pointer shadow-[0px_0px_20px_rgba(100,200,44,1)] scale-105"
    );
  });

  it("No debe poder seleccionar si hay una carta de movimiento seleccionada", () => {
    const rerender = preparaComponenteConFiguras({});
    renderComponent(
      rerender,
      { datosJugador: { is_player_turn: true } },
      { ultimoEvento: null },
      { usarMovimiento: { cartaSeleccionada: [1, "Diagonal"] } }
    );

    const figure1 = getCard("1");
    const figure2 = getCard("2");
    const figure3 = getCard("3");
    const disabled = "opacity-25 pointer-events-none greyscale";

    act(() => {
      figure3.click();
    });
    expect(figure1).toHaveClass(disabled);
    expect(figure2).toHaveClass(disabled);
    expect(figure3).toHaveClass(disabled);
    expect(figure3).not.toHaveClass(
      "cursor-pointer shadow-[0px_0px_20px_rgba(100,200,44,1)] scale-105"
    );
  });

  it("debe limpiar la carta seleccionada si se termina su turno", () => {
    const rerender = preparaComponenteConFiguras({});

    const figure1 = getCard("1");
    const figure2 = getCard("2");
    const figure3 = getCard("3");

    act(() => {
      figure3.click();
    });
    const disabled = "opacity-25 pointer-events-none greyscale";
    expect(figure1).toHaveClass(disabled);
    expect(figure2).toHaveClass(disabled);
    expect(figure3).toHaveClass(
      "cursor-pointer shadow-[0px_0px_20px_rgba(100,200,44,1)] scale-105"
    );

    renderComponent(
      rerender,
      { datosJugador: { is_player_turn: false } },
      { ultimoEvento: null }
    );

    expect(figure1.classList.length).toEqual(0);
    expect(figure2.classList.length).toEqual(0);
    expect(figure3.classList.length).toEqual(0);
  });

  it("no debe poder seleccionar si habilitarAccionesUsuarios es false", () => {
    const mockSetCartaSeleccionada = jest.fn();
    preparaComponenteConFiguras({
      habilitarAccionesUsuario: {
        habilitarAccionesUsuario: false,
        setHabilitarAccionesUsuario: jest.fn(),
      },
    });

    const figure1 = getCard("1");
    const figure2 = getCard("2");
    const figure3 = getCard("3");
    act(() => {
      figure3.click();
    });
    const hoverClass =
      "hover:cursor-pointer hover:shadow-[0px_0px_15px_rgba(224,138,44,1)] hover:scale-105";
    expect(figure1).not.toHaveClass(hoverClass);
    expect(figure2).not.toHaveClass(hoverClass);
    expect(figure3).not.toHaveClass(hoverClass);
    expect(figure3).not.toHaveClass(
      "cursor-pointer shadow-[0px_0px_20px_rgba(100,200,44,1)] scale-105"
    );

    expect(mockSetCartaSeleccionada).not.toHaveBeenCalled();
  });
});
