import { calcularTiempoRestante } from "../services/Utilidades";
describe("Utilidades", () => {
  describe("calcularTiempoRestante", () => {
    it("debería retornar 120 segundos si el timestamp empezo hace 120 segundos", () => {
      const timestampEmpezado = new Date(Date.now()).toISOString();
      const tiempoDeDuracion = 120;
      const resultado = calcularTiempoRestante(
        timestampEmpezado,
        tiempoDeDuracion,
      );
      expect(resultado).toBe(120);
    });

    it("deberia retornar 0 si el tiempo ya se agotó", () => {
      const timestampEmpezado = new Date(Date.now() - 121000).toISOString();
      const tiempoDeDuracion = 120;
      const resultado = calcularTiempoRestante(
        timestampEmpezado,
        tiempoDeDuracion,
      );
      expect(resultado).toBe(0);
    });

    it("deberia retornar 58 si el timestamp empezo hace 2 segundos y la duracion es 60", () => {
      const timestampEmpezado = new Date(Date.now() - 2000).toISOString();
      const tiempoDeDuracion = 60;
      const resultado = calcularTiempoRestante(
        timestampEmpezado,
        tiempoDeDuracion,
      );
      expect(resultado).toBe(58);
    });

    it("deberia retornar null si el timestamp es invalido", () => {
      const timestampEmpezado = "invalido";
      const tiempoDeDuracion = 60;
      const resultado = calcularTiempoRestante(
        timestampEmpezado,
        tiempoDeDuracion,
      );
      expect(resultado).toBe(null);
    });

    it("deberia retornar null si el timestamp es en el futuro", () => {
      const timestampEmpezado = new Date(Date.now() + 2000).toISOString();
      const tiempoDeDuracion = 60;
      const resultado = calcularTiempoRestante(
        timestampEmpezado,
        tiempoDeDuracion,
      );
      expect(resultado).toBe(null);
    });
  });
});
