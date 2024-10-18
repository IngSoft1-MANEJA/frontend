import { ServicioPartida } from "../services/ServicioPartida";
import { ServicioMovimiento } from "../services/ServicioMovimiento";

jest.mock("../services/ServicioPartida");

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

  it("deberia deshacer el movimiento parcial", () => {
    // Arrange
    const idPartida = 1;
    const idJugador = 2;
    const setUsarMovimiento = jest.fn().mockImplementation((fn) => {
      fn({ cartasUsadas: ["diagnoal", "L"] });
    });
    const setMostrarAlerta = jest.fn();
    const setMensajeAlerta = jest.fn();
    ServicioPartida.mockReturnValue({
      deshacerMovimientoParcial: jest
        .fn()
        .mockResolvedValue({ payload: { movement_card: [1, "diagonal"] } }),
    });

    ServicioMovimiento.deshacerMovimiento(
      idPartida,
      idJugador,
      setUsarMovimiento,
      setMostrarAlerta,
      setMensajeAlerta,
    );

    expect(ServicioPartida.deshacerMovimientoParcial).toHaveBeenCalled();
    expect(setUsarMovimiento).toHaveBeenCalled();
    expect(setMostrarAlerta).not.toHaveBeenCalled();
    expect(setMensajeAlerta).not.toHaveBeenCalled();
  });
});
