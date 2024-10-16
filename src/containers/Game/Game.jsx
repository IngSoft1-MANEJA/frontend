import React from "react";
import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import useWebSocket from "react-use-websocket";
import { WEBSOCKET_URL } from "../../variablesConfiguracion.js";
import { AbandonarPartida } from "../../components/AbandonarPartida";
import { Tablero } from "./components/Tablero";
import { TerminarTurno } from "./components/TerminarTurno";
import { DatosJugadorContext } from "../../contexts/DatosJugadorContext";
import { UsarMovimientoContext } from '../../contexts/UsarMovimientoContext';
import { InformacionTurno } from "./components/InformacionTurno.jsx";
import { CartasMovimiento } from "./components/CartasMovimiento.jsx";

export function Game() {
  const { match_id } = useParams();
  const { datosJugador, setDatosJugador } = useContext(DatosJugadorContext);
  const [tiles, setTiles] = useState([]);
  const [figures, setFigures] = useState([]);
  const websocket_url = `${WEBSOCKET_URL}/matches/${match_id}/ws/${datosJugador.player_id}`;
  const { lastJsonMessage } = useWebSocket(websocket_url, { share: true });

  useEffect(() => {
    if (lastJsonMessage !== null) {
        if (lastJsonMessage.key == "START_MATCH") {
            setTiles(lastJsonMessage.payload.board);
        } else if (lastJsonMessage.key == "ALLOW_FIGURES") {
            setFigures(lastJsonMessage.payload.figures);
        } else {
            console.error("key incorrecto recibido del websocket");
        }
        }
    }, [
        lastJsonMessage,
        setTiles,
        setFigures,
  ]);

  /*
  const tiles = [
    ['red', 'red', 'green', 'yellow', 'red', 'yellow'], 
    ['green', 'blue', 'red', 'yellow', 'green', 'blue'], 
    ['red', 'yellow', 'green', 'blue', 'blue', 'yellow'], 
    ['green', 'blue', 'red', 'yellow', 'green', 'blue'], 
    ['red', 'yellow', 'green', 'yellow', 'red', 'green'], 
    ['green', 'blue', 'blue', 'yellow', 'green', 'blue']
  ];*/

  /*
  const figures = [
    [[0, 0], [0, 1], [0, 2]],
    [[1, 5], [2, 5], [3, 5]],
    [[5, 0], [5, 1], [5, 2]],
  ];*/ 

  return (
    <div className="game-div relative w-full h-screen m-0">
      <CartasMovimiento />
      <Tablero 
        initialTiles={tiles}
        initialFigures={figures}
      />
      <InformacionTurno player_id={datosJugador.player_id}/>
      <TerminarTurno/>
      <AbandonarPartida
        estadoPartida="STARTED"
        esAnfitrion={datosJugador.is_owner}
        idJugador={datosJugador.player_id}
        idPartida={match_id}
      />
    </div>
  );
}
export default Game;