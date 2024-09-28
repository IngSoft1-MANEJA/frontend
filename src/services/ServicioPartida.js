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
      }
    );

    if (!respuesta.ok) {
      throw new Error(`Error al unirse a partida - estado: ${respuesta.status}`);
    }

    const json = await respuesta.json();
    return json;
  }
}