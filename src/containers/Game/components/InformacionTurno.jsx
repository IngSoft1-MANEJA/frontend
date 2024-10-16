import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useWebSocket from "react-use-websocket";
import { WEBSOCKET_URL } from "../../../variablesConfiguracion.js";
import "./InformacionTurno.css";

export const InformacionTurno = ({ player_id }) => {
  const { match_id } = useParams();
  const [turnos, setTurnos] = useState({ current_turn: "" });
  const websocket_url = `${WEBSOCKET_URL}/matches/${match_id}/ws/${player_id}`;
  const { lastJsonMessage } = useWebSocket(websocket_url, { share: true });

  useEffect(() => {
    if (lastJsonMessage !== null) {
      switch (lastJsonMessage.key) {
        case "START_MATCH":
          setTurnos({
            current_turn: lastJsonMessage.payload.player_name,
          });
          break;

        case "END_PLAYER_TURN":
          setTurnos({
            current_turn: lastJsonMessage.payload.next_player_name,
          });
          break;

        default:
          console.error("key incorrecto recibido del websocket");
          break;
      }
    }
  }, [lastJsonMessage, setTurnos]);

  return (
    <div className="informacion-div absolute left-6 top-6 w-fit max-w-md h-fit p-1">
      <table className="table table-xs overflow-hidden break-words text-balance rounded-none">
        <thead>
          <tr className="bg-base-100">
            <th className="w-16">Turno</th>
            <th className="min-w-20">Nombre</th>
          </tr>
        </thead>
        <tbody>
          <tr className="bg-base-200 h-8">
            <th className="w-16">Jugando:</th>
            <td className="min-w-20 max-w-44">{turnos.current_turn}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default InformacionTurno;
