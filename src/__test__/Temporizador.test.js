import { render, screen, waitFor } from "@testing-library/react";
import { Temporizador } from "../containers/Game/components/Temporizador.jsx";
import { act } from "react";

describe("Temporizador", () => {
    beforeAll(() => {
      jest.useFakeTimers();
    });

    afterAll(() => {
        jest.useRealTimers();
    });
    it("deberia renderizar el componente con timer en 2 min", () => {
        render(<Temporizador />);

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
        render(<Temporizador duracion={95}/>);

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
      render(<Temporizador />);
        
      await waitFor(() => {
        expect(setInterval).toHaveBeenCalledTimes(1);
        expect(setInterval).toHaveBeenLastCalledWith(expect.any(Function), 1000);
      });
    });

    it("deberia decrementar el tiempo en 1 seg despues de 1 seg", () => {
      render(<Temporizador duracion={2} />);

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
      render(<Temporizador duracion={1} />);

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

});