import React, {useState, useEffect} from 'react';

const calcularTiempo = (tiempo) => {

    const minutos = Math.floor((tiempo / 60) % 60);
    const segundos = Math.floor(tiempo % 60);

    return [minutos, segundos]
};

/**
 * Hook para manejar un temporizador.
 * @param {number} duracion - Duracion del temporizador en segundos.
 * @returns {Object} - Minutos, segundos actuales y funcion para setear la
 *                      cuenta restante en segundos.
 */
export const useTemporizador = (duracion) => {
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

    return {minutos, segundos, setCuenta};
};