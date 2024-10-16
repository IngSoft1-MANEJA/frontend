import React from "react";
import {useContext} from "react";
import {
  render,
  screen,
  act,
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
      // Simulamos que el servicio devuelve un movimiento válido
      ServicioPartida.validarMovimiento.mockResolvedValue({ isValid: true });
  
      render(
        <UsarMovimientoContext.Provider value={mockUsarMovimiento}>
          <Tablero initialTiles={Tiles} />
        </UsarMovimientoContext.Provider>
      );
  
      // Simula un clic en una ficha para seleccionar la segunda ficha

      await act(async () => {
        screen.getByTestId('ficha-1-0').click();
      }); 

      await waitFor(() => {
        expect(mockUsarMovimiento.fichasSeleccionadas).toHaveLength(2);
      });
  
      // Verificamos que setUsarMovimiento se haya llamado correctamente
      await waitFor(() => {
        expect(mockSetUsarMovimiento).toHaveBeenCalled();
      });
  
      // Comprobamos que se haya llamado al servicio con las fichas seleccionadas
      await waitFor(() => {
        expect(ServicioPartida.validarMovimiento).toHaveBeenCalledWith(
          expect.any(Number), // match_id debe ser dinámico en tu aplicación real
          [{ rowIndex: 0, columnIndex: 0 }, { rowIndex: 1, columnIndex: 0 }],
          'test'
        );
      });
  
      // Comprobamos que las fichas hayan sido intercambiadas
      expect(screen.getByTestId('ficha-0-0')).toHaveStyle('background-color: green'); // Ajusta el color según tu lógica
      expect(screen.getByTestId('ficha-1-0')).toHaveStyle('background-color: red'); // Ajusta el color según tu lógica
    });
});
