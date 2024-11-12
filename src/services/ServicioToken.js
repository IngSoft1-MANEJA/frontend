import { ServicioLocalStorage } from "./ServicioLocalStorage";
/**
 * Servicio para guardar, obtener y eliminar tokens de partidas
 * en el localStorage.
 */
export class ServicioToken {
  /**
   * Obtiene el token correspondiente al id de la partida y jugador.
   * @param {Int | String} idPartida id de la partida a la que pertenece el token.
   * @param {Int | String} idJugador id del jugador al que pertenece el token.
   * @returns token correspondiente al id de la partida o undefined si no existe.
   */
  static obtenerToken(idPartida, idJugador) {
    const tokens = ServicioLocalStorage.obtener_objeto("tokens");
    const tokenPartida = tokens.find(
      (token) => token.idPartida == idPartida && token.idJugador == idJugador,
    );

    if (tokenPartida) {
      return tokenPartida.token;
    }

    return undefined;
  }

  /**
   * Guarda el token de la partida y jugador en el localStorage.
   * @param {Int | String} idPartida id de la partida a la que pertenece el token.
   * @param {Int | String} idJugador id del jugador al que pertenece el token.
   * @param {String} token Token de la partida a guardar.
   */
  static guardarToken(idPartida, idJugador, token) {
    const tokens = ServicioLocalStorage.obtener_objeto("tokens") || [];
    const tokenPartida = tokens.find(
      (token) => token.idPartida == idPartida && token.idJugador == idJugador,
    );
    if (tokenPartida) {
      tokenPartida.token = token;
    } else {
      tokens.push({
        idPartida: idPartida,
        idJugador: idJugador,
        token: token,
      });
    }
    ServicioLocalStorage.guardar_objeto("tokens", tokens);
  }

}
