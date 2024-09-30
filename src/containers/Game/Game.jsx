import React from "react";
import { useParams } from "react-router-dom";
import { AbandonarPartida } from "../../components/AbandonarPartida";
import { Tablero } from "./components/Tablero";

export function Game() {
  const { match_id } = useParams();
  const tiles = [
    'red', 'red', 'green', 'yellow', 'red', 'yellow', 
    'green', 'blue', 'red', 'yellow', 'green', 'blue', 
    'red', 'yellow', 'green', 'blue', 'blue', 'yellow', 
    'green', 'blue', 'red', 'yellow', 'green', 'blue', 
    'red', 'yellow', 'green', 'yellow', 'red', 'green', 
    'green', 'blue', 'blue', 'yellow', 'green', 'blue'
  ];

  return (
    <div className="game-div w-full h-screen m-0">
      <Tablero tiles={tiles}/>
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
