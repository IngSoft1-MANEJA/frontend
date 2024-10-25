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
      } else if (ultimoEvento.key === "END_PLAYER_TURN") {
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
      const jugadorData = ultimoEvento.payload.find(
        (jugador) => jugador.turn_order === miTurno,
      );

      if (jugadorData) {
        const cartasNoUsadas = cartasFiguras.filter(
          (carta) => !cartasFigurasCompletadas.includes(carta[0]),
        );

        const nuevasCartas = jugadorData.shape_cards;

        setCartasFiguras([...cartasNoUsadas, ...nuevasCartas]);
      } else {
        console.log(
          "CartasFiguras - No se encontró jugador con turn_order:",
          miTurno,
        );
      }

      setOponentes(ultimoEvento.payload.filter((jugador) => jugador.turn_order !== miTurno));
    }
  }, [ultimoEvento, miTurno]);

  function ordenarOponentes () {
    const oponentesOrdenados = oponentes.sort((a, b) => {
      const turnoA = a.turn_order < miTurno ? a.turn_order + datosPartida.max_players : a.turn_order;
      const turnoB = b.turn_order < miTurno ? b.turn_order + datosPartida.max_players : b.turn_order;
      return turnoA - turnoB;
    });
  
    return oponentesOrdenados;
  };

  const claseCarta = useCallback(
    (cartaId) => {
      const efectoHover =
        " hover:cursor-pointer" +
        " hover:shadow-[0px_0px_15px_rgba(224,138,44,1)]" +
        " hover:scale-105";

      const efectoSeleccionada =
        " cursor-pointer" +
        " shadow-[0px_0px_20px_rgba(100,200,44,1)]" +
        " scale-105";

      const deshabilitada = "opacity-25 pointer-events-none greyscale";

      if (cartasFigurasCompletadas.includes(cartaId)) {
        return deshabilitada;
      }

      if (!datosJugador.is_player_turn) {
        return "";
      }

      if (usarMovimiento.cartaSeleccionada !== null) {
        return deshabilitada;
      }

      if (cartaSeleccionada !== null) {
        if (cartaSeleccionada === cartaId) {
          return efectoSeleccionada;
        } else {
          return deshabilitada;
        }
      }

      return efectoHover;
    },
    [cartaSeleccionada, usarMovimiento, datosJugador, cartasFigurasCompletadas],
  );

  const seleccionarCarta = (cartaId) => {
    if (
      !datosJugador.is_player_turn ||
      usarMovimiento.cartaSeleccionada !== null ||
      cartasFigurasCompletadas.includes(cartaId)
    ) {
      return;
    }

    if (cartaSeleccionada !== null) {
      if (cartaSeleccionada === cartaId) {
        setCartaSeleccionada(null);
      }
    } else {
      setCartaSeleccionada(cartaId);
    }
  };

  return (
    <div className="cartas-figuras">
      <div className="cartas-figuras-propias">
        <div className="mazo">
          <img src={backfig} alt="back" />
        </div>
        {cartasFiguras.map((carta, index) => (
          <div
            key={index}
            className={claseCarta(carta[0])}
            onClick={() => seleccionarCarta(carta[0])}
          >
            <img src={urlMap[carta[1]]} alt={carta[1]} />
          </div>
        ))}
      </div>
      {ordenarOponentes().map((oponente, oponenteIndex) => (
        <div 
          key={oponenteIndex} 
          className={`
            cartas-figuras-oponente-${(oponenteIndex + 1)} 
            ${oponentes.length > 1 ? 'columnas' : 'filas'
          }`}>
          <div className="mazo">
            <img src={backfig} alt="back" />
          </div>
          {oponente.shape_cards.map((carta, index) => (
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
