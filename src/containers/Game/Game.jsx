import React from "react";
import { useParams } from "react-router-dom";
import { AbandonarPartida } from "../../components/AbandonarPartida";

export function Game() {
  const { match_id } = useParams();

  return (
    <div>
      <AbandonarPartida
        estadoPartida="STARTED"
        esAnfitrion={false}
        idJugador={1}
        idPartida={match_id}
      />
    </div>
  );
}
export default Game;
