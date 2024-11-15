import { ServicioPartida } from "../services/ServicioPartida";
import { ServicioMovimiento } from "../services/ServicioMovimiento";
import { waitFor } from "@testing-library/dom";

jest.mock("../services/ServicioPartida");

afterEach(() => {
  jest.clearAllMocks();
});

describe("ServicioMovimiento", () => {
  describe("calcularMovimientos", () => {
    test('debería calcular movimientos posibles para la carta "Diagonal"', () => {
      const movimientos = ServicioMovimiento.calcularMovimientos(
        2,
        2,
        "Diagonal",
      );
      expect(movimientos).toEqual([
        [0, 0],
        [0, 4],
        [4, 0],
        [4, 4],
      ]);
    });

    test('debería calcular movimientos posibles para la carta "Line Between"', () => {
      const movimientos = ServicioMovimiento.calcularMovimientos(
        2,
        2,
        "Line Between",
      );
      expect(movimientos).toEqual([
        [0, 2],
        [4, 2],
        [2, 0],
        [2, 4],
      ]);
    });

    test('debería calcular movimientos posibles para la carta "Line"', () => {
      const movimientos = ServicioMovimiento.calcularMovimientos(2, 2, "Line");
      expect(movimientos).toEqual([
        [1, 2],
        [3, 2],
        [2, 1],
        [2, 3],
      ]);
    });

    test('debería calcular movimientos posibles para la carta "Inverse Diagonal"', () => {
      const movimientos = ServicioMovimiento.calcularMovimientos(
        2,
        2,
        "Inverse Diagonal",
      );
      expect(movimientos).toEqual([
        [1, 1],
        [1, 3],
        [3, 1],
        [3, 3],
      ]);
    });

    test('debería calcular movimientos posibles para la carta "L"', () => {
      const movimientos = ServicioMovimiento.calcularMovimientos(2, 2, "L");
      expect(movimientos).toEqual([
        [4, 3],
        [1, 4],
        [3, 0],
        [0, 1],
      ]);
    });

    test('debería calcular movimientos posibles para la carta "Inverse L"', () => {
      const movimientos = ServicioMovimiento.calcularMovimientos(
        2,
        2,
        "Inverse L",
      );
      expect(movimientos).toEqual([
        [0, 3],
        [4, 1],
        [1, 0],
        [3, 4],
      ]);
    });

    test('debería calcular movimientos posibles para la carta "Line Border"', () => {
      const movimientos = ServicioMovimiento.calcularMovimientos(
        2,
        2,
        "Line Border",
      );
      expect(movimientos).toEqual([
        [0, 2],
        [2, 0],
        [2, 5],
        [5, 2],
      ]);
    });

    test("debería devolver un array vacío si se pasa una carta desconocida", () => {
      const movimientos = ServicioMovimiento.calcularMovimientos(
        2,
        2,
        "Carta Desconocida",
      );
      expect(movimientos).toEqual([]);
    });
  });

  describe("swapFichas", () => {
    beforeAll(() => {
      jest.useFakeTimers(); //Simula temporizadores
    });

    test("debería intercambiar dos fichas correctamente", () => {
      const tiles = [
        ["A", "B", "C"],
        ["D", "E", "F"],
        ["G", "H", "I"],
      ];

      const fichasSeleccionadas = [
        { rowIndex: 0, columnIndex: 0 },
        { rowIndex: 1, columnIndex: 1 },
      ];

      const setTilesMock = jest.fn();
      const setUsarMovimientoMock = jest.fn();

      document.getElementById = jest.fn().mockImplementation((id) => ({
        classList: {
          add: jest.fn(),
          remove: jest.fn(),
        },
      }));

      ServicioMovimiento.swapFichas(
        fichasSeleccionadas,
        tiles,
        setTilesMock,
        setUsarMovimientoMock,
      );

      jest.runAllTimers();

      expect(setTilesMock).toHaveBeenCalledWith([
        ["E", "B", "C"],
        ["D", "A", "F"],
        ["G", "H", "I"],
      ]);
    });

    afterAll(() => {
      jest.useRealTimers(); // Restablece los temporizadores reales
    });
  });

  describe("deshacerMovimiento", () => {
    it("deberia deshacer el movimiento parcial", async () => {
      const idPartida = 1;
      const idJugador = 2;
      const setUsarMovimiento = jest.fn();
      setUsarMovimiento.mockImplementation((fn) => {
        const nuevasCartas = fn({
          cartasUsadas: [
            [1, "diagonal"],
            [2, "diagonal"],
            [3, "L"],
          ],
        });
        expect(nuevasCartas).toEqual({
          cartasUsadas: [
            [1, "diagonal"],
            [3, "L"],
          ],
        });
      });
      const setMostrarAlerta = jest.fn();
      const setMensajeAlerta = jest.fn();
      const tiles = [["red"]];
      const setTiles = jest.fn();

      const deshacerMovimientoParcial = jest.spyOn(
        ServicioPartida,
        "deshacerMovimientoParcial",
      );

      deshacerMovimientoParcial.mockResolvedValue({
        movement_card: [2, "diagonal"],
        tiles: [["green"]],
      });

      const swapFichas = jest.spyOn(ServicioMovimiento, "swapFichas");
      swapFichas.mockReturnValue(null);

      ServicioMovimiento.deshacerMovimiento(
        idPartida,
        idJugador,
        setUsarMovimiento,
        setMostrarAlerta,
        setMensajeAlerta,
        tiles,
        setTiles,
      );

      await waitFor(() => {
        expect(ServicioPartida.deshacerMovimientoParcial).toHaveBeenCalledWith(
          idPartida,
          idJugador,
        );
        expect(setUsarMovimiento).toHaveBeenCalled();
        expect(swapFichas).toHaveBeenCalledWith([["green"]], tiles, setTiles);
        expect(setMostrarAlerta).not.toHaveBeenCalled();
        expect(setMensajeAlerta).not.toHaveBeenCalled();
      });
    });

    it("deberia mostrar una alerta si falla al deshacer el movimiento", async () => {
      const idPartida = 1;
      const idJugador = 2;
      const setUsarMovimiento = jest.fn();
      const setMostrarAlerta = jest.fn();
      const setMensajeAlerta = jest.fn();
      const tiles = [["red"]];
      const setTiles = jest.fn();

      const deshacerMovimientoParcial = jest.spyOn(
        ServicioPartida,
        "deshacerMovimientoParcial",
      );

      deshacerMovimientoParcial.mockRejectedValue(new Error("Error"));

      ServicioMovimiento.deshacerMovimiento(
        idPartida,
        idJugador,
        setUsarMovimiento,
        setMensajeAlerta,
        setMostrarAlerta,
        tiles,
        setTiles,
      );

      await waitFor(() => {
        expect(ServicioPartida.deshacerMovimientoParcial).toHaveBeenCalledWith(
          idPartida,
          idJugador,
        );
        expect(setUsarMovimiento).not.toHaveBeenCalled();
        expect(setMostrarAlerta).toHaveBeenCalledWith(true);
        expect(setMensajeAlerta).toHaveBeenCalledWith(
          "Error al deshacer movimiento",
        );
      });
    });
  });

  describe("obtenerFiguraDeFicha", () => {
    it("deberia devolver la figura a la que pertenece la ficha", () => {
      const figuras = [
        [
          [0, 0],
          [0, 1],
        ],
        [
          [1, 0],
          [1, 1],
        ],
      ];

      const figura = ServicioMovimiento.obtenerFiguraDeFicha(1, 0, figuras);

      expect(figura).toEqual([
        [1, 0],
        [1, 1],
      ]);
    });

    it("deberia devolver undefined si la ficha no pertenece a ninguna figura", () => {
      const figuras = [
        [
          [0, 0],
          [0, 1],
        ],
        [
          [1, 0],
          [1, 1],
        ],
      ];

      const figura = ServicioMovimiento.obtenerFiguraDeFicha(2, 2, figuras);

      expect(figura).toBeUndefined();
    });
  });
});
