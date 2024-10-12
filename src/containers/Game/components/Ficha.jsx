import React from 'react'
import { useState } from 'react'
import RedTile from '../../../assets/Colores/A.svg';
import YellowTile from '../../../assets/Colores/B.svg';
import GreenTile from '../../../assets/Colores/C.svg';
import BlueTile from '../../../assets/Colores/D.svg';

const images = {
    red: RedTile,
    yellow: YellowTile,
    green: GreenTile,
    blue: BlueTile,
};

export const Ficha = ({id, color, onClick, highlightClass }) => {
    const tileImage = images[color];
    const [hovering, setHovering] = useState(false);

    return (
        <div
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            className={`celda
                ${hovering ? 'hover:cursor-pointer hover:shadow-[0px_0px_12px_rgba(224,138,44,1)] hover:scale-105': ''} 
                ${highlightClass}`} 
            onClick={onClick}
        >
            <img className="h-auto max-w-full" src={tileImage} alt={`${color}`} />
        </div>
    )
}

export default Ficha;