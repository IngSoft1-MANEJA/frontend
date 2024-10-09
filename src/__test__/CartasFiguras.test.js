import React from 'react';
import { render, screen } from '@testing-library/react';
import { useParams } from 'react-router-dom';
import { useWebSocket } from 'react-use-websocket';
import { DatosJugadorContext } from '../contexts/DatosJugadorContext.jsx';
import { CartasFiguras } from '../containers/Game/components/CartasFiguras.jsx';

jest.mock('react-router-dom', () => ({
  useParams: jest.fn(),
}));

jest.mock('react-use-websocket', () => ({
  useWebSocket: jest.fn(),
}));

describe('CartasFiguras', () => {

  beforeEach(() => {
    useParams.mockReturnValue({ match_id: '1' });

    useWebSocket.mockReturnValue({
      lastJsonMessage: {
        key: 'PLAYER_RECEIVE_SHAPE_CARDS',
        payload: {
          shape_cards: [
            { id: 1, name: 1},
            { id: 2, name: 2},
            { id: 3, name: 3}
          ]
        }
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Debe renderizar correctamente las cartas del jugador cuando recibe el mensaje PLAYER_RECEIVE_SHAPE_CARDS', () => {
    const mockDatosJugador = {
      datosJugador: { player_id: '123' },
      setDatosJugador: jest.fn(),
    };

    render(
      <DatosJugadorContext.Provider value={mockDatosJugador}>
        <CartasFiguras />
      </DatosJugadorContext.Provider>
    );

    expect(screen.getByAltText('1')).toBeInTheDocument();
    expect(screen.getByAltText('2')).toBeInTheDocument();
    expect(screen.getByAltText('3')).toBeInTheDocument();
  });

  test('Debe mostrar un mensaje de error cuando el WebSocket recibe un key incorrecto', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    useWebSocket.mockReturnValue({
      lastJsonMessage: {
        key: 'INVALID_KEY',
        payload: []
      },
    });

    const mockDatosJugador = {
      datosJugador: { player_id: '123' },
      setDatosJugador: jest.fn(),
    };

    render(
      <DatosJugadorContext.Provider value={mockDatosJugador}>
        <CartasFiguras />
      </DatosJugadorContext.Provider>
    );

    expect(consoleErrorSpy).toHaveBeenCalledWith('key incorrecto recibido del websocket');

    consoleErrorSpy.mockRestore();
  });

  test('No debe renderizar cartas si no hay mensajes del WebSocket', () => {
    useWebSocket.mockReturnValue({
      lastJsonMessage: null,
    });

    const mockDatosJugador = {
      datosJugador: { player_id: '123' },
      setDatosJugador: jest.fn(),
    };

    render(
      <DatosJugadorContext.Provider value={mockDatosJugador}>
        <CartasFiguras />
      </DatosJugadorContext.Provider>
    );

    expect(screen.queryByAltText('1')).not.toBeInTheDocument();
    expect(screen.queryByAltText('2')).not.toBeInTheDocument();
    expect(screen.queryByAltText('3')).not.toBeInTheDocument();
  });
});