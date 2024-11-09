import React, { useEffect, useContext } from "react";
import { EventoContext } from "../../../contexts/EventoContext";
import { WebsocketEvents } from "../../../services/ServicioWebsocket";
import { useTemporizador } from "../hooks/useTemporizador";
import { HabilitarAccionesUsuarioContext } from "../../../contexts/habilitarAccionesUsuarioContext";

const TIEMPO_DE_TURNO = 120; // 2 minutos

export const Temporizador = ({ duracion = TIEMPO_DE_TURNO }) => {
  const { minutos, segundos, setReiniciarCon } = useTemporizador(duracion);
  const { ultimoEvento } = useContext(EventoContext);
  const { setHabilitarAccionesUsuario } = useContext(HabilitarAccionesUsuarioContext);

  useEffect(() => {
    if (ultimoEvento?.key === WebsocketEvents.END_PLAYER_TURN) {
      setReiniciarCon({ tiempo: TIEMPO_DE_TURNO });
    }
  }, [ultimoEvento]);

  useEffect(() => {
    if (minutos === 0 && segundos === 0) {
      setHabilitarAccionesUsuario(false);
    }
  }, [minutos, segundos]);

  return (
    <div className="flex gap-5">
      <div>
        <span className="countdown font-mono text-lg">
          <span style={{ "--value": minutos }}></span>
        </span>
        min
      </div>
      <div>
        <span className="countdown font-mono text-lg">
          <span style={{ "--value": segundos }}></span>
        </span>
        seg
      </div>
    </div>
  );
};

export default Temporizador;
