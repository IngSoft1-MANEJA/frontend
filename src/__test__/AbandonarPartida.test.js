import React from "react";
import {
  render,
  screen,
  fireEvent,
  cleanup,
  waitFor,
} from "@testing-library/react";
import { AbandonarPartida } from "../containers/App/components/AbandonarPartida";
import {
  Started,
  WaitingAnfitrion,
  WaitingNoAnfitrion,
  Error,
} from "../__mocks__/AbandonarPartida.mock";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  }),
);

describe("AbandonarPartida", () => {
  afterEach(cleanup);

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("debe habilitar el boton de abandonar cuando la partida esta en curso", async () => {
    render(<AbandonarPartida {...Started} />);
    const boton = await screen.findByText("Abandonar");
    expect(boton).not.toBeDisabled();
  });

  test("debe habilitar el botón de abandonar cuando la partida está en espera y el jugador no es anfitrión", async () => {
    render(<AbandonarPartida {...WaitingNoAnfitrion} />);
    const boton = await screen.findByText("Abandonar");
    expect(boton).not.toBeDisabled();
  });

  test("debe deshabilitar el botón de abandonar cuando la partida está en espera y el jugador es anfitrión", async () => {
    render(<AbandonarPartida {...WaitingAnfitrion} />);
    const boton = await screen.findByText("Abandonar");
    expect(boton).toBeDisabled();
  });

  test("debe fallar cuando el estado de la partida es diferente de WAITING o STARTED", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    render(<AbandonarPartida {...Error} />);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Estado de partida no permitido",
    );
    expect(screen.queryByText("Abandonar")).toBeNull();
    consoleErrorSpy.mockRestore();
  });

  test("AbandonarPartida se ejecuta correctamente", async () => {
    render(<AbandonarPartida {...Started} />);
    const boton = await screen.findByText("Abandonar");
    expect(boton).not.toBeDisabled();
    fireEvent.click(boton);
    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledTimes(1);
    });
  });
});
