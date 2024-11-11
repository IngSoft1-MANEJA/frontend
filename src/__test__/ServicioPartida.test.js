import { setupServer } from "msw/node";
import { HttpResponse, http } from "msw";
import { BACKEND_URL } from "../variablesConfiguracion";
import { cleanup } from "@testing-library/react";
import { ServicioPartida } from "../services/ServicioPartida";

const server = setupServer(
  http.post(`${BACKEND_URL}/matches/:id`, () => {
    return HttpResponse.json({ success: true }, { status: 200 });
  }),
  http.get(`${BACKEND_URL}/matches`, () => {
    return HttpResponse.json([{ id: 1, name: "Partida 1" }], { status: 200 });
  }),
  http.post(`${BACKEND_URL}/matches`, () => {
    return HttpResponse.json({ id: 1, name: "Partida 1" }, { status: 200 });
  }),
  http.patch(`${BACKEND_URL}/matches/:id/start/:playerId`, () => {
    return HttpResponse.json({ started: true }, { status: 200 });
  }),
  http.delete(`${BACKEND_URL}/matches/:id/left/:playerId`, () => {
    return HttpResponse.json({ success: true }, { status: 200 });
  }),
  http.patch(`${BACKEND_URL}/matches/:idPartida/end-turn/:idJugador`, () => {
    return HttpResponse.json({ success: true });
  }),
  http.post(`${BACKEND_URL}/matches/:idPartida/partial-move/:idJugador`, () => {
    const tiles = [{ x: 1, y: 2 }];
    const movement_card = "card1";
    if (!tiles || !movement_card) {
      return HttpResponse.json(null, { status: 400 });
    }
    return HttpResponse.json({ valid: true });
  }),
  http.get(`${BACKEND_URL}/matches/:idPartida/player/:idJugador`, () => {
    return HttpResponse.json({ playerData: { name: "Jugador 1", score: 100 } });
  }),
  http.delete(
    `${BACKEND_URL}/matches/:idPartida/partial-move/:idJugador`,
    () => {
      return HttpResponse.json({ undone: true });
    },
  ),
  http.post(
    `${BACKEND_URL}/matches/:idPartida/player/:idJugador/use-figure`,
    () => {
      const figure_id = 123;
      const coordinates = [
        [1, 1],
        [2, 2],
      ];
      if (!figure_id || !coordinates) {
        return HttpResponse.json(null, { status: 400 });
      }
      return HttpResponse.json({ completed: true });
    },
  ),
  http.post(
    `${BACKEND_URL}/matches/:idPartida/player/:idJugador/block-figure`,
    () => {
      const figure_id = 123;
      const coordinates = [
        [1, 1],
        [2, 2],
      ];
      if (!figure_id || !coordinates) {
        return HttpResponse.json(null, { status: 400 });
      }
      return HttpResponse.json({ completed: true });
    },
  ),
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

  it("debería listar las partidas correctamente", async () => {
    const partidas = await ServicioPartida.listarPartidas();
    expect(partidas).toEqual([{ id: 1, match_id: 1, name: "Partida 1" }]);
  });

  it("debería lanzar un error si falla al listar partidas", async () => {
    server.use(
      http.get(`${BACKEND_URL}/matches`, (req, res, ctx) => {
        return res(ctx.status(500));
      }),
    );

    await expect(ServicioPartida.listarPartidas()).rejects.toThrow(
      "Error al listar partidas - estado: 500",
    );
  });

  it("debería crear una partida correctamente", async () => {
    const respuesta = await ServicioPartida.crearPartida(
      "Partida 1",
      "Jugador 1",
      4,
    );
    expect(respuesta).toEqual({ id: 1, name: "Partida 1" });
  });

  it("debería lanzar un error si falla al crear una partida", async () => {
    server.use(
      http.post(`${BACKEND_URL}/matches`, (req, res, ctx) => {
        return res(ctx.status(500));
      }),
    );

    await expect(
      ServicioPartida.crearPartida("Sala 1", "Jugador 1", 4),
    ).rejects.toThrow("Error al crear partida - estado: 500");
  });

  it("debería iniciar una partida correctamente", async () => {
    const respuesta = await ServicioPartida.iniciarPartida(1, 1);
    expect(respuesta).toEqual({ started: true });
  });

  it("debería lanzar un error si falla al iniciar una partida", async () => {
    server.use(
      http.patch(
        `${BACKEND_URL}/matches/:id/start/:playerId`,
        (req, res, ctx) => {
          return res(ctx.status(500));
        },
      ),
    );

    await expect(ServicioPartida.iniciarPartida(1, 1)).rejects.toThrow(
      "Error al iniciar partida - estado: 500",
    );
  });

  it("debería permitir a un jugador abandonar una partida correctamente", async () => {
    const respuesta = await ServicioPartida.abandonarPartida(1, 2);
    expect(respuesta).toEqual({ success: true });
  });

  it("debería lanzar un error si falla al abandonar una partida", async () => {
    server.use(
      http.delete(
        `${BACKEND_URL}/matches/:id/left/:playerId`,
        (req, res, ctx) => {
          return res(ctx.status(500));
        },
      ),
    );

    await expect(ServicioPartida.abandonarPartida(1, 2)).rejects.toThrow(
      "Error al salir de la partida - estado: 500",
    );
  });

  it("debería terminar el turno correctamente", async () => {
    const response = await ServicioPartida.terminarTurno(1, 2);
    expect(response).toEqual({ success: true });
  });

  it("debería lanzar un error si falla al terminar el turno", async () => {
    server.use(
      http.patch(
        `${BACKEND_URL}/matches/:idPartida/end-turn/:idJugador`,
        () => {
          return HttpResponse.json(null, { status: 500 });
        },
      ),
    );
    await expect(ServicioPartida.terminarTurno(1, 2)).rejects.toThrow(
      "Error al terminar turno - estado: 500",
    );
  });

  it("debería validar el movimiento correctamente", async () => {
    const response = await ServicioPartida.validarMovimiento(
      1,
      2,
      [{ x: 1, y: 2 }],
      "card1",
    );
    expect(response).toEqual({ valid: true });
  });

  it("debería lanzar un error si falla al validar el movimiento", async () => {
    server.use(
      http.post(
        `${BACKEND_URL}/matches/:idPartida/partial-move/:idJugador`,
        () => {
          return HttpResponse.json(null, { status: 500 });
        },
      ),
    );
    await expect(
      ServicioPartida.validarMovimiento(1, 2, [{ x: 1, y: 2 }], "card1"),
    ).rejects.toThrow("Error al validar movimiento - estado: 500");
  });

  it("debería obtener información del jugador correctamente", async () => {
    const response = await ServicioPartida.obtenerInfoPartidaParaJugador(1, 2);
    expect(response).toEqual({ playerData: { name: "Jugador 1", score: 100 } });
  });

  it("debería lanzar un error si falla al obtener la información del jugador", async () => {
    server.use(
      http.get(`${BACKEND_URL}/matches/:idPartida/player/:idJugador`, () => {
        return HttpResponse.json(null, { status: 500 });
      }),
    );
    await expect(
      ServicioPartida.obtenerInfoPartidaParaJugador(1, 2),
    ).rejects.toThrow("Error al obtener info de partida - estado: 500");
  });

  it("debería deshacer el movimiento parcial correctamente", async () => {
    const response = await ServicioPartida.deshacerMovimientoParcial(1, 2);
    expect(response).toEqual({ undone: true });
  });

  it("debería lanzar un error si falla al deshacer el movimiento parcial", async () => {
    server.use(
      http.delete(
        `${BACKEND_URL}/matches/:idPartida/partial-move/:idJugador`,
        () => {
          return HttpResponse.json(null, { status: 500 });
        },
      ),
    );
    await expect(
      ServicioPartida.deshacerMovimientoParcial(1, 2),
    ).rejects.toThrow("Error al deshacer movimiento parcial - estado: 500");
  });

  it("debería completar una figura correctamente", async () => {
    const response = await ServicioPartida.completarFicha(1, 2, 123, [
      [1, 1],
      [2, 2],
    ]);
    expect(response).toEqual({ completed: true });
  });

  it("debería lanzar un error si falla al completar una figura", async () => {
    server.use(
      http.post(
        `${BACKEND_URL}/matches/:idPartida/player/:idJugador/use-figure`,
        () => {
          return HttpResponse.json(null, { status: 500 });
        },
      ),
    );
    await expect(
      ServicioPartida.completarFicha(1, 2, 123, [
        [1, 1],
        [2, 2],
      ]),
    ).rejects.toThrow("Error al validar movimiento - estado: 500");
  });

  it("debería bloquear una figura correctamente", async () => {
    const response = await ServicioPartida.bloquearFicha(1, 2, 123, [
      [1, 1],
      [2, 2],
    ]);
    expect(response).toEqual({ completed: true });
  });

  it("debería lanzar un error si falla al bloquear una figura", async () => {
    server.use(
      http.post(
        `${BACKEND_URL}/matches/:idPartida/player/:idJugador/block-figure`,
        () => {
          return HttpResponse.json(null, { status: 500 });
        },
      ),
    );
    await expect(
      ServicioPartida.bloquearFicha(1, 2, 123, [
        [1, 1],
        [2, 2],
      ]),
    ).rejects.toThrow("Error al bloquear ficha - estado: 500");
  });
});
