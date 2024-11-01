import React, { useEffect, useContext } from 'react';
import { EventoContext } from '../../../contexts/EventoContext';
import { WebsocketEvents } from '../../../services/ServicioWebsocket';
import { useTemporizador } from '../hooks/useTemporizador';

const TIEMPO = 120; // 2 minutos

export const Temporizador = ({duracion = TIEMPO}) => {
    const {minutos, segundos, setCuenta} = useTemporizador(duracion);
    const { evento } = useContext(EventoContext);

    useEffect(() => {
        if (evento?.key === WebsocketEvents.END_PLAYER_TURN) {
            setCuenta(duracion);
        }
    }, [evento]);

    return (
      <div className="flex gap-5">
        <div>
          <span className="countdown font-mono text-xl">
            <span style={{ "--value": minutos }}></span>
          </span>
          min
        </div>
        <div>
          <span className="countdown font-mono text-xl">
            <span style={{ "--value": segundos }}></span>
          </span>
          seg
        </div>
      </div>
    );
};

export default Temporizador;