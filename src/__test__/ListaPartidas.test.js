import React from 'react';
import { render, screen, cleanup, waitFor, fireEvent} from '@testing-library/react';
import { jest } from '@jest/globals';
import { ListaPartidas } from '../components/ListaPartidas.jsx';
import Alert from '../components/Alerts.jsx';
import { ListaPartidasMock } from '../__mocks__/ListarPartidas.mock.js';




global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(ListaPartidasMock),
    })
);
  
describe('ListarPartidas', () => {

    afterEach(cleanup);
    afterEach(() => {
        jest.clearAllMocks();
    });
  
    test('debe renderizar las partidas correctamente', async () => {
        render(<ListaPartidas />);
  
        await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

        await waitFor(() => {
          ListaPartidasMock.forEach(partida => {
              expect(screen.getByText(partida.id.toString())).toBeInTheDocument();
              expect(screen.getByText(partida.nombre)).toBeInTheDocument();
              expect(screen.getByText(partida.jugadoresActuales.toString())).toBeInTheDocument();
              expect(screen.getByText(partida.jugadoresMaximos.toString())).toBeInTheDocument();
            });
        });
    });
  
    test('debe manejar errores de fetch', async () => {  
      render(<ListaPartidas />);

      fetch.mockImplementationOnce(() => Promise.reject('API is down'));
  
      await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
  
      await waitFor(() => {
        expect(screen.getByText('Error en fetch')).toBeInTheDocument();
      });
    });

    test('debe refrescar las partidas al hacer clic en el botón de refresco', async () => {
        render(<ListaPartidas />);
    
        await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    

        fireEvent.click(screen.getByText('Refrescar'));
    
        
        await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));

        await waitFor(() => {
          ListaPartidasMock.forEach(partida => {
              expect(screen.getByText(partida.id.toString())).toBeInTheDocument();
              expect(screen.getByText(partida.nombre)).toBeInTheDocument();
              expect(screen.getByText(partida.jugadoresActuales.toString())).toBeInTheDocument();
              expect(screen.getByText(partida.jugadoresMaximos.toString())).toBeInTheDocument();
          });
        });
    });
});