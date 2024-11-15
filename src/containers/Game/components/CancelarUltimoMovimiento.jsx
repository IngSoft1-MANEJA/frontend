import { useCallback, useContext, useEffect, useState } from "react";
import { DatosJugadorContext } from "../../../contexts/DatosJugadorContext";
import { ServicioMovimiento } from "../../../services/ServicioMovimiento";
import { UsarMovimientoContext } from "../../../contexts/UsarMovimientoContext";
import { TilesContext } from "../../../contexts/tilesContext";
import { EventoContext } from "../../../contexts/EventoContext";
import { Alerts } from "../../../components/Alerts";
import { useParams } from "react-router-dom";
import { WebsocketEvents } from "../../../services/ServicioWebsocket";
import { CompletarFiguraContext } from "../../../contexts/CompletarFiguraContext";
import { HabilitarAccionesUsuarioContext } from "../../../contexts/HabilitarAccionesUsuarioContext";

export const CancelarUltimoMovimiento = () => {
  const { match_id } = useParams();
  const { datosJugador } = useContext(DatosJugadorContext);
  const { usarMovimiento, setUsarMovimiento } = useContext(
    UsarMovimientoContext,
  );
  const { ultimoEvento } = useContext(EventoContext);
  const { tiles, setTiles } = useContext(TilesContext);
  const { cartaSeleccionada: cartaFiguraSeleccionada } = useContext(
    CompletarFiguraContext,
  );
  const { habilitarAccionesUsuario } = useContext(
    HabilitarAccionesUsuarioContext,
  );
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState("Error");

  useEffect(() => {
    if (ultimoEvento !== null) {
      if (ultimoEvento.key === WebsocketEvents.UNDO_PARTIAL_MOVE) {
        const { tiles: tilesAIntercambiar } = ultimoEvento.payload;
        ServicioMovimiento.swapFichas(tilesAIntercambiar, tiles, setTiles);
      }
    }
  }, [ultimoEvento]);

  const manejarClick = () => {
    if (datosJugador.is_player_turn && habilitarAccionesUsuario) {
      ServicioMovimiento.deshacerMovimiento(
        match_id,
        datosJugador.player_id,
        setUsarMovimiento,
        setMensajeAlerta,
        setMostrarAlerta,
        tiles,
        setTiles,
      );
    }
  };

  const puedeCancelar =
    habilitarAccionesUsuario &&
    datosJugador.is_player_turn &&
    !cartaFiguraSeleccionada &&
    usarMovimiento.cartasUsadas.length - usarMovimiento.cartasCompletadas > 0;

  return (
    <div>
      {mostrarAlerta && (
        <div className="absolute z-50 animate-bounce">
          <Alerts type={"error"} message={mensajeAlerta} />
        </div>
      )}
      <button
        className="btn"
        disabled={puedeCancelar ? "" : "disabled"}
        onClick={manejarClick}
      >
        <svg
          className="h-5 w-5 text-red-500"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeOpacity={puedeCancelar ? "1" : "0.25"}
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
