import React from "react";
import { ServicioPartida } from "../../../services/ServicioPartida";

const IniciarPartida = ({
  idPartida,
  idJugador,
  esAnfitrion,
  nJugadoresEnLobby,
  maxJugadores,
}) => {
  const habilitar = esAnfitrion && nJugadoresEnLobby === maxJugadores;

  const manejarClick = async () => {
    if (!habilitar) {
      return;
    }
    try {
      await ServicioPartida.iniciarPartida(idPartida, idJugador);
    } catch (error) {
      console.error(error.message);
    }
  };
  return (
    <div>
      <button
        className="btn"
        disabled={habilitar ? "" : "disabled"}
        onClick={manejarClick}
      >
        Iniciar Partida
      </button>
    </div>
  );
};

export default IniciarPartida;
