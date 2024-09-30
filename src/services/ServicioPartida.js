import { BACKEND_URL } from "../variablesConfiguracion";

export class ServicioPartida {
  static GRUPO_ENDPOINT = "matches";

  static async unirsePartida(idPartida, nombreJugador) {
    const respuesta = await fetch(
      `${BACKEND_URL}/${this.GRUPO_ENDPOINT}/${idPartida}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ player_name: nombreJugador }),
      },
    );

    if (!respuesta.ok) {
      throw new Error(
        `Error al unirse a partida - estado: ${respuesta.status}`,
      );
    }

    const json = await respuesta.json();
    return json;
  }

  static async listarPartidas() {
    const respuesta = await fetch(`${BACKEND_URL}/${this.GRUPO_ENDPOINT}`);

    if (!respuesta.ok) {
      throw new Error(`Error al listar partidas - estado: ${respuesta.status}`);
    }

    let json = await respuesta.json();
    json.match_id = json.id;
    return json;
  }

  static async crearPartida(nombreSala, nombreJugador, cantidadJugadores) {
    const respuesta = await fetch(`${BACKEND_URL}/${this.GRUPO_ENDPOINT}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        match_name: nombreSala,
        player_name: nombreJugador,
        max_players: cantidadJugadores,
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
}
