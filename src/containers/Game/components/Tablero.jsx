import React from 'react'
import { useState } from 'react';
import { Ficha } from './Ficha.jsx';
import "./Tablero.css";

export const Tablero = ({ tiles, selectedCarta, onFichasSeleccionadas }) => {
  const [selectedFichas, setSelectedFichas] = useState([]);
  
  const handleFichaClick = (rowIndex, columnIndex) => {
    if (selectedFichas.length < 2 && !selectedFichas.some(f => f.rowIndex === rowIndex && f.columnIndex === columnIndex)) {
      const newSelectedFichas = [...selectedFichas, { rowIndex, columnIndex }];
      setSelectedFichas(newSelectedFichas);
      
      if (newSelectedFichas.length === 2) {
        onFichasSeleccionadas(newSelectedFichas);
      }
    }
  };

  const gridCell = tiles.map((row, rowIndex) => {
    return row.map((tileColor, columnIndex) => {
      return (
        <Ficha 
          key={`${rowIndex}-${columnIndex}`} 
          color={tileColor} 
          onClick={() => handleFichaClick(rowIndex, columnIndex)}
        />
      );
    });
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

