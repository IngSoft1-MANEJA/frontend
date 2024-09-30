import React from "react";
import { ServicioPartida } from "../../../services/ServicioPartida";
import { useNavigate } from "react-router-dom";

const IniciarPartida = ({
  idPartida,
  idJugador,
  esAnfitrion,
  nJugadoresEnLobby,
  maxJugadores,
}) => {
  const habilitar = esAnfitrion && nJugadoresEnLobby === maxJugadores;
  const navigate = useNavigate();

  const manejarClick = async () => {
    if (!habilitar) {
      return;
    }
    try {
      const respuesta = await ServicioPartida.iniciarPartida(
        idPartida,
        idJugador,
      );
      console.log(respuesta);
      navigate(`/matches/${idPartida}`);
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
