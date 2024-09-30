import React from "react";
import { useParams } from "react-router-dom";
import { AbandonarPartida } from "../../components/AbandonarPartida";

export function Game() {
  const { match_id } = useParams();

  return (
    <div className="game-div w-full h-screen m-0">
      <Tablero />
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
