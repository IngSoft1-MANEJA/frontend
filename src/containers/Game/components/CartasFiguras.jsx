import React, { useCallback } from "react";
import { useEffect, useContext, useState } from "react";
import { EventoContext } from "../../../contexts/EventoContext";
import { DatosPartidaContext } from "../../../contexts/DatosPartidaContext.jsx";

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
import { CompletarFiguraContext } from "../../../contexts/CompletarFiguraContext";
import { DatosJugadorContext } from "../../../contexts/DatosJugadorContext";
import { UsarMovimientoContext } from "../../../contexts/UsarMovimientoContext";
import { ServicioFigura } from "../../../services/ServicioFigura.js";

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
  const [cartasFiguras, setCartasFiguras] = useState([]);
  const [datosPartida, setDatosPartida] = useState(DatosPartidaContext);
  const [miTurno, setMiTurno] = useState(0);
  const [cartasFigurasCompletadas, setCartasFigurasCompletadas] = useState([]);
  const [cartasMazo, setCartasMazo] = useState(0);
  const { cartaSeleccionada, setCartaSeleccionada } = useContext(
    CompletarFiguraContext,
  );
  const { usarMovimiento } = useContext(UsarMovimientoContext);
  const { datosJugador } = useContext(DatosJugadorContext);
  const [oponentes, setOponentes] = useState([]);
  const { ultimoEvento } = useContext(EventoContext);

  useEffect(() => {
    if (ultimoEvento !== null) {
      if (ultimoEvento.key === "GET_PLAYER_MATCH_INFO") {
        setMiTurno(ultimoEvento.payload.turn_order);
        setOponentes(ultimoEvento.payload.opponents);
        setCartasMazo(ultimoEvento.payload.deck_size);
      } else if (ultimoEvento.key === "END_PLAYER_TURN") {
        if (ultimoEvento.payload.next_player_turn !== miTurno) {
          setCartasMazo(cartasMazo - cartasFigurasCompletadas.length);
        }
        setCartaSeleccionada(null);
        setCartasFigurasCompletadas([]);
      } else if (ultimoEvento.key === "COMPLETED_FIGURE") {
        const cartaId = ultimoEvento.payload.figure_id;
        setCartasFigurasCompletadas((prev) => [...prev, cartaId]);
      }
    }
  }, [ultimoEvento]);

  useEffect(() => {
    if (
      ultimoEvento &&
      (ultimoEvento.key === "PLAYER_RECIEVE_ALL_SHAPES" ||
        ultimoEvento.key === "PLAYER_RECEIVE_SHAPE_CARD") &&
      miTurno !== 0
    ) {
      ServicioFigura.repartirCartasFigura(ultimoEvento, miTurno, cartasFiguras, setCartasFiguras, oponentes, setOponentes, cartasFigurasCompletadas);
    }
  }, [ultimoEvento, miTurno]);

  const oponentesOrdenados = ServicioFigura.ordenarOponentes(oponentes, datosPartida.max_players, miTurno);

  return (
    <div className="cartas-figuras">
      <div className="cartas-figuras-propias">
        {cartasMazo > 3 && <div className="mazo" data-tooltip={`Cartas: ${cartasMazo-3}`}>
          <img src={backfig} alt="back" />
        </div>}
        {cartasFiguras.map((carta, index) => (
          <div
            key={index}
            className={ServicioFigura.claseCarta(carta[0], cartaSeleccionada, usarMovimiento.cartaSeleccionada, datosJugador.is_player_turn, cartasFigurasCompletadas)}
            onClick={() => ServicioFigura.seleccionarCarta(carta[0], datosJugador.is_player_turn, usarMovimiento.cartaSeleccionada, cartaSeleccionada, setCartaSeleccionada, cartasFigurasCompletadas)}
          >
            <img src={urlMap[carta[1]]} alt={carta[1]} />
          </div>
        ))}
      </div>
      {oponentesOrdenados.map((oponente, oponenteIndex) => (
        <div 
          key={oponenteIndex} 
          className={`
            cartas-figuras-oponente-${(oponenteIndex + 1)} 
            ${oponentes.length > 1 ? 'columnas' : 'filas'
          }`}>
          {(oponente.shape_cards || []).length > 2 && <div className="mazo" data-tooltip={`Nombre: ${oponente.player_name}`}>
            <img src={backfig} alt="back" />
          </div>}
          {(oponente.shape_cards || []).map((carta, index) => (
            <div key={index} className="carta-figura">
              <img src={urlMap[carta[1]]} alt={carta[1]} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default CartasFiguras;
