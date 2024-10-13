import React from 'react'
import { useEffect, useContext } from 'react';
import { Ficha } from './Ficha.jsx';
import "./Tablero.css";
import { UsarMovimientoContext } from '../../../contexts/UsarMovimientoContext.jsx';

export const Tablero = ({ tiles }) => {
  const { usarMovimiento, setUsarMovimiento } = useContext(UsarMovimientoContext);
  
  const handleFichaClick = (rowIndex, columnIndex) => {
    if (usarMovimiento.cartaSeleccionada !== null) {
      const fichaEstaSeleccionada = usarMovimiento.fichasSeleccionadas.some(ficha => ficha.rowIndex === rowIndex && ficha.columnIndex === columnIndex);

      if (fichaEstaSeleccionada) {
        // si la ficha ya esta seleccionada, deseleccionarla al hacer click nuevamente
        const newFichasSeleccionadas = usarMovimiento.fichasSeleccionadas.filter(ficha => ficha.rowIndex !== rowIndex || ficha.columnIndex !== columnIndex);
        setUsarMovimiento({ ...usarMovimiento, fichasSeleccionadas: newFichasSeleccionadas });
      } 
      else if (usarMovimiento.fichasSeleccionadas.length < 2) {
        // si la ficha no esta seleccionada, seleccionarla
        const newFichasSeleccionadas = [...usarMovimiento.fichasSeleccionadas, { rowIndex, columnIndex }];
        setUsarMovimiento({ ...usarMovimiento, fichasSeleccionadas: newFichasSeleccionadas });

        if (usarMovimiento.fichasSeleccionadas.length === 1) {
          // TODO enviar movimiento al server para confirmar si es valido

          // Si el movimiento es valido, enviar las fichas seleccionadas al padre

          const carta = usarMovimiento.cartaSeleccionada;
          setTimeout(() => {
            setUsarMovimiento({
              ...usarMovimiento,
              fichasSeleccionadas: [],
              cartaSeleccionada: null,
              cartasUsadas: [...usarMovimiento.cartasUsadas, usarMovimiento.cartaSeleccionada],
              highlightCarta: { state: false, key: '' },
            });
          }, 700);
          
        }
      }
    }
    else {
      setUsarMovimiento({ ...usarMovimiento, fichasSeleccionadas: [] });
    }
  };

  const estaHighlighted = (rowIndex, columnIndex) => {
    return usarMovimiento.fichasSeleccionadas.some(ficha => ficha.rowIndex === rowIndex && ficha.columnIndex === columnIndex);
  };

  const gridCell = tiles.map((row, rowIndex) => {
    return row.map((tileColor, columnIndex) => {
      return (
        <Ficha 
          key={`${rowIndex}-${columnIndex}`}
          id={`${rowIndex}-${columnIndex}`}
          color={tileColor} 
          onClick={() => handleFichaClick(rowIndex, columnIndex)}
          highlightClass={estaHighlighted(rowIndex, columnIndex)}
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

