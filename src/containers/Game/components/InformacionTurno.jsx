import React, { useContext, useEffect, useState } from "react";
import { EventoContext } from "../../../contexts/EventoContext";
import "./InformacionTurno.css";

export const InformacionTurno = ({ player_id }) => {
  const [turnos, setTurnos] = useState({ current_turn: "" });
  const { ultimoEvento } = useContext(EventoContext);

  useEffect(() => {
    if (ultimoEvento !== null) {
      switch (ultimoEvento.key) {
        case "GET_PLAYER_MATCH_INFO":
          setTurnos({
            current_turn: ultimoEvento.payload.current_turn_player,
          });
          break;

        case "END_PLAYER_TURN":
          setTurnos({
            current_turn: ultimoEvento.payload.next_player_name,
          });
          break;

        default:
          break;
      }
    }
  }, [ultimoEvento]);

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
