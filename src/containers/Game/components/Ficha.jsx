import React from "react";
import { useContext } from "react";
import RedTile from "../../../assets/Colores/A.svg";
import YellowTile from "../../../assets/Colores/B.svg";
import GreenTile from "../../../assets/Colores/C.svg";
import BlueTile from "../../../assets/Colores/D.svg";
import { UsarMovimientoContext } from "../../../contexts/UsarMovimientoContext.jsx";
import { CompletarFiguraContext } from "../../../contexts/CompletarFiguraContext.jsx";

const images = {
  red: RedTile,
  yellow: YellowTile,
  green: GreenTile,
  blue: BlueTile,
};

export const Ficha = ({
  id,
  color,
  onClick,
  highlightClass,
  movimientoPosible,
  disabled,
  highlightFiguraInicial,
}) => {
  const tileImage = images[color];
  const { usarMovimiento, setUsarMovimiento } = useContext(
    UsarMovimientoContext,
  );
  const { cartaSeleccionada: cartaFiguraSeleccionada } = useContext(CompletarFiguraContext);

  const fichaEstaSeleccionada = usarMovimiento.fichasSeleccionadas.length > 0;

  return (
    <div
      id={id}
      onMouseEnter={() =>
        setUsarMovimiento({ ...usarMovimiento, fichaHovering: true })
      }
      onMouseLeave={() =>
        setUsarMovimiento({ ...usarMovimiento, fichaHovering: false })
      }
      className={`celda
                ${usarMovimiento.fichaHovering && !highlightClass ? "hover:cursor-pointer hover:shadow-[0px_0px_12px_rgba(224,138,44,1)] hover:scale-105" : ""} 
                ${(disabled && fichaEstaSeleccionada) || (!highlightFiguraInicial && cartaFiguraSeleccionada !== null) ? "opacity-40 pointer-events-none" : ""}
                ${highlightClass ? "cursor-pointer shadow-[0px_0px_12px_rgba(17,195,22,.8),0px_0px_20px_rgba(31,222,37,1)] scale-105" : ""}
                ${usarMovimiento.fichaHovering && movimientoPosible ? "hover:cursor-pointer hover:shadow-[0px_0px_12px_rgba(224,138,44,1),0px_0px_12px_rgba(224,138,44,1)] hover:scale-105" : ""}
                ${movimientoPosible && fichaEstaSeleccionada ? "animate-breathing" : ""}  
                ${highlightFiguraInicial ? "cursor-pointer border-gray-500 shadow-[0px_0px_10px_rgba(0,0,0,1)] animate-breathing" : ""}
                ${usarMovimiento.fichaHovering && highlightFiguraInicial ? "hover:cursor-pointer hover:shadow-[0px_0px_12px_rgba(192,192,192,.8),0px_0px_20px_rgba(255,255,255,1)] hover:scale-105" : ""}
                `}
      onClick={onClick}
    >
      <img className="h-auto max-w-full" src={tileImage} alt={`${color}`} />
    </div>
  );
};

export default Ficha;
