import { setupServer } from "msw/node";
import { HttpResponse, http } from "msw";
import { BACKEND_URL } from "../variablesConfiguracion";
import { cleanup } from "@testing-library/react";
import { ServicioPartida } from "../services/ServicioPartida";

const server = setupServer(
  http.post(`${BACKEND_URL}/matches/:id`, () => {
    return HttpResponse.json({ success: true }, { status: 200 });
  }),
);

beforeAll(() => {
  server.listen({ onUnhandledRequest: "error" });
});
afterEach(() => {
  jest.clearAllMocks();
  server.resetHandlers();
  cleanup();
});
afterAll(() => server.close());
describe("ServicioPartida", () => {
  it("deberia hacer un request al url de unirse a partida correctamente", async () => {
    const respuesta = await ServicioPartida.unirsePartida(2, "Jugador 1");
    expect(respuesta).toEqual({ success: true });
  });

  it("deberia lanzar un error si el request falla", async () => {
    server.use(
      http.post(`${BACKEND_URL}/matches/:id`, (req, res, ctx) => {
        return HttpResponse.json(null, { status: 500 });
      }),
    );

    await expect(ServicioPartida.unirsePartida(2, "Jugador 1")).rejects.toThrow(
      "Error al unirse a partida - estado: 500",
    );
  });
});
