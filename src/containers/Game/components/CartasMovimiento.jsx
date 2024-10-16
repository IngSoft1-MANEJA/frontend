import React from "react";
import { useEffect, useContext, useState } from "react";
import { EventoContext } from "../../../contexts/EventoContext";
import { DatosJugadorContext } from "../../../contexts/DatosJugadorContext";
import { UsarMovimientoContext } from "../../../contexts/UsarMovimientoContext";
import { useParams } from "react-router-dom";
import mov1 from "../../../assets/Movimientos/mov1.svg";
import mov2 from "../../../assets/Movimientos/mov2.svg";
import mov3 from "../../../assets/Movimientos/mov3.svg";
import mov4 from "../../../assets/Movimientos/mov4.svg";
import mov5 from "../../../assets/Movimientos/mov5.svg";
import mov6 from "../../../assets/Movimientos/mov6.svg";
import mov7 from "../../../assets/Movimientos/mov7.svg";
import "./CartasMovimiento.css";

const urlMap = {
  Diagonal: mov1,
  "Inverse Diagonal": mov2,
  Line: mov3,
  "Line Between": mov4,
  "Line Border": mov5,
  L: mov6,
  "Inverse L": mov7,
};

export const CartasMovimiento = () => {
  const { match_id } = useParams();
  const { datosJugador, setDatosJugador } = useContext(DatosJugadorContext);
  const { usarMovimiento, setUsarMovimiento } = useContext(UsarMovimientoContext);

  const [cartasMovimiento, setCartasMovimiento] = useState([]);
  const { ultimoEvento } = useContext(EventoContext);

  useEffect(() => {
    if (ultimoEvento !== null) {
      if (ultimoEvento.key == "GET_MOVEMENT_CARD") {
        setCartasMovimiento(ultimoEvento.payload.movement_card);
      }
    }
  }, [lastJsonMessage, setCartasMovimiento, ultimoEvento]);
  
  const handleCartaClick = ({carta, index}) => {
    if (!usarMovimiento.cartasUsadas.includes(carta.type)) {
      const isCartaHighlighted = usarMovimiento.highlightCarta.state && usarMovimiento.highlightCarta.key === index;

      if (isCartaHighlighted) {
        setUsarMovimiento({
          ...usarMovimiento,
          cartaSeleccionada: null,
          fichasSeleccionadas: [],
          highlightCarta: { state: false, key: null },
        });
      } else {
        setUsarMovimiento({
           ...usarMovimiento, 
           cartaSeleccionada: carta.type, 
           highlightCarta: { state: true, key: index } 
        });
      }
    };
  };

  return (
    <div className="cartas-movimientos">
      <div className="cartas-movimientos-propias">
        {cartasMovimiento.map((carta, index) => (
          <div 
            key={index}
            onMouseEnter={() => setUsarMovimiento({ ...usarMovimiento, cartaHovering: true })}
            onMouseLeave={() => setUsarMovimiento({ ...usarMovimiento, cartaHovering: false })}
            className={`carta-movimiento 
              ${usarMovimiento.cartaHovering && !usarMovimiento.highlightCarta.state ? 'hover:cursor-pointer hover:shadow-[0px_0px_15px_rgba(224,138,44,0.5)] hover:scale-105': ''} 
              ${usarMovimiento.highlightCarta.state && usarMovimiento.highlightCarta.key === index && !usarMovimiento.cartasUsadas.includes(carta.type)? 'cursor-pointer shadow-[0px_0px_20px_rgba(100,200,44,0.8)] scale-105': ''}
              ${usarMovimiento.cartasUsadas.includes(carta.type) ? 'opacity-25 pointer-events-none greyscale' : ''}`}
              
            onClick={() => handleCartaClick({carta, index})}
          >
            <img src={urlMap[carta[1]]} alt={carta[1]} />
          </div>
        ))}
      </div>
    </div>
  );
};


export default CartasMovimiento;
