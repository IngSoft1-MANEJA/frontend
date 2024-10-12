import React from 'react'
import { useState, useEffect } from 'react';
import { Ficha } from './Ficha.jsx';
import "./Tablero.css";

export const Tablero = ({ tiles, cartaSeleccionada, onFichasSeleccionadas }) => {
  const [fichasSeleccionadas, setFichasSeleccionadas] = useState([]);
  const [highlightFicha, setHighlightFicha] = useState([]);
  
  const handleFichaClick = (rowIndex, columnIndex) => {
    if (cartaSeleccionada !== null) {
      const fichaEstaSeleccionada = fichasSeleccionadas.some(ficha => ficha.rowIndex === rowIndex && ficha.columnIndex === columnIndex);

      if (fichaEstaSeleccionada) {
        // si la ficha ya esta seleccionada, deseleccionarla al hacer click nuevamente
        const newFichasSeleccionadas = fichasSeleccionadas.filter(ficha => ficha.rowIndex !== rowIndex || ficha.columnIndex !== columnIndex);
        const newHighlightFicha = highlightFicha.filter(ficha => ficha.rowIndex !== rowIndex || ficha.columnIndex !== columnIndex);
        setFichasSeleccionadas(newFichasSeleccionadas);
        setHighlightFicha(newHighlightFicha);
      } 
      else if (fichasSeleccionadas.length < 2) {
        // si la ficha no esta seleccionada, seleccionarla
        const newFichasSeleccionadas = [...fichasSeleccionadas, { rowIndex, columnIndex }];
        setFichasSeleccionadas(newFichasSeleccionadas);
        setHighlightFicha([...highlightFicha, { rowIndex, columnIndex }]);

        if (newFichasSeleccionadas.length === 2) {
          // TODO enviar movimiento al server para confirmar si es valido

          // Si el movimiento es valido, enviar las fichas seleccionadas al padre
          onFichasSeleccionadas(newFichasSeleccionadas);
          setFichasSeleccionadas([]);
          setTimeout(() => {
            setHighlightFicha([]);
          }, 1000);
          
        }
      }
    }
  };

  const estaHighlighted = (rowIndex, columnIndex) => {
    return highlightFicha.some(ficha => ficha.rowIndex === rowIndex && ficha.columnIndex === columnIndex);
  };

  const gridCell = tiles.map((row, rowIndex) => {
    return row.map((tileColor, columnIndex) => {
      return (
        <Ficha 
          key={`${rowIndex}-${columnIndex}`}
          id={`${rowIndex}-${columnIndex}`}
          color={tileColor} 
          onClick={() => handleFichaClick(rowIndex, columnIndex)}
          highlightClass={estaHighlighted(rowIndex, columnIndex) ? 'cursor-pointer shadow-[0px_0px_25px_rgba(100,200,44,1)] scale-105' : ''}
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

