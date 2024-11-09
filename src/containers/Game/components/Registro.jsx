import React, { useState, useContext, useEffect } from "react";
import { DatosJugadorContext } from "../../../contexts/DatosJugadorContext.jsx";
import { DatosPartidaContext } from "../../../contexts/DatosPartidaContext.jsx";
import { EventoContext } from "../../../contexts/EventoContext.jsx";
import { WebsocketEvents } from "../../../services/ServicioWebsocket";
import { JugadorGanoMotivo } from "../../../services/ServicioPartida";
import { ServicioFigura } from "../../../services/ServicioFigura";
import "./Registro.css";

export const Registro = () => {
  const { datosJugador } = useContext(DatosJugadorContext);
  const { datosPartida } = useContext(DatosPartidaContext);
  const { ultimoEvento } = useContext(EventoContext);
  const [eventQueue, setEventQueue] = useState([]);
  const [registro, setRegistro] = useState([
    {
      mensaje: "",
      tipo: "",
    },
  ]);

  useEffect(() => {
    if (ultimoEvento !== null) {
      setEventQueue((prevQueue) => [...prevQueue, ultimoEvento]);
    }
  }, [ultimoEvento]);

  useEffect(() => {
    const processEventQueue = setInterval(() => {
      if (eventQueue.length > 0) {
        const [currentEvent, ...remainingQueue] = eventQueue;
        setEventQueue(remainingQueue);

        switch (currentEvent.key) {
          case "GET_PLAYER_MATCH_INFO":
            setRegistro((prevRegistro) => [
              ...prevRegistro,
              {
                mensaje:
                  "Te has unido a la partida, tu orden de turno es: " +
                  currentEvent.payload.turn_order,
                tipo: "evento",
              },
            ]);
            break;
          case "PLAYER_RECEIVE_SHAPE_CARD":
            if (currentEvent.payload[0].shape_cards.length > 0) {
              if (currentEvent.payload[0].shape_cards.length === 1) {
                setRegistro((prevRegistro) => [
                  ...prevRegistro,
                  {
                    mensaje: `El jugador "${currentEvent.payload[0].player}" ha recibido la carta de figura "${ServicioFigura.cartaStringName(currentEvent.payload[0].shape_cards[0][1])}".`,
                    tipo: "evento",
                  },
                ]);
              } else {
                setRegistro((prevRegistro) => [
                  ...prevRegistro,
                  {
                    mensaje: `El jugador "${currentEvent.payload[0].player}" ha recibido las cartas de figura "${currentEvent.payload[0].shape_cards.map((figura) => ServicioFigura.cartaStringName(figura[1])).join(", ")}".`,
                    tipo: "evento",
                  },
                ]);
              }
            }
            break;
          case "END_PLAYER_TURN":
            setRegistro((prevRegistro) => [
              ...prevRegistro,
              {
                mensaje: `El jugador "${currentEvent.payload.current_player_name}" ha terminado su turno.`,
                tipo: "evento",
              },
              {
                mensaje: `Turno de "${currentEvent.payload.next_player_name}".`,
                tipo: "evento",
              },
            ]);
            break;
          case "PLAYER_RECEIVE_NEW_BOARD":
            setRegistro((prevRegistro) => [
              ...prevRegistro,
              {
                mensaje: `El jugador "${datosPartida.current_player_name}" ha realizado un movimiento.`,
                tipo: "evento",
              },
            ]);
            break;
          case "COMPLETED_FIGURE":
            setRegistro((prevRegistro) => [
              ...prevRegistro,
              {
                mensaje: `El jugador "${datosPartida.current_player_name}" ha completado la figura "${ServicioFigura.cartaStringName(currentEvent.payload.figure_name)}".`,
                tipo: "evento",
              },
              {
                mensaje: `Nuevo color prohibido: ${currentEvent.payload.ban_color === null ? "Ninguno" : ServicioFigura.cambiarIdiomaColorFigura(currentEvent.payload.ban_color)}.`,
                tipo: "evento",
              }
            ]);
            break;
          case "PLAYER_LEFT":
            setRegistro((prevRegistro) => [
              ...prevRegistro,
              {
                mensaje: `El jugador "${currentEvent.payload.name}" ha abandonado la partida.`,
                tipo: "evento",
              },
            ]);
            break;
          case WebsocketEvents.UNDO_PARTIAL_MOVE:
            setRegistro((prevRegistro) => [
              ...prevRegistro,
              {
                mensaje: `El jugador "${datosPartida.current_player_name}" ha deshecho un movimiento.`,
                tipo: "evento",
              },
            ]);
            break;
          case WebsocketEvents.WINNER:
            if (currentEvent.payload.reason === JugadorGanoMotivo.FORFEIT) {
              setRegistro((prevRegistro) => [
                ...prevRegistro,
                {
                  mensaje: "Has ganado la partida!",
                  tipo: "evento",
                },
              ]);
            }
            if (currentEvent.payload.reason === JugadorGanoMotivo.NORMAL) {
              if (datosJugador.player_id === currentEvent.payload.player_id) {
                setRegistro((prevRegistro) => [
                  ...prevRegistro,
                  {
                    mensaje: "Has ganado la partida!",
                    tipo: "evento",
                  },
                ]);
              } else {
                setRegistro((prevRegistro) => [
                  ...prevRegistro,
                  {
                    mensaje: "Has perdido la partida.",
                    tipo: "evento",
                  },
                ]);
              }
            }
            break;
          default:
            break;
        }
      }
    }, 150);

    return () => clearInterval(processEventQueue);
  }, [eventQueue]);

  const registroMessage = registro
    .slice(0)
    .reverse(0)
    .map((message, index) => {
      if (message.tipo === "chat") {
        return (
          <div key={index} className="registro-message">
            <p>{message.mensaje}</p>
          </div>
        );
      }
      if (message.tipo === "evento") {
        return (
          <div key={index} className="registro-message">
            <p className="chat-divider text-sm mb-2 pt-1 pb-1 pl-4 text-left bg-base-300">
              {message.mensaje}
            </p>
          </div>
        );
      }
    });

  return (
    <div className="registro-container absolute h-3/5 -translate-y-1/2 left-5 top-1/2 z-50 w-1/5 p-1 justify-center">
      <div className="registro-container-inner relative bg-base-200 flex flex-col h-full w-full items-center">
        <div className="chatbox overflow-auto w-full flex flex-col-reverse">
          {registroMessage}
        </div>
      </div>
    </div>
  );
};
