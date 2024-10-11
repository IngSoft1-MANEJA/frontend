import React from "react";
import { useEffect, useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { useWebSocket } from "react-use-websocket";
import { WEBSOCKET_URL } from "../../../variablesConfiguracion";
import { DatosJugadorContext } from "../../../contexts/DatosJugadorContext";
import mov1 from "../../../assets/Movimientos/mov1.svg";
import mov2 from "../../../assets/Movimientos/mov2.svg";
import mov3 from "../../../assets/Movimientos/mov3.svg";
import mov4 from "../../../assets/Movimientos/mov4.svg";
import mov5 from "../../../assets/Movimientos/mov5.svg";
import mov6 from "../../../assets/Movimientos/mov6.svg";
import mov7 from "../../../assets/Movimientos/mov7.svg";
import "./CartasMovimiento.css";

const urlMap = {
  DIAGONAL: mov1,
  LINE_BETWEEN: mov2,
  LINE: mov3,
  INVERSE_DIAGONAL: mov4,
  INVERSE_L: mov5,
  L: mov6,
  LINE_BORDER: mov7,
};

export const CartasMovimiento = () => {
  const { match_id } = useParams();
  const { datosJugador, setDatosJugador } = useContext(DatosJugadorContext);

  const websocket_url = `${WEBSOCKET_URL}/matches/${match_id}/ws/${datosJugador.player_id}`;
  const { lastJsonMessage } = useWebSocket(websocket_url, { share: true });
  const [cartasMovimiento, setCartasMovimiento] = useState([]);

  useEffect(() => {
    if (lastJsonMessage !== null) {
      if (lastJsonMessage.key == "GET_MOVEMENT_CARD") {
        setCartasMovimiento(lastJsonMessage.payload.movement_card);
      } else {
        console.error("key incorrecto recibido del websocket");
      }
    }
  }, [lastJsonMessage, setCartasMovimiento]);

  return (
    <div className="cartas-movimientos">
      <div className="cartas-movimientos-propias">
        {cartasMovimiento.map((carta, index) => (
          <div key={index} className="carta-movimiento">
            <img src={urlMap[carta.type]} alt={carta.type} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CartasMovimiento;
