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
  const websocket_url = `${WEBSOCKET_URL}/matches/${match_id}/ws/${datosJugador.player_id}`;
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
      <CartasMovimiento />
      <Tablero 
        tiles={tiles}
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