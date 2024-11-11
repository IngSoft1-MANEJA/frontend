import { ServicioLocalStorage } from "./ServicioLocalStorage";

export class ServicioDatosPartida {

    static obtenerDatosPartida(idPartida, idJugador) {
        const partidas = ServicioLocalStorage.obtener_objeto("datosPartidas");
        const partida = partidas.find(
            (partida) => partida.idPartida == idPartida && partida.idJugador == idJugador
        );

        if (partida) {
            return partida;
        }

        return undefined;
    }

    static guardarDatosPartida(idPartida, idJugador, datosPartida) {
        const partidas = ServicioLocalStorage.obtener_objeto("datosPartidas") || [];
        const partida = partidas.find(
            (partida) => partida.idPartida == idPartida && partida.idJugador == idJugador
        );
        if (partida) {
            partida.datosPartida = datosPartida;
        } else {
            partidas.push({
                idPartida: idPartida,
                idJugador: idJugador,
                datosPartida: datosPartida,
            });
        }
        ServicioLocalStorage.guardar_objeto("datosPartidas", partidas);
    }
}