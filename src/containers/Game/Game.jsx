import React from "react";
import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import useWebSocket from "react-use-websocket";
import { WEBSOCKET_URL } from "../../variablesConfiguracion.js";
import { AbandonarPartida } from "../../components/AbandonarPartida";
import { Tablero } from "./components/Tablero";
import { TerminarTurno } from "./components/TerminarTurno";
import { DatosJugadorContext } from "../../contexts/DatosJugadorContext";
import { InformacionTurno } from "./components/InformacionTurno.jsx";
import { EventoContext } from "../../contexts/EventoContext";

export function Game() {
  const { match_id } = useParams();
  const { datosJugador, setDatosJugador } = useContext(DatosJugadorContext);
  const [tiles, setTiles] = useState([]);
  const websocket_url = `${WEBSOCKET_URL}/matches/${match_id}/ws/${datosJugador.player_id}`;
  const { lastJsonMessage } = useWebSocket(websocket_url, { share: true });
  const { ultimoEvento, setUltimoEvento } = useContext(EventoContext);

  useEffect(() => {
    setUltimoEvento(lastJsonMessage);
  }, [lastJsonMessage]);

  useEffect(() => {
    console.log("Game: mounted");
    return () => {
      console.log("Game: unmounted");
    }
  }, []);

  useEffect(() => {
    if (ultimoEvento !== null) {
      console.log("Game: ultimoEvento ", ultimoEvento);
      if (ultimoEvento.key == "START_MATCH") {
        console.log("recibio start match");
        setTiles(ultimoEvento.payload.board);
      } else {
        console.error("key incorrecto recibido del websocket", ultimoEvento?.key);
      }
    }
  }, [ultimoEvento]);

  return (
    <div className="game-div relative w-full h-screen m-0">
      <InformacionTurno player_id={datosJugador.player_id} />
      <TerminarTurno />
      <Tablero tiles={tiles} />
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
