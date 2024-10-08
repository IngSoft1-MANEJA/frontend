import React from "react";
import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import useWebSocket from "react-use-websocket";
import { WEBSOCKET_URL } from "../../variablesConfiguracion.js";
import { AbandonarPartida } from "../../components/AbandonarPartida";
import { Tablero } from "./components/Tablero";
import { DatosJugadorContext } from "../../contexts/DatosJugadorContext";

export function Game() {
  const { match_id } = useParams();
  const { datosJugador, setDatosJugador } = useContext(DatosJugadorContext);
  const [tiles, setTiles] = useState([]);
  const websocket_url = `${WEBSOCKET_URL}/${match_id}/ws/${datosJugador.player_id}`;
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

  return (
    <div className="game-div relative w-full h-screen m-0">
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
