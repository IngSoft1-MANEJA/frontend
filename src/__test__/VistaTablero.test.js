import React from "react";
import {
  render,
  screen,
} from "@testing-library/react";
import { jest } from "@jest/globals";
import { Tablero } from '../containers/Game/components/Tablero.jsx';
import { Tiles, TilesError } from '../__mocks__/Tablero.mock.js';

jest.mock('../containers/Game/components/Ficha.jsx', () => ({
    Ficha: ({ color }) => <div data-testid="ficha" style={{ backgroundColor: color }}></div>,
}));

describe('VistaTablero', () => {
    const tiles = Tiles;
    const tilesError = TilesError;
  
    test('renderiza correctamente el numero de fichas', () => {
      render(<Tablero tiles={tiles} />);
      const fichaElements = screen.getAllByTestId('ficha');
      expect(fichaElements).toHaveLength(tiles.length * tiles[0].length);
    });
  
    test('renderiza componentes Ficha con los colores correctos', () => {
        render(<Tablero tiles={tiles} />);
        tiles.forEach((row, rowIndex) => {
            row.forEach((color, colIndex) => {
            const fichaItem = screen.getAllByTestId('ficha')[rowIndex * tiles[0].length + colIndex];
            expect(fichaItem).toHaveStyle(`backgroundColor: ${color}`);
            });
        });
    });
});