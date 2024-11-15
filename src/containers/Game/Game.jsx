import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { flushSync } from "react-dom";
import useWebSocket, { ReadyState } from "react-use-websocket";

import { WEBSOCKET_URL } from "../../variablesConfiguracion.js";
import { AbandonarPartida } from "../../components/AbandonarPartida";
import { UsarMovimientoProvider } from "../../contexts/UsarMovimientoContext";
import { Tablero } from "./components/Tablero";
import { TerminarTurno } from "./components/TerminarTurno";
import { Registro } from "./components/Registro";
import { DatosJugadorContext } from "../../contexts/DatosJugadorContext";
import { InformacionTurno } from "./components/InformacionTurno.jsx";
import { CartasFiguras } from "./components/CartasFiguras";
import { CartasMovimiento } from "./components/CartasMovimiento";
import { EventoContext } from "../../contexts/EventoContext";
import { ServicioPartida } from "../../services/ServicioPartida.js";
import { WebsocketEvents } from "../../services/ServicioWebsocket";
import { JugadorGanoMotivo } from "../../services/ServicioPartida";
import { Modal } from "../../components/Modal.jsx";
import { DatosPartidaContext } from "../../contexts/DatosPartidaContext.jsx";
import { CancelarUltimoMovimiento } from "./components/CancelarUltimoMovimiento.jsx";
import { FigurasProvider } from "../../contexts/FigurasContext.jsx";
import { CompletarFiguraProvider } from "../../contexts/CompletarFiguraContext.jsx";
import { HabilitarAccionesUsuarioContext } from "../../contexts/HabilitarAccionesUsuarioContext.jsx";
import { ServicioDatosPartida } from "../../services/ServicioDatosPartida.js";

export function Game() {
  const { match_id, player_id } = useParams();
  const { datosJugador, setDatosJugador } = useContext(DatosJugadorContext);
  const { datosPartida, setDatosPartida } = useContext(DatosPartidaContext);
  const { ultimoEvento, setUltimoEvento } = useContext(EventoContext);
  const { setHabilitarAccionesUsuario } = useContext(
    HabilitarAccionesUsuarioContext,
  );
  const [mensaje, setMensaje] = useState("");
  const [mostrarModalGanador, setMostrarModalGanador] = useState(false);
  const websocket_url = `${WEBSOCKET_URL}/matches/${match_id}/ws/${player_id}`;
  const navigate = useNavigate();
  const { sendJsonMessage, lastMessage, readyState } = useWebSocket(
    websocket_url,
    {
      share: true,
      onClose: () => {
        console.log("Websocket - Game: conexión cerrada.");
        setUltimoEvento(null);
      },
      onError: (event) => console.error("Websocket - Game: error: ", event),
      onOpen: () => console.log("Websocket - Game: conexión abierta."),
    },
  );

  useEffect(() => {
    setHabilitarAccionesUsuario(true);
    setDatosJugador((prev) => ({ ...prev, player_id: player_id }));
    ServicioDatosPartida.guardarDatosPartida(match_id, player_id, {});
    return () => {
      setUltimoEvento(null); // Limpia el último evento al desmontar el componente
      setHabilitarAccionesUsuario(false);
      ServicioDatosPartida.guardarDatosPartida(match_id, player_id, {});
    };
  }, []);

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
        ServicioPartida.obtenerInfoPartidaParaJugador(match_id, player_id);
      } catch (error) {
        console.error(error);
      }
    }
  }, [readyState]);

  useEffect(() => {
    if (ultimoEvento !== null) {
      if (ultimoEvento.key === "GET_PLAYER_MATCH_INFO") {
        setDatosPartida({
          ...datosPartida,
          current_player_name: ultimoEvento.payload.current_turn_player,
          opponents: ultimoEvento.payload.opponents,
        });
        if (
          ultimoEvento.payload.turn_order ===
          ultimoEvento.payload.current_turn_order
        ) {
          setDatosJugador({
            ...datosJugador,
            player_turn: ultimoEvento.payload.turn_order,
            is_player_turn: true,
          });
        } else {
          setDatosJugador({
            ...datosJugador,
            is_owner: ultimoEvento.payload.is_owner,
            player_name: ultimoEvento.payload.player_name,
            player_turn: ultimoEvento.payload.turn_order,
            is_player_turn: false,
          });
        }
      } else if (ultimoEvento.key === WebsocketEvents.WINNER) {
        setMostrarModalGanador(true);
        if (ultimoEvento.payload.reason === JugadorGanoMotivo.FORFEIT) {
          setMensaje(
            "¡Ganaste!, todos los demás jugadores han abandonado la partida.",
          );
        }
        if (ultimoEvento.payload.reason === JugadorGanoMotivo.NORMAL) {
          if (datosJugador.player_id === ultimoEvento.payload.player_id) {
            setMensaje("¡Ganaste!, has completado todas tus figuras.");
          } else {
            setMensaje(
              "¡Perdiste!, un jugador ha completado todas sus figuras.",
            );
          }
        }
      }
    }
  }, [ultimoEvento]);

  const limpiarContextos = () => {
    setDatosJugador({ player_id: null, is_owner: false });
    setDatosPartida({ max_players: 2, current_turn: "" });
  };

  const moverJugadorAlHome = () => {
    setMostrarModalGanador(false);
    limpiarContextos();
    navigate("/");
  };

  return (
    <div className="game-div relative w-full h-screen m-0 z-0">
      <FigurasProvider>
        <UsarMovimientoProvider>
          <CompletarFiguraProvider>
            <Modal
              mostrar={mostrarModalGanador}
              texto={mensaje}
              funcionDeClick={moverJugadorAlHome}
              boton="Volver al home"
            />
            <div className="cartas-movimientos">
              <div className="-mt-24 pb-5">
                <CancelarUltimoMovimiento />
              </div>
              <CartasMovimiento />
            </div>
            <CartasFiguras />
            <Tablero />
            <InformacionTurno player_id={datosJugador.player_id} />
            <Registro sendJsonMessage={sendJsonMessage} />
            <TerminarTurno />
            <AbandonarPartida
              estadoPartida="STARTED"
              esAnfitrion={datosJugador.is_owner}
              idJugador={datosJugador.player_id}
              idPartida={match_id}
            />
          </CompletarFiguraProvider>
        </UsarMovimientoProvider>
      </FigurasProvider>
    </div>
  );
}
export default Game;
