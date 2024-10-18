import { useContext } from "react";
import { DatosJugadorContext } from "../../../contexts/DatosJugadorContext";

export const CancelarUltimoMovimiento = () => {

    const { datosJugador } = useContext(DatosJugadorContext);

    const manejarClick = () => {
        console.log("Cancelar último movimiento.");
    };

    return (
      <button
        className="btn"
        disabled={datosJugador.is_player_turn ? "" : "disabled"}
        onClick={manejarClick}
      >
        <svg
          class="h-5 w-5 text-red-500"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-opacity={datosJugador.is_player_turn ? "1" : "0.25"}
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          {" "}
          <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />{" "}
          <line x1="18" y1="9" x2="12" y2="15" />{" "}
          <line x1="12" y1="9" x2="18" y2="15" />
        </svg>
        <span>
            deshacer movimiento
        </span>
      </button>
    );
    
};

export default CancelarUltimoMovimiento;