import React from "react";
import { useEffect, useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { useWebSocket } from "react-use-websocket";
import { WEBSOCKET_URL } from "../../../variablesConfiguracion";
import { DatosJugadorContext } from "../../../contexts/DatosJugadorContext";

import fig1 from "../../../assets/Figuras/Blancas/fig01.svg";
import fig2 from "../../../assets/Figuras/Blancas/fig02.svg";
import fig3 from "../../../assets/Figuras/Blancas/fig03.svg";
import fig4 from "../../../assets/Figuras/Blancas/fig04.svg";
import fig5 from "../../../assets/Figuras/Blancas/fig05.svg";
import fig6 from "../../../assets/Figuras/Blancas/fig06.svg";
import fig7 from "../../../assets/Figuras/Blancas/fig07.svg";
import fig8 from "../../../assets/Figuras/Blancas/fig08.svg";
import fig9 from "../../../assets/Figuras/Blancas/fig09.svg";
import fig10 from "../../../assets/Figuras/Blancas/fig10.svg";
import fig11 from "../../../assets/Figuras/Blancas/fig11.svg";
import fig12 from "../../../assets/Figuras/Blancas/fig12.svg";
import fig13 from "../../../assets/Figuras/Blancas/fig13.svg";
import fig14 from "../../../assets/Figuras/Blancas/fig14.svg";
import fig15 from "../../../assets/Figuras/Blancas/fig15.svg";
import fig16 from "../../../assets/Figuras/Blancas/fig16.svg";
import fig17 from "../../../assets/Figuras/Blancas/fig17.svg";
import fig18 from "../../../assets/Figuras/Blancas/fig18.svg";

import fige1 from "../../../assets/Figuras/Celestes/fige01.svg";
import fige2 from "../../../assets/Figuras/Celestes/fige02.svg";
import fige3 from "../../../assets/Figuras/Celestes/fige03.svg";
import fige4 from "../../../assets/Figuras/Celestes/fige04.svg";
import fige5 from "../../../assets/Figuras/Celestes/fige05.svg";
import fige6 from "../../../assets/Figuras/Celestes/fige06.svg";
import fige7 from "../../../assets/Figuras/Celestes/fige07.svg";
import backfig from "../../../assets/Figuras/Celestes/back.svg";

import "./CartasFiguras.css";

const urlMap = {
  1: fig1,
  2: fig2,
  3: fig3,
  4: fig4,
  5: fig5,
  6: fig6,
  7: fig7,
  8: fig8,
  9: fig9,
  10: fig10,
  11: fig11,
  12: fig12,
  13: fig13,
  14: fig14,
  15: fig15,
  16: fig16,
  17: fig17,
  18: fig18,
  19: fige1,
  20: fige2,
  21: fige3,
  22: fige4,
  23: fige5,
  24: fige6,
  25: fige7,
};

export const CartasFiguras = () => {
  const { match_id } = useParams();
  const { datosJugador, setDatosJugador } = useContext(DatosJugadorContext);

  const websocket_url = `${WEBSOCKET_URL}/matches/${match_id}/ws/${datosJugador.player_id}`;
  const { lastJsonMessage } = useWebSocket(websocket_url, { share: true });
  const [cartasFiguras, setCartasFiguras] = useState([]);
  const [miTurno, setMiTurno] = useState(0);
  const [turnoCartas, setTurnoCartas] = useState(0);

  useEffect(() => {
    if (lastJsonMessage !== null) {
      if (lastJsonMessage.key == "PLAYER_RECEIVE_SHAPE_CARDS") {
        setTurnoCartas(lastJsonMessage.payload.turn_order);

        if (turnoCartas == miTurno) {
          setCartasFiguras(lastJsonMessage.payload.shape_cards);
        }
      } else if (lastJsonMessage.key == "START_MATCH") {
        setMiTurno(lastJsonMessage.payload.turn_order);
      } else {
        console.error("key incorrecto recibido del websocket");
      }
    }
  }, [lastJsonMessage, miTurno]);

  return (
    <div className="cartas-figuras">
      <div className="cartas-figuras-propias">
        {cartasFiguras.map((carta, index) => (
          <div key={index} className="carta-movimiento">
            <img src={urlMap[carta.type]} alt={carta.type} />
          </div>
        ))}
        <div className="mazo-propio">
          <img src={backfig} alt="back" />
        </div>
      </div>
    </div>
  );
};

export default CartasFiguras;
