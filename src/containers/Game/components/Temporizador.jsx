import React, { useState, useEffect } from 'react';

const TIEMPO = 120; // 2 minutos

const calcularTiempo = (tiempo) => {

    const minutos = Math.floor((tiempo / 60) % 60);
    const segundos = Math.floor(tiempo % 60);

    return [minutos, segundos]
};

export const Temporizador = ({duracion = TIEMPO}) => {
    const [cuenta, setCuenta] = useState(duracion);
    const [tiempoMinutos, tiempoSegundos] = calcularTiempo(duracion);
    const [minutos, setMinutos] = useState(tiempoMinutos);
    const [segundos, setSegundos] = useState(tiempoSegundos);
    const timerId = React.useRef(null);

    useEffect(() => {
        const timer = setInterval(() => {
            setCuenta(prevTiempo => {
                const nuevoTiempo = prevTiempo - 1;

                const [minutosNuevos, segundosNuevos] =
                  calcularTiempo(nuevoTiempo);
                setMinutos(minutosNuevos);
                setSegundos(segundosNuevos);

                return nuevoTiempo;
            });
        }, 1000);

        timerId.current = timer;

        return () => clearInterval(timer);
    }, [duracion]);

    useEffect(() => {
        if (cuenta <= 0) {
            clearInterval(timerId.current);
        }
    }, [cuenta]);

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