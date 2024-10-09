import React, { useEffect } from "react";

import { useContext } from "react";
import { useParams } from "react-router-dom";
// import { AbandonarPartida } from "../../components/AbandonarPartida";
import { DatosJugadorContext } from "../../contexts/DatosJugadorContext";
import { crearWebsocket, WebsocketEvents } from "../../services/ServicioWebsocket";
import { JugadorGanoMotivo } from "../../services/ServicioPartida";

export function Game() {
  const { datosJugador, setDatosJugador } = useContext(DatosJugadorContext);
  const { match_id } = useParams();
  const { LastJsonMessage } = crearWebsocket(match_id, datosJugador.player_id);

  useEffect(() => {
    if (LastJsonMessage !== null) {
      switch (LastJsonMessage.key) {
        case WebsocketEvents.WINNER:
          if (LastJsonMessage.payload.reason === JugadorGanoMotivo.FORFEIT) {
            setDatosJugador({ player_id: null, is_owner: false });
            setDatosPartida({ max_players: 2 });
            Navigate("/");
          }
          break;
      
        default:
          break;
      }
    }
  }, [LastJsonMessage]);

  return (
    <div>
      {/*<AbandonarPartida
        estadoPartida="STARTED"
        esAnfitrion={datosJugador.is_owner}
        idJugador={datosJugador.player_id}
        idPartida={match_id}
      />*/}
    </div>
  );
}
export default Game;
