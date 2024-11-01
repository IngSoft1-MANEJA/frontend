import React, {useState, useEffect, useCallback} from 'react';

const calcularTiempo = (tiempo) => {

    const minutos = Math.floor((tiempo / 60) % 60);
    const segundos = Math.floor(tiempo % 60);

    return [minutos, segundos]
};

/**
 * Hook para manejar un temporizador.
 * @param {number} duracion - Duracion del temporizador en segundos.
 * @returns {Object} - Minutos, segundos actuales y funcion para setear el
 *                      tiempo restante en segundos, esta funcion toma un objeto
 *                      con unica propiedad "tiempo", que seria el tiempo de
 *                      duracion con el que se debe reiniciar el temporizador.
 */
export const useTemporizador = (duracion) => {
    const [cuenta, setCuenta] = useState(duracion);
    const [reiniciarCon, setReiniciarCon] = useState({tiempo: duracion});
    const [tiempoMinutos, tiempoSegundos] = calcularTiempo(duracion);
    const [minutos, setMinutos] = useState(tiempoMinutos);
    const [segundos, setSegundos] = useState(tiempoSegundos);
    const timerId = React.useRef(null);

    const crearIntervalo = useCallback(() => {
      if (timerId.current) {
        clearInterval(timerId.current);
        timerId.current = null;
      }

      const temporizador = setInterval(() => {
        setCuenta((prevTiempo) => {
          const nuevoTiempo = prevTiempo - 1;

          const [minutosNuevos, segundosNuevos] = calcularTiempo(nuevoTiempo);
          setMinutos(minutosNuevos);
          setSegundos(segundosNuevos);

          return nuevoTiempo;
        });
      }, 1000);

      timerId.current = temporizador;

    }, [timerId.current]);

    useEffect(() => {
        setCuenta(reiniciarCon.tiempo);
        crearIntervalo();
        return () => {
            if(timerId.current) {
                clearInterval(timerId.current);
            }
        }
    }, [reiniciarCon]);

    useEffect(() => {
        if (cuenta <= 0) {
          clearInterval(timerId.current);
          timerId.current = null;
        }
    }, [cuenta]);

    return {minutos, segundos, setReiniciarCon};
};