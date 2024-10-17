import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { flushSync } from "react-dom";
import useWebSocket, { ReadyState } from "react-use-websocket";

import { WEBSOCKET_URL } from "../../variablesConfiguracion.js";
import { AbandonarPartida } from "../../components/AbandonarPartida";
import { Tablero } from "./components/Tablero";
import { TerminarTurno } from "./components/TerminarTurno";
import { DatosJugadorContext } from "../../contexts/DatosJugadorContext";
import { UsarMovimientoProvider } from '../../contexts/UsarMovimientoContext';
import { InformacionTurno } from "./components/InformacionTurno.jsx";
import { CartasFiguras } from "./components/CartasFiguras";
import { CartasMovimiento } from "./components/CartasMovimiento";
import { EventoContext } from "../../contexts/EventoContext";
import { ServicioPartida } from "../../services/ServicioPartida.js";
import { WebsocketEvents } from "../../services/ServicioWebsocket";
import { JugadorGanoMotivo } from "../../services/ServicioPartida";
import ModalGanaste from "./components/ModalGanaste.jsx";
import { DatosPartidaContext } from "../../contexts/DatosPartidaContext.jsx";

export function Game() {
  const { match_id } = useParams();
  const { datosJugador, setDatosJugador } = useContext(DatosJugadorContext);
  const { datosPartida, setDatosPartida } = useContext(DatosPartidaContext);

  const [tiles, setTiles] = useState([]);
  const [mensajeGanador, setMensajeGanador] = useState("");
  const [mostrarModalGanador, setMostrarModalGanador] = useState(false);
  const websocket_url = `${WEBSOCKET_URL}/matches/${match_id}/ws/${datosJugador.player_id}`;
  const navigate = useNavigate();
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
      } else if (ultimoEvento.key === WebsocketEvents.WINNER) {
        setMostrarModalGanador(true);
        if (ultimoEvento.payload.reason === JugadorGanoMotivo.FORFEIT) {
          setMensajeGanador(
            "¡Ganaste!, todos los demás jugadores han abandonado la partida.",
          );
        }
      }
    }
  }, [ultimoEvento]);

  const limpiarContextos = () => {
    setDatosJugador({ player_id: null, is_owner: false });
    setDatosPartida({ max_players: 2 });
  };

  const moverJugadorAlHome = () => {
    limpiarContextos();
    navigate("/");
  };

  return (
    <div className="game-div relative w-full h-screen m-0 z-0">
      
      <UsarMovimientoProvider>
        <ModalGanaste
          mostrar={mostrarModalGanador}
          texto={mensajeGanador}
          enVolverAlHome={moverJugadorAlHome}
        />
        <CartasMovimiento />
        <CartasFiguras />
        <Tablero tiles={tiles} />
        <InformacionTurno player_id={datosJugador.player_id} />
        <TerminarTurno />
        <AbandonarPartida
          estadoPartida="STARTED"
          esAnfitrion={datosJugador.is_owner}
          idJugador={datosJugador.player_id}
          idPartida={match_id}
        />
      </UsarMovimientoProvider>
    </div>
  );
}
export default Game;
