import React, { useState, useContext, useEffect } from "react";
import { DatosJugadorContext } from "../../../contexts/DatosJugadorContext.jsx";
import { DatosPartidaContext } from "../../../contexts/DatosPartidaContext.jsx";
import { EventoContext } from "../../../contexts/EventoContext.jsx";
import { ServicioRegistro } from "../../../services/ServicioRegistro.js";
import "./Registro.css";

export const Registro = ({ sendJsonMessage, lastMessage }) => {
  const { datosJugador } = useContext(DatosJugadorContext);
  const { datosPartida } = useContext(DatosPartidaContext);
  const { ultimoEvento } = useContext(EventoContext);
  const [eventQueue, setEventQueue] = useState([]);
  const [messageText, setMessageText] = useState("");
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
        ServicioRegistro.procesarMensajeEvento(currentEvent, setRegistro, datosJugador, datosPartida);
      }
    }, 150);

    return () => clearInterval(processEventQueue);
  }, [eventQueue]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (messageText.trim()) {
      sendJsonMessage({
        key: "PLAYER_SEND_MESSAGE",
        payload: {
          message: messageText,
          turn_order: datosJugador.player_turn,
          player_name: datosJugador.player_name,
        },
      });
      setRegistro((prevRegistro) => [
        ...prevRegistro,
        {
          mensaje: `${messageText}`,
          tipo: "chat",
        },
      ]);
      setMessageText("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const registroMessage = registro
    .slice(0)
    .reverse(0)
    .map((message, index) => {
      if (message.tipo === "chat") {
        const { turn_order, player_name } = message.payload || {};
        const isPlayerMessage = turn_order === datosJugador.player_turn;

        return (
          <div key={index} className="registro-message">
            <div className={`chat ${isPlayerMessage ? "chat-start" : "chat-end"} text-sm`}>
              <div className="chat-header pb-1 mb-1">
                {isPlayerMessage ? "Tu" :  player_name}
              </div>
              <div className="chat-bubble mb-2">
                <p>{message.mensaje}</p>
              </div>
            </div>
          </div>
        );
      }
      if (message.tipo === "evento") {
        return (
          <div key={index} className="registro-message">
            <p className="chat-divider text-sm mb-1 pt-1 pb-1 pl-4 text-left bg-base-300">
              {message.mensaje}
            </p>
          </div>
        );
      }
  });

  return (
    <div className="registro-container absolute h-4/6 -translate-y-1/2 left-5 top-1/2 z-50 w-1/5 p-1 justify-center">
      <div className="registro-container-inner relative bg-base-200 flex flex-col h-full w-full items-center">
        <div className="chatbox overflow-auto w-full flex flex-col-reverse">
          {registroMessage}
        </div>
        <textarea 
          className="textarea absolute bottom-0 w-full resize-none mt-2" 
          placeholder="Comenta"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyDown={handleKeyDown}>
        </textarea>
      </div>
    </div>
  );
};
