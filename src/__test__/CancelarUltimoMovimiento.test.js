import {
  act,
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import CancelarUltimoMovimiento from "../containers/Game/components/CancelarUltimoMovimiento";
import { DatosJugadorContext } from "../contexts/DatosJugadorContext";
import { UsarMovimientoContext } from "../contexts/UsarMovimientoContext";
import { EventoContext } from "../contexts/EventoContext";
import { TilesContext } from "../contexts/tilesContext";
import { BrowserRouter } from "react-router-dom";
import { ServicioMovimiento } from "../services/ServicioMovimiento";
import { FigurasContext } from "../contexts/FigurasContext";
import { CompletarFiguraProvider } from "../contexts/CompletarFiguraContext";
import { HabilitarAccionesUsuarioContext } from "../contexts/habilitarAccionesUsuarioContext";

const mockDatosJugador = {
  is_player_turn: true,
  player_id: "123",
};

const mockFiguras = {
  historial: [],
  figuras_actuales: [],
};

const mockUsarMovimiento = {
  cartasUsadas: ["A", "B", "C"],
  cartasCompletadas: 0,
  setUsarMovimiento: jest.fn(),
};

const mockTiles = {
  tiles: [],
  setTiles: jest.fn(),
};

const mockDeshacerFiguras = jest.fn();

const mockAgregarFiguras = jest.fn();

const mockHabilitarAccionesUsuario = {
  habilitarAccionesUsuario: true,
  setHabilitarAccionesUsuario: jest.fn(),
};

afterEach(() => {
  jest.clearAllMocks();
});

describe("CancelarUltimoMovimiento", () => {
  const renderComponent = (
    datosJugador = mockDatosJugador,
    usarMovimiento = mockUsarMovimiento,
    ultimoEvento = null,
    tiles = mockTiles,
    figuras = mockFiguras,
    agregarFiguras = mockAgregarFiguras,
    deshacerFiguras = mockDeshacerFiguras,
    habilitarAccionesUsuario = mockHabilitarAccionesUsuario,
  ) => {
    return render(
      <BrowserRouter>
        <FigurasContext.Provider
          value={{ figuras, agregarFiguras, deshacerFiguras }}
        >
          <DatosJugadorContext.Provider value={{ datosJugador }}>
            <UsarMovimientoContext.Provider value={{ usarMovimiento }}>
              <EventoContext.Provider value={{ ultimoEvento }}>
                <TilesContext.Provider
                  value={{ tiles: tiles.tiles, setTiles: tiles.setTiles }}
                >
                  <CompletarFiguraProvider>
                    <HabilitarAccionesUsuarioContext.Provider value={habilitarAccionesUsuario}>
                      <CancelarUltimoMovimiento />
                    </HabilitarAccionesUsuarioContext.Provider>
                  </CompletarFiguraProvider>
                </TilesContext.Provider>
              </EventoContext.Provider>
            </UsarMovimientoContext.Provider>
          </DatosJugadorContext.Provider>
        </FigurasContext.Provider>
      </BrowserRouter>
    );
  };

  it("debería mostrar el boton de deshacer movimiento", () => {
    renderComponent();
    const boton = screen.getByText("deshacer movimiento");
    expect(boton).toBeInTheDocument();
  });

  it("debería estar deshabilitado el boton si no es el turno del jugador", () => {
    const datosJugador = {
      ...mockDatosJugador,
      is_player_turn: false,
    };
    renderComponent(datosJugador);
    const boton = screen.getByRole("button");
    expect(boton).toBeDisabled();
  });

  it("debería estar deshabilitado si es el turno del jugador y no hay cartas usadas", () => {
    const datosUsarMovimiento = {
      ...mockUsarMovimiento,
      cartasUsadas: [],
    };
    renderComponent(mockDatosJugador, datosUsarMovimiento);
    const boton = screen.getByRole("button");
    expect(boton).toBeDisabled();
  });

  it("debería estar deshabilitado si habilitarAccionesUsuario es falso", () => {
    renderComponent(
      mockDatosJugador,
      mockUsarMovimiento,
      null,
      mockTiles,
      mockFiguras,
      mockAgregarFiguras,
      mockDeshacerFiguras,
      {
        habilitarAccionesUsuario: false,
        setHabilitarAccionesUsuario: jest.fn(),
      }
    );
    const boton = screen.getByRole("button");
    expect(boton).toBeDisabled();
  });

  it("debería llamar a deshacerMovimiento cuando se hace clic y es el turno del jugador", async () => {
    const spy = jest.spyOn(ServicioMovimiento, "deshacerMovimiento");
    spy.mockImplementation(() => {});
    renderComponent();
    const boton = screen.getByRole("button");
    fireEvent.click(boton);

    await waitFor(() => {
      expect(spy).toHaveBeenCalled();
    });
  });

  it("no debería llamar a deshacerMovimiento cuando se hace clic y no es el turno del jugador", async () => {
    const spy = jest.spyOn(ServicioMovimiento, "deshacerMovimiento");
    spy.mockImplementation(() => {});
    const datosJugador = {
      ...mockDatosJugador,
      is_player_turn: false,
    };
    renderComponent(datosJugador);
    const boton = screen.getByRole("button");
    fireEvent.click(boton);

    await waitFor(() => {
      expect(spy).not.toHaveBeenCalled();
    });
  });

  it("debería mostrar la alerta", () => {
    const spy = jest.spyOn(ServicioMovimiento, "deshacerMovimiento");
    spy.mockImplementation(
      (
        match_id,
        player_id,
        setUsarMovimiento,
        setMensajeAlerta,
        setMostrarAlerta,
        tiles,
        setTiles,
      ) => {
        setMostrarAlerta(true);
        setMensajeAlerta("Error de test");
      },
    );
    renderComponent();
    const boton = screen.getByRole("button");

    act(() => {
      fireEvent.click(boton);
    });

    const alerta = screen.getByText("Error de test");
    expect(alerta).toBeInTheDocument();
  });

  it("deberia llamar a swapFichas si el evento es UNDO_PARTIAL_MOVE", () => {
    const mockTiles = {
      tiles: [],
      setTiles: jest.fn(),
    };
    const mockEvento = {
      key: "UNDO_PARTIAL_MOVE",
      payload: {
        tiles: [
          { rowIndex: 0, columnIndex: 0 },
          { rowIndex: 0, columnIndex: 1 },
        ],
      },
    };
    const spy = jest.spyOn(ServicioMovimiento, "swapFichas");
    spy.mockImplementation(() => {});

    renderComponent(
      mockDatosJugador,
      mockUsarMovimiento,
      mockEvento,
      mockTiles,
    );

    expect(spy).toHaveBeenCalledWith(
      mockEvento.payload.tiles,
      mockTiles.tiles,
      mockTiles.setTiles,
    );
  });
});
