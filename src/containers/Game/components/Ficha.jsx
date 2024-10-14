import React from 'react'
import { useContext } from 'react'
import RedTile from '../../../assets/Colores/A.svg';
import YellowTile from '../../../assets/Colores/B.svg';
import GreenTile from '../../../assets/Colores/C.svg';
import BlueTile from '../../../assets/Colores/D.svg';
import { UsarMovimientoContext } from '../../../contexts/UsarMovimientoContext.jsx';

const images = {
    red: RedTile,
    yellow: YellowTile,
    green: GreenTile,
    blue: BlueTile,
};

export const Ficha = ({color, onClick, highlightClass }) => {
    const tileImage = images[color];
    const { usarMovimiento, setUsarMovimiento } = useContext(UsarMovimientoContext);

    return (
        <div
            onMouseEnter={() => setUsarMovimiento({ ...usarMovimiento, fichaHovering: true })}
            onMouseLeave={() => setUsarMovimiento({ ...usarMovimiento, fichaHovering: false })}
            className={`celda
                ${usarMovimiento.fichaHovering && !highlightClass ? 'hover:cursor-pointer hover:shadow-[0px_0px_12px_rgba(224,138,44,1)] hover:scale-105': ''} 
                ${highlightClass ? 'cursor-pointer shadow-[0px_0px_17px_rgba(100,200,44,0.8),0px_0px_25px_rgba(100,200,44,1)] scale-105' : ''}`} 
            onClick={onClick}
        >
            <img className="h-auto max-w-full" src={tileImage} alt={`${color}`} />
        </div>
    )
}

export default Ficha;