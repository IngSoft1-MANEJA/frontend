import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ServicioPartida } from "../services/ServicioPartida";
import "./AbandonarPartida.css";

export const AbandonarPartida = ({
  estadoPartida,
  idJugador,
  idPartida,
}) => {
  
  const estadosPermitidos = ["STARTED", "WAITING"];
  const navegar = useNavigate();

  if (!estadosPermitidos.includes(estadoPartida)) {
    console.error("Estado de partida no permitido");
    return null;
  }

  const manejarAbandonar = async () => {
    try {
      await ServicioPartida.abandonarPartida(idJugador, idPartida);
      console.log("Abandonar partida");
      navegar("/");
    } catch (error) {
      console.error("Error al abandonar partida", error);
    }
  };

  return (
    <div className="absolute left-8 bottom-8">
      <button
        className="abandonar-partida-boton btn"
        onClick={manejarAbandonar}
      >
        Abandonar
      </button>
    </div>
  );
};

export default AbandonarPartida;
