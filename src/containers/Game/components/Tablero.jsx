import React from 'react'
import RedTile from '../../../assets/Colores/A.svg';
import YellowTile from '../../../assets/Colores/B.svg';
import GreenTile from '../../../assets/Colores/C.svg';
import BlueTile from '../../../assets/Colores/D.svg';
import "./Tablero.css";

export const Tablero = () => {
    const rows = 6;
    const columns = 6;
    const size = rows * columns;

    const images = [RedTile, YellowTile, GreenTile, BlueTile];
    
    const crearGrilla = () => {
      const gridItems = [];
      for (let i = 0; i < size; i++) {
        gridItems.push(
          <div key={i} className="cell">
            <img className="h-auto max-w-full" src={images[i % images.length]} alt={`Image ${i + 1}`} />
          </div>
        );
      }
      return gridItems;
    };
  
    return (
      <div className="tablero flex w-100 h-screen justify-center items-center">
        <div className="tablero-grid grid grid-cols-6 gap-1">
          {crearGrilla()}
        </div>
      </div>
    );
  };
