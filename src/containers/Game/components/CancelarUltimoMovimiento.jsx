import { useContext, useState } from "react";
import { DatosJugadorContext } from "../../../contexts/DatosJugadorContext";
import { ServicioMovimiento } from "../../../services/ServicioMovimiento";
import { DatosPartidaContext } from "../../../contexts/DatosPartidaContext";
import { UsarMovimientoContext } from "../../../contexts/UsarMovimientoContext";

export const CancelarUltimoMovimiento = () => {
  const { datosJugador } = useContext(DatosJugadorContext);
  const { datosPartida } = useContext(DatosPartidaContext);
  const { setUsarMovimiento } = useContext(UsarMovimientoContext);
  const [mostrarAlerta, setMostrarAlerta] = useState(false);

  const manejarClick = () => {
    if (datosJugador.is_player_turn) {
      ServicioMovimiento.deshacerMovimiento(
        datosPartida.match_id,
        datosJugador.player_id,
        setUsarMovimiento,
        setMostrarAlerta,
      );
    }
  };

  return (
    <div>
      {mostrarAlerta && (
        <div className="fixed top-3 right-3 w-2/5 z-50">
          <Alerts type={"error"} message={mensajeAlerta} />
        </div>
      )}
      <button
        className="btn"
        disabled={datosJugador.is_player_turn ? "" : "disabled"}
        onClick={manejarClick}
      >
        <svg
          className="h-5 w-5 text-red-500"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeOpacity={datosJugador.is_player_turn ? "1" : "0.25"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {" "}
          <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />{" "}
          <line x1="18" y1="9" x2="12" y2="15" />{" "}
          <line x1="12" y1="9" x2="18" y2="15" />
        </svg>
        <span>deshacer movimiento</span>
      </button>
    </div>
  );
};

export default CancelarUltimoMovimiento;
