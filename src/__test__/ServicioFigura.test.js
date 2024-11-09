import { ServicioFigura } from "../services/ServicioFigura";
import { waitFor } from "@testing-library/dom";

jest.mock("../services/ServicioPartida");

afterEach(() => {
  jest.clearAllMocks();
});

describe("ServicioFigura", () => {
  describe("cartaStringName", () => {
    it("debería devolver el nombre correcto para cada carta", () => {
      expect(ServicioFigura.cartaStringName(1)).toBe("T_90");
      expect(ServicioFigura.cartaStringName(2)).toBe("INVERSE_SNAKE");
      expect(ServicioFigura.cartaStringName(7)).toBe("INVERSE_L_90");
      expect(ServicioFigura.cartaStringName(10)).toBe("Z_90");
      expect(ServicioFigura.cartaStringName(15)).toBe("TURTLE");
      expect(ServicioFigura.cartaStringName(18)).toBe("DOG");
      expect(ServicioFigura.cartaStringName(25)).toBe("MINI_L_90");
    });

    it('debería devolver "Figura no encontrada." para valores fuera del rango', () => {
      expect(ServicioFigura.cartaStringName(26)).toBe("Figura no encontrada.");
      expect(ServicioFigura.cartaStringName(0)).toBe("Figura no encontrada.");
    });
  });

  describe("repartirCartasFigura", () => {
    it("debería setear correctamente las cartas del jugador y los oponentes", () => {
      const ultimoEvento = {
        payload: [
          {
            turn_order: 1,
            shape_cards: [
              [2, "INVERSE_SNAKE"],
              [5, "DOG"],
            ],
          },
          { turn_order: 2, shape_cards: [[4, "STAIRS"]] },
        ],
      };
      const miTurno = 1;
      const cartasFiguras = [[1, "T_90"]];
      const setCartasFiguras = jest.fn();
      const setOponentes = jest.fn();
      const cartasFigurasCompletadas = [[3, "SNAKE"]];

      ServicioFigura.repartirCartasFigura(
        ultimoEvento,
        miTurno,
        cartasFiguras,
        setCartasFiguras,
        [{ turn_order: 2, shape_cards: [[3, "SNAKE"]] }],
        setOponentes,
        cartasFigurasCompletadas
      );

      expect(setCartasFiguras).toHaveBeenCalledWith([
        [1, "T_90"],
        [2, "INVERSE_SNAKE"],
        [5, "DOG"],
      ]);
      expect(setOponentes).toHaveBeenCalledWith([
        {
          turn_order: 2,
          shape_cards: [
            [3, "SNAKE"],
            [4, "STAIRS"],
          ],
        },
      ]);
    });

    it("debería mostrar un mensaje en la consola si no se encuentra un jugador con el turno especificado", () => {
      const ultimoEvento = {
        payload: [{ turn_order: 2, shape_cards: [[2, "INVERSE_SNAKE"]] }],
      };
      const miTurno = 1;
      const cartasFiguras = [[1, "T_90"]];
      const setCartasFiguras = jest.fn();
      const setOponentes = jest.fn();
      const cartasFigurasCompletadas = [[2, "INVERSE_SNAKE"]];

      console.log = jest.fn();

      ServicioFigura.repartirCartasFigura(
        ultimoEvento,
        miTurno,
        cartasFiguras,
        setCartasFiguras,
        [],
        setOponentes,
        cartasFigurasCompletadas
      );

      expect(console.log).toHaveBeenCalledWith(
        "CartasFiguras - No se encontró jugador con turn_order:",
        miTurno
      );

      expect(setCartasFiguras).not.toHaveBeenCalled();
    });
  });

  describe("ordenarOponentes", () => {
    it("debería ordenar los oponentes correctamente en base al turno del jugador", () => {
      const oponentes = [
        { turn_order: 2 },
        { turn_order: 4 },
        { turn_order: 1 },
      ];
      const maxPlayers = 4;
      const miTurno = 3;

      const resultado = ServicioFigura.ordenarOponentes(
        oponentes,
        maxPlayers,
        miTurno
      );
      expect(resultado).toEqual([
        { turn_order: 4 },
        { turn_order: 1 },
        { turn_order: 2 },
      ]);
    });
  });

  describe("claseCarta", () => {
    it('debería retornar "opacity-25 pointer-events-none greyscale" si la carta está completada', () => {
      const resultado = ServicioFigura.claseCarta(
        1,
        null,
        null,
        true,
        [1],
        true
      );
      expect(resultado).toBe("opacity-25 pointer-events-none greyscale");
    });

    it("debería retornar el efecto de hover si es el turno del jugador y la carta no está completada", () => {
      const resultado = ServicioFigura.claseCarta(
        2,
        null,
        null,
        true,
        [],
        true
      );
      expect(resultado).toContain("hover:cursor-pointer");
    });
    it("debería retornar vacío cuando habilitarAccionesUsuario sea falso", () => {
      const resultado = ServicioFigura.claseCarta(
        2,
        null,
        null,
        true,
        [],
       false 
      );
      expect(resultado).toBe("");
    });
  });

  describe("seleccionarCarta", () => {
    it("debería seleccionar la carta si es el turno del jugador y no está completada", () => {
      const setCartaSeleccionada = jest.fn();
      ServicioFigura.seleccionarCarta(
        1,
        true,
        null,
        null,
        setCartaSeleccionada,
        [],
        true
      );
      expect(setCartaSeleccionada).toHaveBeenCalledWith(1);
    });

    it("debería deseleccionar la carta si ya está seleccionada", () => {
      const setCartaSeleccionada = jest.fn();
      ServicioFigura.seleccionarCarta(
        1,
        true,
        null,
        1,
        setCartaSeleccionada,
        [],
        true
      );
      expect(setCartaSeleccionada).toHaveBeenCalledWith(null);
    });

    it("no debería seleccionar la carta si habilitarAccionesUsuario es falso", () => {
      const setCartaSeleccionada = jest.fn();
      ServicioFigura.seleccionarCarta(
        1,
        true,
        null,
        null,
        setCartaSeleccionada,
        [],
        false
      );
      expect(setCartaSeleccionada).not.toHaveBeenCalled();
    });
  });
});
