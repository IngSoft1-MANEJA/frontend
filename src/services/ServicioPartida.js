import { BACKEND_URL } from "../variablesConfiguracion";

export class ServicioPartida {
  static GRUPO_ENDPOINT = "matches";

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
