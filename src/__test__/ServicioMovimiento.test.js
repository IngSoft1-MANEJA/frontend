import { ServicioPartida } from "../services/ServicioPartida";

jest.mock("../../../services/ServicioPartida");
describe("ServicioMovimiento", () => {
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