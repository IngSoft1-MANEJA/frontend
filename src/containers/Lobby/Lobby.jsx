import React, { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";
import { WEBSOCKET_URL } from "../../variablesConfiguracion";
import Alerts from "../../components/Alerts";
import { useParams } from "react-router-dom";
import "./Lobby.css";

function Lobby() {
  const { idPartida, idJugador } = useParams();
  const websocket_url = `${WEBSOCKET_URL}/${idPartida}/ws/${idJugador}`;
  const { lastJsonMessage } = useWebSocket(websocket_url, { share: true });
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [tipoAlerta, setTipoAlerta] = useState("info");
  const [mensajeAlerta, setMensajeAlerta] = useState("");
  const [estaShaking, setEstaShaking] = useState(false);

  useEffect(() => {
    if (lastJsonMessage !== null) {
      switch (lastJsonMessage.key) {
        case "PLAYER_JOIN":
          setMostrarAlerta(true);
          setTipoAlerta("info");
          setMensajeAlerta(
            `jugador ${lastJsonMessage.payload.name} se ha unido.`
          );
          setEstaShaking(true);
          setTimeout(() => setEstaShaking(false), 1000); // Shake for 1 second
          break;

        default:
          console.error("key incorrecto recibido del websocket");
          break;
      }
    }
  }, [
    lastJsonMessage,
    setMostrarAlerta,
    setTipoAlerta,
    setMensajeAlerta,
  ]);

  return (
    <div>
      <div className={`${estaShaking ? "animate-shake" : ""}`}>
        {mostrarAlerta && <Alerts type={tipoAlerta} message={mensajeAlerta} />}
      </div>
    </div>
  );
}

export default Lobby;
