import React from 'react'
import { Ficha } from './Ficha.jsx';
import "./Tablero.css";

export const Tablero = ({tiles}) => {

    const gridCell = tiles.map((tile, index) => {
      return (
        <Ficha key={index} color={tile}/>
      );
    });

    return (
      <div className="tablero flex w-100 h-screen justify-center items-center">
        <div className="tablero-grid grid grid-cols-6 gap-1">
          {gridCell}
        </div>
      </div>
    );
};

export default Tablero;

