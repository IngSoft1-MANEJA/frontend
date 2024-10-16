import React from "react";
import {useContext} from "react";
import {
  render,
  screen,
} from "@testing-library/react";
import { jest } from "@jest/globals";
import { Tablero } from '../containers/Game/components/Tablero.jsx';
import { Tiles, TilesError } from '../__mocks__/Tablero.mock.js';
import { UsarMovimientoProvider } from '../contexts/UsarMovimientoContext.jsx';
import { ServicioPartida } from "../services/ServicioPartida.js";
import { UsarMovimientoContext } from '../contexts/UsarMovimientoContext.jsx';

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({ match_id: 1 }),
}));

jest.mock('../services/ServicioPartida');

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
    const tilesError = TilesError;

    const mockSetUsarMovimiento = jest.fn();
    const initialFichasSeleccionadas = [{ rowIndex: 0, columnIndex: 0 }];
    const mockUsarMovimiento = {
      usarMovimiento: {
        fichasSeleccionadas: initialFichasSeleccionadas,
        cartaSeleccionada: 'test', // Asegúrate de tener un valor válido para la carta
      },
      setUsarMovimiento: mockSetUsarMovimiento,
    };
  
    beforeEach(() => {
      jest.clearAllMocks(); // Limpia mocks antes de cada prueba
      mockSetUsarMovimiento.mockImplementation((updater) => {
        // Simulamos el estado después de la llamada
        if (typeof updater === 'function') {
          mockUsarMovimiento.usarMovimiento.fichasSeleccionadas = updater(mockUsarMovimiento.usarMovimiento.fichasSeleccionadas);
        } else {
          mockUsarMovimiento.usarMovimiento.fichasSeleccionadas = updater;
        }
      });
    });

    test('renderiza correctamente el numero de fichas', () => {
      render(
        <UsarMovimientoContext.Provider value={mockUsarMovimiento}>
           <Tablero initialTiles={tiles} initialFigures={[]} />
        </UsarMovimientoContext.Provider>
      );
      const fichaElements = tiles.flatMap((row, rowIndex) =>
        row.map((_, columnIndex) => screen.getByTestId(`ficha-${rowIndex}-${columnIndex}`))
      );
      expect(fichaElements).toHaveLength(tiles.length * tiles[0].length);
    });

    test('renderiza componentes Ficha con los colores correctos', () => {
      render(
        <UsarMovimientoContext.Provider value={mockUsarMovimiento}>
          <Tablero initialTiles={tiles} initialFigures={[]} />
        </UsarMovimientoContext.Provider>
      );

      tiles.forEach((row, rowIndex) => {
        row.forEach((color, columnIndex) => {
          const fichaItem = screen.getByTestId(`ficha-${rowIndex}-${columnIndex}`);
          expect(fichaItem).toHaveStyle(`background-color: ${color}`);
        });
      });
    });
});
