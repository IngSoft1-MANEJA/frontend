import React from 'react';
import { render, screen, fireEvent, cleanup, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { jest } from '@jest/globals';
import { CrearPartida } from '../containers/App/components/CrearPartida.jsx';
import { CrearPartidaMock, CrearPartidaMockError } from '../__mocks__/CrearPartidaForm.mock.js';
import * as reactRouterDom from 'react-router-dom';

const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  })
);

describe('CrearPartida', () => {

  beforeAll(() => {
    HTMLDialogElement.prototype.showModal = jest.fn();
    HTMLDialogElement.prototype.close = jest.fn();
  });

  afterEach(cleanup);
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders CrearPartida component', () => {
    render(
      <reactRouterDom.MemoryRouter>
        <CrearPartida />
      </reactRouterDom.MemoryRouter>
    );
      expect(screen.getByText('Create match lobby')).toBeInTheDocument();
  });

  test('opens the modal correctly after clicking the button', () => {
    render(
      <reactRouterDom.MemoryRouter>
        <CrearPartida />
      </reactRouterDom.MemoryRouter>
    );

    const openButton = screen.getByText('Create match lobby');
    fireEvent.click(openButton);

    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();
  });

  test('closes the modal correctly after clicking the close button', () => {
    render(
      <reactRouterDom.MemoryRouter>
        <CrearPartida />
      </reactRouterDom.MemoryRouter>
    );

    const openButton = screen.getByText('Create match lobby');
    fireEvent.click(openButton);

    const closeButton = screen.getByText('✕');
    fireEvent.click(closeButton);

    expect(HTMLDialogElement.prototype.close).toHaveBeenCalled();
  });

  test('inputs get cleared after closing the modal', async () => {
    render(
      <reactRouterDom.MemoryRouter>
        <CrearPartida />
      </reactRouterDom.MemoryRouter>
    );

    const openButton = screen.getByText('Create match lobby');
    fireEvent.click(openButton);

    const playerNameInput = screen.getByLabelText('playerName');
    const lobbyNameInput = screen.getByLabelText('lobbyName');
    const playerAmountInput = screen.getByLabelText('playerAmount');

    await userEvent.type(playerNameInput, CrearPartidaMock.playerName);
    await userEvent.type(lobbyNameInput, CrearPartidaMock.lobbyName);
    await userEvent.type(playerAmountInput, CrearPartidaMock.playerAmount);

    await waitFor(() => {
      expect(playerNameInput).toHaveValue(CrearPartidaMock.playerName);
      expect(lobbyNameInput).toHaveValue(CrearPartidaMock.lobbyName);
      expect(playerAmountInput).toHaveValue(CrearPartidaMock.playerAmount);
    });

    const closeButton = screen.getByText('✕');
    fireEvent.click(closeButton);

    expect(HTMLDialogElement.prototype.close).toHaveBeenCalled();

    fireEvent.click(openButton);

    expect(playerNameInput).toHaveValue('');
    expect(lobbyNameInput).toHaveValue('');
    expect(playerAmountInput).toHaveValue('');
  });

  test('fetch is not called when input values are incorrect', async () => {
    render(
      <reactRouterDom.MemoryRouter>
        <CrearPartida />
      </reactRouterDom.MemoryRouter>
    );

    const openButton = screen.getByText('Create match lobby');
    fireEvent.click(openButton);

    const playerNameInput = screen.getByLabelText('playerName');
    const lobbyNameInput = screen.getByLabelText('lobbyName');
    const playerAmountInput = screen.getByLabelText('playerAmount');
    const submitButton = screen.getByText('Create lobby');

    await userEvent.type(playerNameInput, CrearPartidaMockError.playerName);
    await userEvent.type(lobbyNameInput, CrearPartidaMockError.lobbyName);
    await userEvent.type(playerAmountInput, CrearPartidaMockError.playerAmount);

    await waitFor(() => {
      expect(playerNameInput).toHaveValue(CrearPartidaMockError.playerName);
      expect(lobbyNameInput).toHaveValue(CrearPartidaMockError.lobbyName);
      expect(playerAmountInput).toHaveValue(CrearPartidaMockError.playerAmount);
    });

    fireEvent.click(submitButton);

    expect(fetch).not.toHaveBeenCalled();
  });

  test('fetch is executed without issues and returns expected value', async () => {
    const mockFetch = {
      playerName: CrearPartidaMock.playerName,
      lobbyName: CrearPartidaMock.lobbyName,
      playerAmount: CrearPartidaMock.playerAmount,
    };

    render(
      <reactRouterDom.MemoryRouter>
        <CrearPartida />
      </reactRouterDom.MemoryRouter>
    );

    const openButton = screen.getByText('Create match lobby');
    fireEvent.click(openButton);

    const playerNameInput = screen.getByLabelText('playerName');
    const lobbyNameInput = screen.getByLabelText('lobbyName');
    const playerAmountInput = screen.getByLabelText('playerAmount');
    const submitButton = screen.getByText('Create lobby');

    expect(playerNameInput).toHaveValue('');
    expect(lobbyNameInput).toHaveValue('');
    expect(playerAmountInput).toHaveValue(''); 

    await userEvent.type(playerNameInput, CrearPartidaMock.playerName);
    await userEvent.type(lobbyNameInput, CrearPartidaMock.lobbyName);
    await userEvent.type(playerAmountInput, CrearPartidaMock.playerAmount);

    await waitFor(() => {
      expect(playerNameInput).toHaveValue(CrearPartidaMock.playerName);
      expect(lobbyNameInput).toHaveValue(CrearPartidaMock.lobbyName);
      expect(playerAmountInput).toHaveValue(CrearPartidaMock.playerAmount);
    });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        '/matches',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            playerName: CrearPartidaMock.playerName,
            lobbyName: CrearPartidaMock.lobbyName,
            playerAmount: CrearPartidaMock.playerAmount,
          }),
        })
      );
    });
  });

});