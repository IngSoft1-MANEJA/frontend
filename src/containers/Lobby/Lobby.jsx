import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { AbandonarPartida } from "../../components/AbandonarPartida";
import useWebSocket from "react-use-websocket";
import { WEBSOCKET_URL } from "../../variablesConfiguracion";
import Alerts from "../../components/Alerts";
import { useParams } from "react-router-dom";
import { DatosJugadorContext } from "../../contexts/DatosJugadorContext";
import "./Lobby.css";

export function Lobby() {
  const { match_id, player_id } = useParams();
  const websocket_url = `${WEBSOCKET_URL}/${match_id}/ws/${player_id}`;
  const { lastJsonMessage } = useWebSocket(websocket_url, {
    share: true,
    onClose: () => console.log("Websocket - Lobby: conexión cerrada."),
    onError: (event) => console.error("Websocket - Lobby: error: ", event),
    onOpen: () => console.log("Websocket - Lobby: conexión abierta."),
  });
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [tipoAlerta, setTipoAlerta] = useState("info");
  const [mensajeAlerta, setMensajeAlerta] = useState("");
  const [estaShaking, setEstaShaking] = useState(false);

  const { datosJugador, setDatosJugador } = useContext(DatosJugadorContext);

  useEffect(() => {
    if (lastJsonMessage !== null) {
      switch (lastJsonMessage.key) {
        case "PLAYER_JOIN":
          setMostrarAlerta(true);
          setTipoAlerta("info");
          setMensajeAlerta(
            `jugador ${lastJsonMessage.payload.name} se ha unido.`,
          );
          setEstaShaking(true);
          setTimeout(() => setEstaShaking(false), 1000);
          break;

        default:
          console.error("key incorrecto recibido del websocket");
          break;
      }
    }
  }, [lastJsonMessage, setMostrarAlerta, setTipoAlerta, setMensajeAlerta]);

  return (
    <div>
      <div className={`${estaShaking ? "animate-shake" : ""}`}>
        {mostrarAlerta && <Alerts type={tipoAlerta} message={mensajeAlerta} />}
      </div>
      <AbandonarPartida
        estadoPartida="WAITING"
        esAnfitrion={datosJugador.is_owner}
        idJugador={player_id}
        idPartida={match_id}
      />
    </div>
  );
}

export default Lobby;
