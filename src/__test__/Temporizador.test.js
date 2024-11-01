import { render, screen, waitFor } from "@testing-library/react";
import { Temporizador } from "../containers/Game/components/Temporizador.jsx";
import { act } from "react";
import { EventoContext, EventoProvider } from "../contexts/EventoContext.jsx";
import { WebsocketEvents } from "../services/ServicioWebsocket.js";

describe("Temporizador", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });
  it("deberia renderizar el componente con timer en 2 min", () => {
    render(
      <EventoProvider>
        <Temporizador />
      </EventoProvider>,
    );

    const minutos = screen.queryByText("min");
    const segundos = screen.queryByText("seg");

    expect(minutos).toBeInTheDocument();
    expect(segundos).toBeInTheDocument();

    const minutosTexto = minutos.firstChild.firstChild;
    const segundosTexto = segundos.firstChild.firstChild;

    expect(minutosTexto).toHaveStyle("--value: 2");
    expect(segundosTexto).toHaveStyle("--value: 0");
  });

  it("deberia renderizar componente con timer en 1 min 35 seg", () => {
    render(
      <EventoProvider>
        <Temporizador duracion={95} />
      </EventoProvider>,
    );

    const minutos = screen.queryByText("min");
    const segundos = screen.queryByText("seg");

    expect(minutos).toBeInTheDocument();
    expect(segundos).toBeInTheDocument();

    const minutosTexto = minutos.firstChild.firstChild;
    const segundosTexto = segundos.firstChild.firstChild;

    expect(minutosTexto).toHaveStyle("--value: 1");
    expect(segundosTexto).toHaveStyle("--value: 35");
  });

  it("deberia decrementar el tiempo en 1 seg", async () => {
    jest.spyOn(global, "setInterval");
    render(
      <EventoProvider>
        <Temporizador />
      </EventoProvider>,
    );

    await waitFor(() => {
      expect(setInterval).toHaveBeenCalledTimes(1);
      expect(setInterval).toHaveBeenLastCalledWith(expect.any(Function), 1000);
    });
  });

  it("deberia decrementar el tiempo en 1 seg despues de 1 seg", () => {
    render(
      <EventoProvider>
        <Temporizador duracion={2} />
      </EventoProvider>,
    );

    const minutos = screen.queryByText("min");
    const segundos = screen.queryByText("seg");

    expect(minutos).toBeInTheDocument();
    expect(segundos).toBeInTheDocument();

    const minutosTexto = minutos.firstChild.firstChild;
    const segundosTexto = segundos.firstChild.firstChild;

    expect(minutosTexto).toHaveStyle("--value: 0");
    expect(segundosTexto).toHaveStyle("--value: 2");

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(minutosTexto).toHaveStyle("--value: 0");
    expect(segundosTexto).toHaveStyle("--value: 1");
  });

  it("deberia detener el timer en 0 seg", () => {
    render(
      <EventoProvider>
        <Temporizador duracion={1} />
      </EventoProvider>,
    );

    const minutos = screen.queryByText("min");
    const segundos = screen.queryByText("seg");

    expect(minutos).toBeInTheDocument();
    expect(segundos).toBeInTheDocument();

    const minutosTexto = minutos.firstChild.firstChild;
    const segundosTexto = segundos.firstChild.firstChild;

    expect(minutosTexto).toHaveStyle("--value: 0");
    expect(segundosTexto).toHaveStyle("--value: 1");

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(minutosTexto).toHaveStyle("--value: 0");
    expect(segundosTexto).toHaveStyle("--value: 0");

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(minutosTexto).toHaveStyle("--value: 0");
    expect(segundosTexto).toHaveStyle("--value: 0");
  });

  it("deberia re renderizar donde quedo en el ultimo render", () => {
    const { rerender } = render(
      <EventoProvider>
        <Temporizador />
      </EventoProvider>,
    );

    const minutos = screen.queryByText("min");
    const segundos = screen.queryByText("seg");

    expect(minutos).toBeInTheDocument();
    expect(segundos).toBeInTheDocument();

    const minutosTexto = minutos.firstChild.firstChild;
    const segundosTexto = segundos.firstChild.firstChild;

    expect(minutosTexto).toHaveStyle("--value: 2");
    expect(segundosTexto).toHaveStyle("--value: 0");

    act(() => {
      jest.advanceTimersByTime(10000);
    });

    expect(minutosTexto).toHaveStyle("--value: 1");
    expect(segundosTexto).toHaveStyle("--value: 50");

    rerender(
      <EventoProvider>
        <Temporizador />
      </EventoProvider>,
    );

    act(() => {
      jest.advanceTimersByTime(10000);
    });

    const nuevoMinutos = screen.queryByText("min");
    const nuevoSegundos = screen.queryByText("seg");
    const nuevoMinutosTexto = nuevoMinutos.firstChild.firstChild;
    const nuevoSegundosTexto = nuevoSegundos.firstChild.firstChild;

    expect(nuevoMinutosTexto).toHaveStyle("--value: 1");
    expect(nuevoSegundosTexto).toHaveStyle("--value: 40");
  });

  it("deberia reiniciar el timer cuando se recibe evento de fin de turno", () => {
    const mockEndOfTurn = {
      ultimoEvento: {
        key: WebsocketEvents.END_PLAYER_TURN,
        payload: {},
      },
    };
    const { rerender } = render(
      <EventoProvider>
        <Temporizador />
      </EventoProvider>,
    );

    const minutos = screen.queryByText("min");
    const segundos = screen.queryByText("seg");

    expect(minutos).toBeInTheDocument();
    expect(segundos).toBeInTheDocument();

    const minutosTexto = minutos.firstChild.firstChild;
    const segundosTexto = segundos.firstChild.firstChild;

    expect(minutosTexto).toHaveStyle("--value: 2");
    expect(segundosTexto).toHaveStyle("--value: 0");

    act(() => {
      jest.advanceTimersByTime(10000);
    });

    expect(minutosTexto).toHaveStyle("--value: 1");
    expect(segundosTexto).toHaveStyle("--value: 50");

    rerender(
      <EventoContext.Provider value={mockEndOfTurn}>
        <Temporizador />
      </EventoContext.Provider>,
    );

    const nuevoMinutos = screen.queryByText("min");
    const nuevoSegundos = screen.queryByText("seg");
    const nuevoMinutosTexto = nuevoMinutos.firstChild.firstChild;
    const nuevoSegundosTexto = nuevoSegundos.firstChild.firstChild;

    expect(nuevoMinutosTexto).toHaveStyle("--value: 2");
    expect(nuevoSegundosTexto).toHaveStyle("--value: 0");
  });
});
