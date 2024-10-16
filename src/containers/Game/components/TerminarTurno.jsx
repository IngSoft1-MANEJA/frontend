import React from "react";
import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import useWebSocket from "react-use-websocket";
import { WEBSOCKET_URL } from "../../../variablesConfiguracion";
import { DatosJugadorContext } from "../../../contexts/DatosJugadorContext";
import { ServicioPartida } from "../../../services/ServicioPartida";
import { Alerts } from "../../../components/Alerts";

export const TerminarTurno = () => {
  const { match_id } = useParams();
  const { datosJugador, setDatosJugador } = useContext(DatosJugadorContext);
  const websocket_url = `${WEBSOCKET_URL}/matches/${match_id}/ws/${datosJugador.player_id}`;
  const { lastJsonMessage } = useWebSocket(websocket_url, { share: true });
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState("");
  const [habilitarBoton, setHabilitarBoton] = useState(false);
  const tipoAlerta = "info";

  useEffect(() => {
    if (lastJsonMessage !== null) {
      switch (lastJsonMessage.key) {
        case "START_MATCH":
          if (lastJsonMessage.payload.turn_order === 1) {
            setHabilitarBoton(true);
          } else {
            setHabilitarBoton(false);
          }

          setMensajeAlerta(`Turno de ${lastJsonMessage.payload.player_name}.`);
          setMostrarAlerta(true);

          setTimeout(() => {
            setMostrarAlerta(false);
          }, 1500);
          break;

        case "END_PLAYER_TURN":
          setMensajeAlerta(
            `${lastJsonMessage.payload.current_player_name} ha terminado su turno.`,
          );
          setMostrarAlerta(true);
          setTimeout(() => {
            setMostrarAlerta(false);
          }, 1500);

          if (
            lastJsonMessage.payload.next_player_turn ===
            datosJugador.player_turn
          ) {
            setHabilitarBoton(true);
          } else {
            setHabilitarBoton(false);
          }

          setMensajeAlerta(
            `Turno de ${lastJsonMessage.payload.next_player_name}.`,
          );
          setMostrarAlerta(true);

          setTimeout(() => {
            setMostrarAlerta(false);
          }, 1500);

          break;

        default:
          console.error("key incorrecto recibido del websocket");
          break;
      }
    }
  }, [lastJsonMessage, setMostrarAlerta, setMensajeAlerta]);

  const handleTerminarTurno = async () => {
    const respuesta = await ServicioPartida.terminarTurno(
      match_id,
      datosJugador.player_id,
    );
  };

  return (
    <div className="terminar-turno-div">
      {mostrarAlerta && <Alerts type={tipoAlerta} message={mensajeAlerta} />}
      <div className="terminar-turno-boton-div absolute right-8 bottom-8">
        <button
          className="terminar-turno-boton btn"
          onClick={handleTerminarTurno}
          disabled={!habilitarBoton}
        >
          Terminar turno
        </button>
      </div>
    </div>
  );
};

export default TerminarTurno;
