import React, { useState, useContext, useEffect } from 'react'
import { DatosJugadorContext } from "../../../contexts/DatosJugadorContext.jsx";
import { EventoContext } from "../../../contexts/EventoContext.jsx";
import { WebsocketEvents } from "../../../services/ServicioWebsocket";
import { JugadorGanoMotivo } from "../../../services/ServicioPartida";
import './Registro.css'

export const Registro = () => {
    const { datosJugador } = useContext(DatosJugadorContext);
    const { ultimoEvento } = useContext(EventoContext);
    const [registro, setRegistro] = useState([{
        mensaje: "",
        tipo: "",
    }]);

    useEffect(() => {
        if (ultimoEvento !== null) {
          if (ultimoEvento.key === "GET_PLAYER_MATCH_INFO") {
            setRegistro([...registro, {
                mensaje: "Te has unido a la partida, tu orden de turno es: " + ultimoEvento.payload.turn_order,
                tipo: "evento",
            }]);
          }
          if (ultimoEvento.key === "PLAYER_RECEIVE_SHAPE_CARD") {
            setRegistro([...registro, {
                mensaje: `El jugador ${ultimoEvento.payload.player_name} ha recibido la carta de figura X.`,
                tipo: "evento",
            }]);
          }
          if (ultimoEvento.key === "END_PLAYER_TURN") {
            setRegistro([...registro, {
                mensaje: `El jugador ${ultimoEvento.payload.current_player_name} ha terminado su turno.`,
                tipo: "evento",
            },{
                mensaje: `Turno de ${ultimoEvento.payload.next_player_name}.`,
                tipo: "evento",
            }]);
          }
          if (ultimoEvento.key === "ALLOW_FIGURES") {
            if(ultimoEvento.payload.length > 0){
                ultimoEvento.payload.forEach(figura => {
                    setRegistro([...registro, {
                        mensaje: "Se ha formado la figura X en el tablero!.",
                        tipo: "evento",
                    }]);
                });
                
            }
          }
          if (ultimoEvento.key === "COMPLETED_FIGURE") {
            setRegistro([...registro, {
                mensaje: "El jugador X ha completado la figura Y.",
                tipo: "evento",
            }]);
          }
          if (ultimoEvento.key === "PLAYER_LEFT") {
            setRegistro([...registro, {
                mensaje: `El jugador ${ultimoEvento.payload.name} ha abandonado la partida.`,
                tipo: "evento",
            }]);
          }
          if (ultimoEvento.key === WebsocketEvents.WINNER){
            if (ultimoEvento.payload.reason === JugadorGanoMotivo.FORFEIT) {
                setRegistro([...registro, {
                    mensaje: "Has ganado la partida!",
                    tipo: "evento",
                }]);
              }
              if (ultimoEvento.payload.reason === JugadorGanoMotivo.NORMAL) {
                if (datosJugador.player_id === ultimoEvento.payload.player_id) {
                    setRegistro([...registro, {
                        mensaje: "has ganado la partida!",
                        tipo: "evento",
                    }]);
                  } else {
                    setRegistro([...registro, {
                        mensaje: "Has perdido la partida.",
                        tipo: "evento",
                    }]);
                  }
                
              }
          }
        }
      }, [ultimoEvento]);

    const handleSubmit = (e) => {};

    const registroMessage = registro.slice(0).reverse(0).map((message, index) => {
        if (message.tipo === "chat") {
            return (
                <div key={index} className="registro-message">
                    <p>{message.mensaje}</p>
                </div>
            )
        }
        if (message.tipo === "evento") {
            return (
                <div key={index} className="registro-message">
                    <p className="chat-divider flex flex-col-reverse text-sm mb-2 pt-1 pb-1 pl-4 text-left bg-base-300">{message.mensaje}</p>
                </div>
            )
        }
    });

    return (
        <div className="registro-container absolute h-4/6 -translate-y-1/2 left-5 top-1/2 z-50 w-60 p-1 justify-center">
            <div className="registro-container-inner relative bg-base-200 flex flex-col h-full w-full items-center">
                <div className="chatbox overflow-auto h-5/6 w-full flex flex-col-reverse">
                    {registroMessage}
                </div>
                <textarea className="textarea absolute bottom-0 w-full h-1/6 resize-none mt-2" placeholder="Comenta" onSubmit={handleSubmit}></textarea>
            </div>
        </div>
    )
}
