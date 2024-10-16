import React from "react";
import { useEffect, useContext, useState } from "react";
import { EventoContext } from "../../../contexts/EventoContext";
import mov1 from "../../../assets/Movimientos/mov1.svg";
import mov2 from "../../../assets/Movimientos/mov2.svg";
import mov3 from "../../../assets/Movimientos/mov3.svg";
import mov4 from "../../../assets/Movimientos/mov4.svg";
import mov5 from "../../../assets/Movimientos/mov5.svg";
import mov6 from "../../../assets/Movimientos/mov6.svg";
import mov7 from "../../../assets/Movimientos/mov7.svg";
import "./CartasMovimiento.css";

const urlMap = {
  'Diagonal': mov1,
  'Inverse Diagonal': mov2,
  'Line': mov3,
  'Line Between': mov4,
  'Line Border"': mov5,
  'L': mov6,
  'Inverse L': mov7,
};

export const CartasMovimiento = () => {
  const [cartasMovimiento, setCartasMovimiento] = useState([]);
  const { ultimoEvento } = useContext(EventoContext);

  useEffect(() => {
    if (ultimoEvento !== null) {
      if (ultimoEvento.key == "GET_MOVEMENT_CARD") {
        setCartasMovimiento(ultimoEvento.payload.movement_card);
      }
    }
  }, [ultimoEvento]);

  return (
    <div className="cartas-movimientos">
      <div className="cartas-movimientos-propias">
        {cartasMovimiento.map((carta, index) => (
          <div key={index} className="carta-movimiento">
            <img src={urlMap[carta[1]]} alt={carta[1]} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CartasMovimiento;
