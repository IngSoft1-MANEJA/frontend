import React from "react";
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useWebSocket from "react-use-websocket";
import { WEBSOCKET_URL } from "../../variablesConfiguracion.js";
import { AbandonarPartida } from "../../components/AbandonarPartida";
import { Tablero } from "./components/Tablero";

export function Game() {
  const { match_id, player_id } = useParams();
  const [tiles, setTiles] = useState([]);
  const websocket_url = `${WEBSOCKET_URL}/${match_id}/ws/${player_id}`;
  const { lastJsonMessage } = useWebSocket(websocket_url, { share: true });

  useEffect(() => {
    if (lastJsonMessage !== null) {
        if (lastJsonMessage.key == "START_MATCH") {
            setTiles(lastJsonMessage.payload.board);
        } else {
            console.error("key incorrecto recibido del websocket");
        }
        }
    }, [
        lastJsonMessage,
        setTiles,
  ]);

  // const tiles = [
  //   ['red', 'red', 'green', 'yellow', 'red', 'yellow'], 
  //   ['green', 'blue', 'red', 'yellow', 'green', 'blue'], 
  //   ['red', 'yellow', 'green', 'blue', 'blue', 'yellow'], 
  //   ['green', 'blue', 'red', 'yellow', 'green', 'blue'], 
  //   ['red', 'yellow', 'green', 'yellow', 'red', 'green'], 
  //   ['green', 'blue', 'blue', 'yellow', 'green', 'blue']
  // ];

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
