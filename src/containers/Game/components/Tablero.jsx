import React from 'react'
import RedTile from '../../../assets/Colores/A.svg';
import YellowTile from '../../../assets/Colores/B.svg';
import GreenTile from '../../../assets/Colores/C.svg';
import BlueTile from '../../../assets/Colores/D.svg';
import "./Tablero.css";

export const Tablero = ({tiles}) => {
    const rows = 6;
    const columns = 6;
    const size = rows * columns;

    const images = {
      red: RedTile,
      yellow: YellowTile,
      green: GreenTile,
      blue: BlueTile,
    };
    
    const crearGrilla = () => {
      const gridItems = [];
      for (let i = 0; i < size; i++) {
        const tileColor = tiles[i % tiles.length];
        const tileImage = images[tileColor];
        gridItems.push(
          <div key={i} className="cell">
            <img className="h-auto max-w-full" src={tileImage} alt={`Tile ${i + 1}`} />
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
