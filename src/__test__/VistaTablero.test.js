import React from "react";
import {
  render,
  screen,
  fireEvent,
} from "@testing-library/react";
import { jest } from "@jest/globals";
import { Tablero } from '../containers/Game/components/Tablero.jsx';
import { Ficha } from '../containers/Game/components/Ficha.jsx';
import { Tiles, TilesError } from '../__mocks__/Tablero.mock.js';
import { UsarMovimientoProvider, UsarMovimientoContext } from "../contexts/UsarMovimientoContext.jsx";
import { waitFor } from "@testing-library/dom";
import { ServicioPartida } from "../services/ServicioPartida.js";

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

    afterEach(() => {
      jest.clearAllMocks();
    });
  
    test('renderiza correctamente el numero de fichas', () => {
      render(
        <UsarMovimientoContext.Provider value={mockUsarMovimiento}>
          <Tablero tiles={tiles} />
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
          <Tablero tiles={tiles} />
        </UsarMovimientoContext.Provider>
      );

      tiles.forEach((row, rowIndex) => {
        row.forEach((color, columnIndex) => {
          const fichaItem = screen.getByTestId(`ficha-${rowIndex}-${columnIndex}`);
          expect(fichaItem).toHaveStyle(`background-color: ${color}`);
        });
      });
    });

    test('selecciona una ficha al hacer clic', () => {

      render(
        <UsarMovimientoContext.Provider value={mockUsarMovimiento}>
          <Tablero tiles={tiles} />
        </UsarMovimientoContext.Provider>
      );

      const fichaElement = screen.getByTestId('ficha-0-0');
      
      fireEvent.click(fichaElement);
    
      expect(mockUsarMovimiento.setUsarMovimiento).toHaveBeenCalledWith({
        ...mockUsarMovimiento.usarMovimiento,
        fichasSeleccionadas: [{ rowIndex: 0, columnIndex: 0 }],
      });
    });

    test('deselecciona una ficha si ya está seleccionada', () => {
      mockUsarMovimiento.usarMovimiento.fichasSeleccionadas = [{ rowIndex: 0, columnIndex: 0 }];
      
      render(
        <UsarMovimientoContext.Provider value={mockUsarMovimiento}>
          <Tablero tiles={tiles} />
        </UsarMovimientoContext.Provider>
      );
      
      const ficha = screen.getByTestId(`ficha-0-0`);
      fireEvent.click(ficha);

      expect(mockUsarMovimiento.setUsarMovimiento).toHaveBeenCalledWith({
        ...mockUsarMovimiento.usarMovimiento,
        fichasSeleccionadas: [],
      });
    });

    test('Debe actualizar el estado correctamente cuando el movimiento es válido', async () => {
      const mockUsarMovimiento = {
        usarMovimiento: {
          cartaSeleccionada: 'test',
          fichasSeleccionadas: [],
          cartasUsadas: [],
          highlightCarta: { state: false, key: '' },
        },
        setUsarMovimiento: jest.fn(),
      };
    
      jest.spyOn(ServicioPartida, 'validarMovimiento').mockResolvedValueOnce({
        isValid: true,
      });

      render(
        <UsarMovimientoContext.Provider value={mockUsarMovimiento}>
          <Tablero tiles={tiles} />
        </UsarMovimientoContext.Provider>
      );

      const ficha1 = screen.getByTestId('ficha-0-0');
      const ficha2 = screen.getByTestId('ficha-0-1');

      fireEvent.click(ficha1);
      fireEvent.click(ficha2);

      await waitFor(() => {
        expect(ServicioPartida.validarMovimiento).toHaveBeenCalledWith(
          1,
          [{ rowIndex: 0, columnIndex: 0 }, { rowIndex: 0, columnIndex: 1 }],
          "test"
        );

        expect(mockUsarMovimiento.setUsarMovimiento).toHaveBeenCalledWith({
          ...mockUsarMovimiento.usarMovimiento,
          fichasSeleccionadas: [],
          cartaSeleccionada: null,
          cartasUsadas: [...mockUsarMovimiento.usarMovimiento.cartasUsadas, mockUsarMovimiento.usarMovimiento.cartaSeleccionada],
          highlightCarta: { state: false, key: '' },
        });
      });
    });

});