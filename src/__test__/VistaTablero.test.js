import React from "react";
import {
  render,
  screen,
  fireEvent,
} from "@testing-library/react";
import { jest } from "@jest/globals";
import { Tablero } from "../containers/Game/components/Tablero.jsx";
import { Tiles } from "../__mocks__/Tablero.mock.js";
import { UsarMovimientoContext } from "../contexts/UsarMovimientoContext.jsx";
import { DatosJugadorContext } from "../contexts/DatosJugadorContext.jsx";
import { EventoContext } from "../contexts/EventoContext.jsx";
import { DatosPartidaContext } from "../contexts/DatosPartidaContext.jsx";
import { ServicioMovimiento } from "../services/ServicioMovimiento.js";
import {ServicioPartida} from '../services/ServicioPartida';


jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({ match_id: 1 }),
}));

jest.mock('../services/ServicioPartida');
jest.mock('../services/ServicioMovimiento');

jest.mock('../containers/Game/components/Ficha.jsx', () => ({
  Ficha: ({ id, color, onClick }) => (
    <div
      data-testid={id} 
      style={{ backgroundColor: color }} 
      onClick={onClick}
    />
  ),
}));

describe('VistaTablero', () => {
  const tiles = Tiles;
  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockUsarMovimiento = {
    usarMovimiento: {
      cartaSeleccionada: "test",
      fichasSeleccionadas: [],
      cartasUsadas: [],
      highlightCarta: { state: false, key: '' },
      movimientosPosibles: []
    },
    setUsarMovimiento: jest.fn(),
  };

  const mockEventoContext = {
    ultimoEvento: {
      key: "GET_PLAYER_MATCH_INFO",
      payload: { board: tiles },
    },
  };

  const mockDatosJugador = {
    datosJugador: { player_id: 123 },
    setDatosJugador: jest.fn(),
  };

  test('renderiza correctamente el numero de fichas', () => {
  
    render(
      <DatosJugadorContext.Provider value={mockDatosJugador}>
        <UsarMovimientoContext.Provider value={mockUsarMovimiento}>
          <EventoContext.Provider value ={mockEventoContext}>
            <Tablero />
          </EventoContext.Provider>
        </UsarMovimientoContext.Provider>
      </DatosJugadorContext.Provider>
    );

    const fichaElements = tiles.flatMap((row, rowIndex) =>
      row.map((_, columnIndex) => screen.getByTestId(`ficha-${rowIndex}-${columnIndex}`))
    );
    expect(fichaElements).toHaveLength(tiles.length * tiles[0].length);
  });

  test('renderiza componentes Ficha con los colores correctos', () => {
  
    render(
      <DatosJugadorContext.Provider value={mockDatosJugador}>
        <UsarMovimientoContext.Provider value={mockUsarMovimiento}>
          <EventoContext.Provider value ={mockEventoContext}>
            <Tablero />
          </EventoContext.Provider>
        </UsarMovimientoContext.Provider>
      </DatosJugadorContext.Provider>
    );

    tiles.forEach((row, rowIndex) => {
      row.forEach((color, columnIndex) => {
        const fichaItem = screen.getByTestId(`ficha-${rowIndex}-${columnIndex}`);
        expect(fichaItem).toHaveStyle(`background-color: ${color}`);
      });
    });
  });

  test('selecciona una ficha al hacer clic', async () => {
    render(
      <DatosJugadorContext.Provider value={mockDatosJugador}>
        <UsarMovimientoContext.Provider value={mockUsarMovimiento}>
          <EventoContext.Provider value ={mockEventoContext}>
            <Tablero />
          </EventoContext.Provider>
        </UsarMovimientoContext.Provider>
      </DatosJugadorContext.Provider>
    );
  
    const fichaElement = screen.getByTestId('ficha-0-0');
    
    fireEvent.click(fichaElement);
  
    expect(mockUsarMovimiento.setUsarMovimiento).toHaveBeenCalledTimes(1);
  
    expect(typeof mockUsarMovimiento.setUsarMovimiento.mock.calls[0][0]).toBe('function');

    const funcionActualizacion = mockUsarMovimiento.setUsarMovimiento.mock.calls[0][0];
    const nuevoEstado = funcionActualizacion(mockUsarMovimiento.usarMovimiento);
  
    expect(nuevoEstado).toEqual({
      ...mockUsarMovimiento.usarMovimiento,
      fichasSeleccionadas: [{ rowIndex: 0, columnIndex: 0 }],
    });
  });

  test('deselecciona una ficha si ya está seleccionada', () => {
    const mockUsarMovimientoConFichaSeleccionada = {
      usarMovimiento: {
        cartaSeleccionada: "test",
        fichasSeleccionadas: [{ rowIndex: 0, columnIndex: 0 }],
        cartasUsadas: [],
        highlightCarta: { state: false, key: '' },
        movimientosPosibles: [],
      },
      setUsarMovimiento: jest.fn(),
    };

    render(
      <DatosJugadorContext.Provider value={mockDatosJugador}>
        <UsarMovimientoContext.Provider value={mockUsarMovimientoConFichaSeleccionada}>
          <EventoContext.Provider value ={mockEventoContext}>
            <Tablero />
          </EventoContext.Provider>
        </UsarMovimientoContext.Provider>
      </DatosJugadorContext.Provider>
    );
    
    const ficha = screen.getByTestId(`ficha-0-0`);
    fireEvent.click(ficha);

    expect(mockUsarMovimientoConFichaSeleccionada.setUsarMovimiento).toHaveBeenCalledTimes(1);

    expect(typeof mockUsarMovimientoConFichaSeleccionada.setUsarMovimiento.mock.calls[0][0]).toBe('function');

    const funcionActualizacion = mockUsarMovimientoConFichaSeleccionada.setUsarMovimiento.mock.calls[0][0];
    const nuevoEstado = funcionActualizacion(mockUsarMovimientoConFichaSeleccionada.usarMovimiento);

    expect(nuevoEstado).toEqual({
      ...mockUsarMovimientoConFichaSeleccionada.usarMovimiento,
      fichasSeleccionadas: [],
    });
  });
});