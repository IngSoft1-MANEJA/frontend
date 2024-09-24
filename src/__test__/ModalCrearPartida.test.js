import React from 'react';
import { render, screen, fireEvent, cleanup, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { jest } from '@jest/globals';
import { ModalCrearPartida } from '../containers/App/components/ModalCrearPartida.jsx';
import { ModalCrearPartidaMock, ModalCrearPartidaMockError } from '../__mocks__/ModalCrearPartidaForm.mock.js';

// const mockedUsedNavigate = jest.fn();

// jest.mock('react-router', async () => {
//   const actualReactRouterDom = await import('react-router-dom');
//   return {
//     ...actualReactRouterDom,
//     useNavigate: () => mockedUsedNavigate,
//   };
// });

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  })
);

describe('ModalCrearPartida', () => {

  beforeAll(() => {
    HTMLDialogElement.prototype.showModal = jest.fn();
    HTMLDialogElement.prototype.close = jest.fn();
  });

  afterEach(cleanup);
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders ModalCrearPartida component', () => {
      render(<ModalCrearPartida />);
      expect(screen.getByText('Create match lobby')).toBeInTheDocument();
  });

  test('opens the modal correctly after clicking the button', () => {
    render(<ModalCrearPartida />);

    const openButton = screen.getByText('Create match lobby');
    fireEvent.click(openButton);

    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();
  });

  test('closes the modal correctly after clicking the close button', () => {
    render(<ModalCrearPartida />);

    const openButton = screen.getByText('Create match lobby');
    fireEvent.click(openButton);

    const closeButton = screen.getByText('✕');
    fireEvent.click(closeButton);

    expect(HTMLDialogElement.prototype.close).toHaveBeenCalled();
  });

  test('inputs get cleared after closing the modal', async () => {
    render(<ModalCrearPartida />);

    const openButton = screen.getByText('Create match lobby');
    fireEvent.click(openButton);

    const playerNameInput = screen.getByLabelText('playerName');
    const lobbyNameInput = screen.getByLabelText('lobbyName');
    const playerAmountInput = screen.getByLabelText('playerAmount');

    await userEvent.type(playerNameInput, ModalCrearPartidaMock.playerName);
    await userEvent.type(lobbyNameInput, ModalCrearPartidaMock.lobbyName);
    await userEvent.type(playerAmountInput, ModalCrearPartidaMock.playerAmount);

    await waitFor(() => {
      expect(playerNameInput).toHaveValue(ModalCrearPartidaMock.playerName);
      expect(lobbyNameInput).toHaveValue(ModalCrearPartidaMock.lobbyName);
      expect(playerAmountInput).toHaveValue(ModalCrearPartidaMock.playerAmount);
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
    render(<ModalCrearPartida />);

    const openButton = screen.getByText('Create match lobby');
    fireEvent.click(openButton);

    const playerNameInput = screen.getByLabelText('playerName');
    const lobbyNameInput = screen.getByLabelText('lobbyName');
    const playerAmountInput = screen.getByLabelText('playerAmount');
    const submitButton = screen.getByText('Create lobby');

    await userEvent.type(playerNameInput, ModalCrearPartidaMockError.playerName);
    await userEvent.type(lobbyNameInput, ModalCrearPartidaMockError.lobbyName);
    await userEvent.type(playerAmountInput, ModalCrearPartidaMockError.playerAmount);

    await waitFor(() => {
      expect(playerNameInput).toHaveValue(ModalCrearPartidaMockError.playerName);
      expect(lobbyNameInput).toHaveValue(ModalCrearPartidaMockError.lobbyName);
      expect(playerAmountInput).toHaveValue(ModalCrearPartidaMockError.playerAmount);
    });

    fireEvent.click(submitButton);

    expect(fetch).not.toHaveBeenCalled();
  });

  test('fetch is executed without issues and returns expected value', async () => {
    const mockFetch = {
      playerName: ModalCrearPartidaMock.playerName,
      lobbyName: ModalCrearPartidaMock.lobbyName,
      playerAmount: ModalCrearPartidaMock.playerAmount,
    };

    render(<ModalCrearPartida />);

    const openButton = screen.getByText('Create match lobby');
    fireEvent.click(openButton);

    const playerNameInput = screen.getByLabelText('playerName');
    const lobbyNameInput = screen.getByLabelText('lobbyName');
    const playerAmountInput = screen.getByLabelText('playerAmount');
    const submitButton = screen.getByText('Create lobby');

    expect(playerNameInput).toHaveValue('');
    expect(lobbyNameInput).toHaveValue('');
    expect(playerAmountInput).toHaveValue(''); 

    await userEvent.type(playerNameInput, ModalCrearPartidaMock.playerName);
    await userEvent.type(lobbyNameInput, ModalCrearPartidaMock.lobbyName);
    await userEvent.type(playerAmountInput, ModalCrearPartidaMock.playerAmount);

    await waitFor(() => {
      expect(playerNameInput).toHaveValue(ModalCrearPartidaMock.playerName);
      expect(lobbyNameInput).toHaveValue(ModalCrearPartidaMock.lobbyName);
      expect(playerAmountInput).toHaveValue(ModalCrearPartidaMock.playerAmount);
    });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'https://httpbin.org/post',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            playerName: ModalCrearPartidaMock.playerName,
            lobbyName: ModalCrearPartidaMock.lobbyName,
            playerAmount: ModalCrearPartidaMock.playerAmount,
          }),
        })
      );
    });

  });

});