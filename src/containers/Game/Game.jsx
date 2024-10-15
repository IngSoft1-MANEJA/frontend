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
import { ServicioPartida } from "../../services/ServicioPartida.js";

export function Game() {
  const { match_id } = useParams();
  const { datosJugador, setDatosJugador } = useContext(DatosJugadorContext);
  const [tiles, setTiles] = useState([]);
  const websocket_url = `${WEBSOCKET_URL}/matches/${match_id}/ws/${datosJugador.player_id}`;
  const { lastJsonMessage } = useWebSocket(websocket_url, {
    share: true,
    onClose: () => console.log("Websocket - Game: conexión cerrada."),
    onMessage: (message) => console.log("Websocket - Game: mensaje recibido: ", message),
    onError: (event) => console.error("Websocket - Game: error: ", event),
    onOpen: () => console.log("Websocket - Game: conexión abierta."),
  });
  const { ultimoEvento, setUltimoEvento } = useContext(EventoContext);

  useEffect(() => {
    console.log("Game: lastJsonMessage ", lastJsonMessage);
    setUltimoEvento(lastJsonMessage);
  }, [lastJsonMessage]);

  useEffect(() => {
    console.log("Game: mounted");
    try {
      ServicioPartida.obtenerInfoPartidaParaJugador(
        match_id,
        datosJugador.player_id
      );
    } catch (error) {
      console.error(error);
    }

    return () => {
      console.log("Game: unmounted");
    }
  }, []);

  useEffect(() => {
    if (ultimoEvento !== null) {
      console.log("Game: ultimoEvento ", ultimoEvento);
      if (ultimoEvento.key == "GET_PLAYER_MATCH_INFO") {
        console.log("recibio get player match info");
        setTiles(ultimoEvento.payload.board);
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
