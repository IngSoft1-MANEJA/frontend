import { BACKEND_URL } from "../variablesConfiguracion";
import { ServicioToken } from "./ServicioToken";

export const JugadorGanoMotivo = Object.freeze({
  NORMAL: "NORMAL",
  FORFEIT: "FORFEIT",
});

export class ServicioPartida {
  static GRUPO_ENDPOINT = "matches";

  static async unirsePartida(idPartida, nombreJugador, clave) {
    const respuesta = await fetch(
      `${BACKEND_URL}/${this.GRUPO_ENDPOINT}/${idPartida}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ player_name: nombreJugador, password: clave }),
      },
    );

    if (!respuesta.ok) {
      const error = new Error(
        `Error al unirse a partida - estado: ${respuesta.status}`,
      );
      error.status = respuesta.status;
      throw error;
    }

    const json = await respuesta.json();
    return json;
  }

  static async listarPartidas(buscarTermino = "", maximoJugadores = null) {
    const params = new URLSearchParams({});

    if (maximoJugadores !== null) {
      params.append("max_players", maximoJugadores);
    }

    console.log(params.toString());

    if (buscarTermino) {
      params.append("s", buscarTermino);
    }

    const url = `${BACKEND_URL}/${this.GRUPO_ENDPOINT}?${params}`;

    const respuesta = await fetch(url);

    if (!respuesta.ok) {
      throw new Error(`Error al listar partidas - estado: ${respuesta.status}`);
    }

    const json = await respuesta.json();
    return json.map((partida) => {
      partida.match_id = partida.id; // Asigna el match_id
      return partida;
    });
  }

  static async crearPartida(
    nombreSala,
    nombreJugador,
    cantidadJugadores,
    contraseña,
  ) {
    const respuesta = await fetch(`${BACKEND_URL}/${this.GRUPO_ENDPOINT}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        lobby_name: nombreSala,
        player_name: nombreJugador,
        max_players: cantidadJugadores,
        password: contraseña,
        token: "asdfasdf",
      }),
    });

    if (!respuesta.ok) {
      throw new Error(`Error al crear partida - estado: ${respuesta.status}`);
    }

    const json = await respuesta.json();
    return json;
  }

  static async abandonarPartida(idJugador, idPartida) {
    const respuesta = await fetch(
      `${BACKEND_URL}/${this.GRUPO_ENDPOINT}/${idPartida}/left/${idJugador}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!respuesta.ok) {
      throw new Error(
        `Error al salir de la partida - estado: ${respuesta.status}`,
      );
    }

    const json = await respuesta.json();
    return json;
  }

  static async iniciarPartida(idPartida, idJugador) {
    const respuesta = await fetch(
      `${BACKEND_URL}/${this.GRUPO_ENDPOINT}/${idPartida}/start/${idJugador}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!respuesta.ok) {
      throw new Error(`Error al iniciar partida - estado: ${respuesta.status}`);
    }

    const json = await respuesta.json();
    return json;
  }

  static async terminarTurno(idPartida, idJugador) {
    const respuesta = await fetch(
      `${BACKEND_URL}/${this.GRUPO_ENDPOINT}/${idPartida}/end-turn/${idJugador}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!respuesta.ok) {
      throw new Error(`Error al terminar turno - estado: ${respuesta.status}`);
    }

    const json = await respuesta.json();
    return json;
  }

  static async validarMovimiento(idPartida, idJudador, fichas, carta) {
    const respuesta = await fetch(
      `${BACKEND_URL}/${this.GRUPO_ENDPOINT}/${idPartida}/partial-move/${idJudador}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tiles: fichas, movement_card: carta }),
      },
    );

    if (!respuesta.ok) {
      throw new Error(
        `Error al validar movimiento - estado: ${respuesta.status}`,
      );
    }

    const json = await respuesta.json();
    return json;
  }

  static async obtenerInfoPartidaParaJugador(idPartida, idJugador) {
    const token = ServicioToken.obtenerToken(idPartida, idJugador);
    const respuesta = await fetch(
      `${BACKEND_URL}/${this.GRUPO_ENDPOINT}/${idPartida}/player/${idJugador}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!respuesta.ok) {
      throw new Error(
        `Error al obtener info de partida - estado: ${respuesta.status}`,
      );
    }

    const json = await respuesta.json();
    return json;
  }

  static async deshacerMovimientoParcial(idPartida, idJugador) {
    const respuesta = await fetch(
      `${BACKEND_URL}/${this.GRUPO_ENDPOINT}/${idPartida}/partial-move/${idJugador}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!respuesta.ok) {
      throw new Error(
        `Error al deshacer movimiento parcial - estado: ${respuesta.status}`,
      );
    }

    const json = await respuesta.json();
    return json;
  }

  static async validarMovimiento(idPartida, idJudador, fichas, carta) {
    const respuesta = await fetch(
      `${BACKEND_URL}/${this.GRUPO_ENDPOINT}/${idPartida}/partial-move/${idJudador}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tiles: fichas, movement_card: carta }),
      },
    );

    if (!respuesta.ok) {
      throw new Error(
        `Error al validar movimiento - estado: ${respuesta.status}`,
      );
    }

    const json = await respuesta.json();
    return json;
  }

  /**
   * Hace una peticion al back para completar una figura.
   *
   * @param {number} idPartida : Identificador de la partida.
   * @param {number} idJugador : Identificador del jugador.
   * @param {number} idCartaFigura : Identificador de la carta de figura.
   * @param {Array<Array<number>>} figura : Figura a completar, lista de coordenadas.
   * @returns respuesta : Respuesta de la petición.
   * @throws Error : Error en la petición.
   */
  static async completarFicha(idPartida, idJugador, idCartaFigura, figura) {
    const respuesta = await fetch(
      `${BACKEND_URL}/${this.GRUPO_ENDPOINT}/${idPartida}/player/${idJugador}/use-figure`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          figure_id: idCartaFigura,
          coordinates: figura,
        }),
      },
    );

    if (!respuesta.ok) {
      const error = new Error(
        `Error al validar movimiento - estado: ${respuesta.status}`,
      );
      error.status = respuesta.status;
      throw error;
    }

    const json = await respuesta.json();
    return json;
  }

  static async bloquearFicha(idPartida, idJugador, idCartaFigura, figura) {
    const respuesta = await fetch(
      `${BACKEND_URL}/${this.GRUPO_ENDPOINT}/${idPartida}/player/${idJugador}/block-figure`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          figure_id: idCartaFigura,
          coordinates: figura,
        }),
      },
    );

    if (!respuesta.ok) {
      const error = new Error(
        `Error al bloquear ficha - estado: ${respuesta.status}`,
      );
      error.status = respuesta.status;
      const errorBody = await respuesta.json();
      error.detail = errorBody?.detail || "Error al bloquear figura";
      throw error;
    }

    const json = await respuesta.json();
    return json;
  }
}
