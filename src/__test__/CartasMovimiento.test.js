import React from 'react';
import { render, screen } from '@testing-library/react';
import { useParams } from 'react-router-dom';
import { useWebSocket } from 'react-use-websocket';
import { DatosJugadorContext } from '../contexts/DatosJugadorContext.jsx';
import CartasMovimiento from '../containers/Game/components/cartasMovimiento.jsx';

// Mockeando los hooks que utiliza el componente
jest.mock('react-router-dom', () => ({
  useParams: jest.fn(),
}));

jest.mock('react-use-websocket', () => ({
  useWebSocket: jest.fn(),
}));

describe('CartasMovimiento', () => {
  
  beforeEach(() => {
    useParams.mockReturnValue({ match_id: '1' });
    
    useWebSocket.mockReturnValue({
      lastJsonMessage: {
        key: 'GET_MOVEMENT_CARD',
        payload: {
            movement_card :[
                { id: 1, name: 'DIAGONAL', type: 'someType' },
                { id: 2, name: 'INVERSE_DIAGONAL', type: 'someType' },
                { id: 3, name: 'LINE', type: 'someType' }
            ]
        }
        },
    });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

  test('Debe renderizar correctamente las cartas del jugador cuando recibe el mensaje GET_MOVEMENT_CARD', () => {
    const mockDatosJugador = {
        datosJugador: { player_id: '123' },
        setDatosJugador: jest.fn(),
    };

    render(<DatosJugadorContext.Provider value={mockDatosJugador}>
            <CartasMovimiento />
            </DatosJugadorContext.Provider>);    

    expect(screen.getByAltText('DIAGONAL')).toBeInTheDocument();
    expect(screen.getByAltText('INVERSE_DIAGONAL')).toBeInTheDocument();
    expect(screen.getByAltText('LINE')).toBeInTheDocument();
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
        <CartasMovimiento />
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
        <CartasMovimiento />
      </DatosJugadorContext.Provider>
    );
  
    expect(screen.queryByAltText('DIAGONAL')).not.toBeInTheDocument();
    expect(screen.queryByAltText('INVERSE_DIAGONAL')).not.toBeInTheDocument();
    expect(screen.queryByAltText('LINE')).not.toBeInTheDocument();
  });

  test('Debe renderizar correctamente las cartas cuando recibe el mensaje START_MATCH', () => {
    useWebSocket.mockReturnValue({
      lastJsonMessage: {
        key: 'START_MATCH',
        payload: {
          movement_cards: [
            { id: 1, name: 'LINE', type: 'someType' },
            { id: 2, name: 'LINE_BORDER', type: 'someType' },
          ]
        },
      },
    });
  
    const mockDatosJugador = {
      datosJugador: { player_id: '123' },
      setDatosJugador: jest.fn(),
    };
  
    render(
      <DatosJugadorContext.Provider value={mockDatosJugador}>
        <CartasMovimiento />
      </DatosJugadorContext.Provider>
    );
  
    expect(screen.getByAltText('LINE')).toBeInTheDocument();
    expect(screen.getByAltText('LINE_BORDER')).toBeInTheDocument();
  });

});