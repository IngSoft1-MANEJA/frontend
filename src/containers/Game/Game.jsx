import React from "react";
import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { WEBSOCKET_URL } from "../../variablesConfiguracion.js";
import { AbandonarPartida } from "../../components/AbandonarPartida";
import { Tablero } from "./components/Tablero";
import { TerminarTurno } from "./components/TerminarTurno";
import { DatosJugadorContext } from "../../contexts/DatosJugadorContext";
import { InformacionTurno } from "./components/InformacionTurno.jsx";
import { CartasFiguras } from "./components/CartasFiguras";
import { CartasMovimiento } from "./components/CartasMovimiento";
import { EventoContext } from "../../contexts/EventoContext";
import { ServicioPartida } from "../../services/ServicioPartida.js";
import { flushSync } from "react-dom";

export function Game() {
  const { match_id } = useParams();
  const { datosJugador, setDatosJugador } = useContext(DatosJugadorContext);
  const [tiles, setTiles] = useState([]);
  const websocket_url = `${WEBSOCKET_URL}/matches/${match_id}/ws/${datosJugador.player_id}`;
  const { lastMessage, readyState } = useWebSocket(websocket_url, {
    share: true,
    onClose: () => console.log("Websocket - Game: conexión cerrada."),
    onError: (event) => console.error("Websocket - Game: error: ", event),
    onOpen: () => console.log("Websocket - Game: conexión abierta."),
  });
  const { ultimoEvento, setUltimoEvento } = useContext(EventoContext);

  useEffect(() => {
    flushSync(() => {
      setUltimoEvento((prev) => {
        const newEvent = lastMessage
          ? JSON.parse(lastMessage.data)
          : lastMessage;
        return newEvent;
      });
    });
  }, [lastMessage]);

  useEffect(() => {
    if (readyState === ReadyState.OPEN) {
      try {
        ServicioPartida.obtenerInfoPartidaParaJugador(
          match_id,
          datosJugador.player_id,
        );
      } catch (error) {
        console.error(error);
      }
    }
  }, [readyState]);

  useEffect(() => {
    if (ultimoEvento !== null) {
      if (ultimoEvento.key === "GET_PLAYER_MATCH_INFO") {
        setTiles(ultimoEvento.payload.board);
        setDatosJugador({
          ...datosJugador,
          player_turn: ultimoEvento.payload.turn_order,
        });
      }
    }
  }, [ultimoEvento]);

  return (
    <div className="game-div relative w-full h-screen m-0">
      <CartasMovimiento />
      <Tablero 
        initialTiles={tiles}
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
