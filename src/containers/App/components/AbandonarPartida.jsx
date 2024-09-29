import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ServicioPartida } from "../../../services/ServicioPartida";
import "./AbandonarPartida.css";

export const AbandonarPartida = ({
  estadoPartida,
  esAnfitrion,
  idJugador,
  idPartida,
}) => {
  const [habilitarAbandonar, setHabilitarAbandonar] = useState(false);
  const estadosPermitidos = ["STARTED", "WAITING"];
  const navegar = useNavigate();

  if (!estadosPermitidos.includes(estadoPartida)) {
    console.error("Estado de partida no permitido");
    return null;
  }

  useEffect(() => {
    if (
      estadoPartida === "STARTED" ||
      (!esAnfitrion && estadoPartida === "WAITING")
    ) {
      setHabilitarAbandonar(true);
    } else {
      setHabilitarAbandonar(false);
    }
  }, [estadoPartida, esAnfitrion]);

  const manejarAbandonar = async () => {
    try {
      if (!habilitarAbandonar) {
        console.log("Botón deshabilitado, no se puede abandonar la partida");
        return;
      }

      await ServicioPartida.abandonarPartida(idJugador, idPartida);
      console.log("Abandonar partida");
      navegar("/AlgunLado");
    } catch (error) {
      console.error("Error al abandonar partida", error);
    }
  };

  return (
    <div>
      <button
        className="abandonar-partida-boton"
        onClick={manejarAbandonar}
        disabled={!habilitarAbandonar}
      >
        Abandonar
      </button>
    </div>
  );
};

export default AbandonarPartida;
