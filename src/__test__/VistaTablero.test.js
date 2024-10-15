import React from "react";
import {useContext} from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
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

    const mockUsarMovimiento = {
      usarMovimiento: {
        cartaHovering: false,
        fichaHovering: false,
        cartaSeleccionada: "test",
        fichasSeleccionadas: [],
        highlightCarta: { state: false, key: '' },
        cartasUsadas: [] 
      },
      setUsarMovimiento: jest.fn(),
    }

    beforeEach(() => {
      jest.clearAllMocks(); // Limpia las simulaciones antes de cada test
    });

    test('renderiza correctamente el numero de fichas', () => {
      render(
        <UsarMovimientoContext.Provider value={mockUsarMovimiento}>
          <Tablero initialTiles={tiles} />
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
          <Tablero initialTiles={tiles} />
        </UsarMovimientoContext.Provider>
      );

      tiles.forEach((row, rowIndex) => {
        row.forEach((color, columnIndex) => {
          const fichaItem = screen.getByTestId(`ficha-${rowIndex}-${columnIndex}`);
          expect(fichaItem).toHaveStyle(`background-color: ${color}`);
        });
      });
    });

    test('swapFichas se ejecuta correctamente y las fichas son intercambiadas', async () => {
      // Simulamos la respuesta de validarMovimiento
      ServicioPartida.validarMovimiento.mockResolvedValue({ isValid: true });
    
      render(
        <UsarMovimientoContext.Provider value={mockUsarMovimiento}>
          <Tablero initialTiles={tiles} />
        </UsarMovimientoContext.Provider>
      );
    
      // Encontramos las fichas para interactuar
      const ficha1 = screen.getByTestId('ficha-0-0'); // Ficha en la posición (0, 0)
      const ficha2 = screen.getByTestId('ficha-1-0'); // Ficha en la posición (0, 1)
    
      // Hacemos clic en la primera ficha
      fireEvent.click(ficha1);
      
      // Verificamos que setUsarMovimiento se haya llamado correctamente para la primera ficha
      expect(mockUsarMovimiento.setUsarMovimiento).toHaveBeenCalledWith(expect.objectContaining({
        fichasSeleccionadas: [{ rowIndex: 0, columnIndex: 0 }],
      }));
    
      // Hacemos clic en la segunda ficha para completar la selección
      fireEvent.click(ficha2);
    
      // Verificamos que se haya llamado setUsarMovimiento de nuevo
      await waitFor(() => {
        expect(mockUsarMovimiento.setUsarMovimiento).toHaveBeenCalledWith(expect.objectContaining({
          fichasSeleccionadas: [{ rowIndex: 0, columnIndex: 0 },{ rowIndex: 1, columnIndex: 0 }],
        }));
      });
    
      // Verificamos que el servicio se haya llamado correctamente
      await waitFor(() => {
        expect(ServicioPartida.validarMovimiento).toHaveBeenCalledWith(
          1, // match_id
          [{ rowIndex: 0, columnIndex: 0 }, { rowIndex: 1, columnIndex: 0 }],
          'test' // cartaSeleccionada
        );
      });
    
      // Comprobamos que las fichas hayan sido intercambiadas
      expect(screen.getByTestId('ficha-0-0')).toHaveStyle('background-color: green');
      expect(screen.getByTestId('ficha-1-0')).toHaveStyle('background-color: red'); // Debería ser rojo
    });
});
