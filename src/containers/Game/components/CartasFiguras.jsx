import React, { useCallback } from "react";
import { useEffect, useContext, useState } from "react";
import { EventoContext } from "../../../contexts/EventoContext";

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
import { set } from "react-hook-form";

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
  const [cartasFiguras, setCartasFiguras] = useState([[1, 1], [2, 2]]);
  const [miTurno, setMiTurno] = useState(0);
  const [cartaSeleccionada, setCartaSeleccionada] = useState(null);
  const { ultimoEvento } = useContext(EventoContext);

  useEffect(() => {
    if (ultimoEvento !== null) {
      if (ultimoEvento.key === "GET_PLAYER_MATCH_INFO") {
        setMiTurno(ultimoEvento.payload.turn_order);
      }
    }
  }, [ultimoEvento]);

  useEffect(() => {
    if (
      ultimoEvento &&
      ultimoEvento.key === "PLAYER_RECIEVE_ALL_SHAPES" &&
      miTurno !== 0
    ) {
      const jugadorData = ultimoEvento.payload.find(
        (jugador) => jugador.turn_order === miTurno,
      );

      if (jugadorData) {
        setCartasFiguras(jugadorData.shape_cards);
      } else {
        console.log(
          "CartasFiguras - No se encontró jugador con turn_order:",
          miTurno,
        );
      }
    }
  }, [ultimoEvento, miTurno]);

  const claseCarta = useCallback((index) => {
    const efectoHover =
      " hover:cursor-pointer" +
      " hover:shadow-[0px_0px_15px_rgba(224,138,44,1)]" +
      " hover:scale-105";
    
    const efectoSeleccionada =
      " cursor-pointer" +
      " shadow-[0px_0px_20px_rgba(100,200,44,1)]" +
      " scale-105";
    
    if (cartaSeleccionada !== null) {
      if (cartaSeleccionada === index) {
        return efectoSeleccionada;
      } else {
        return "";
      }
    }

    return efectoHover; 
  }, [cartaSeleccionada]);

  const seleccionarCarta = (index) => {
    if (cartaSeleccionada !== null) {
      if (cartaSeleccionada === index) {
        setCartaSeleccionada(null);
      }
    } else {
      setCartaSeleccionada(index);
    }
  };

  return (
    <div className="cartas-figuras">
      <div className="cartas-figuras-propias">
        <div className="mazo-propio">
          <img src={backfig} alt="back" />
        </div>
        {cartasFiguras.map((carta, index) => (
          <div
            key={index}
            className={claseCarta(index)}
            onClick={() => seleccionarCarta(index)}
          >
            <img src={urlMap[carta[1]]} alt={carta[1]} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CartasFiguras;
