import React from 'react'
import { useEffect, useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Ficha } from './Ficha.jsx';
import { Alerts } from "../../../components/Alerts";
import "./Tablero.css";
import { UsarMovimientoContext } from '../../../contexts/UsarMovimientoContext.jsx';
import { DatosJugadorContext } from '../../../contexts/DatosJugadorContext.jsx';
import { ServicioMovimiento } from "../../../services/ServicioMovimiento.js";

export const Tablero = ({ tiles }) => {
  const { match_id } = useParams();
  const { datosJugador } = useContext(DatosJugadorContext);
  const { usarMovimiento, setUsarMovimiento } = useContext(UsarMovimientoContext);
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState("");

  const handleFichaClick = async (rowIndex, columnIndex) => {
    if (usarMovimiento.cartaSeleccionada !== null) {
      const fichaEstaSeleccionada = usarMovimiento.fichasSeleccionadas.some(ficha => ficha.rowIndex === rowIndex && ficha.columnIndex === columnIndex);
  
      if (fichaEstaSeleccionada) {
        // Deseleccionar la ficha si ya estaba seleccionada
        const newFichasSeleccionadas = usarMovimiento.fichasSeleccionadas.filter(ficha => ficha.rowIndex !== rowIndex || ficha.columnIndex !== columnIndex);
        setUsarMovimiento(prev => ({ ...prev, fichasSeleccionadas: newFichasSeleccionadas }));
      } 
      else if (usarMovimiento.fichasSeleccionadas.length === 0) {
        // Seleccionar la primera ficha y calcular los movimientos posibles
        setUsarMovimiento(prev => {
          const newFichasSeleccionadas = [...prev.fichasSeleccionadas, { rowIndex, columnIndex }];
          return { ...prev, fichasSeleccionadas: newFichasSeleccionadas };
        });
  
        // Calcular movimientos inmediatamente después de seleccionar la primera ficha
        const movimientosCalculados = ServicioMovimiento.calcularMovimientos(rowIndex, columnIndex, usarMovimiento.cartaSeleccionada);
        setTimeout(() => {
          setUsarMovimiento(prev => ({ ...prev, movimientosPosibles: movimientosCalculados }));
        }, 0);
        
      } else if (usarMovimiento.fichasSeleccionadas.length === 1) {
        // Seleccionar la segunda ficha
        setUsarMovimiento(prev => {
          const newFichasSeleccionadas = [...prev.fichasSeleccionadas, { rowIndex, columnIndex }];
          return { ...prev, fichasSeleccionadas: newFichasSeleccionadas };
        });
      }
    } else {
      setUsarMovimiento({ ...usarMovimiento, fichasSeleccionadas: [] });
    }
  };

  useEffect(() => {
    console.log(usarMovimiento.fichasSeleccionadas);
    if (usarMovimiento.fichasSeleccionadas.length === 2) {
      ServicioMovimiento.llamarServicio(
        match_id, 
        datosJugador.player_id, 
        usarMovimiento.fichasSeleccionadas, 
        usarMovimiento.cartaSeleccionada, 
        setUsarMovimiento, 
        setMensajeAlerta, 
        setMostrarAlerta
      );
    }
  }, [usarMovimiento.fichasSeleccionadas]);

  const gridCell = tiles.map((row, rowIndex) => {
    return row.map((tileColor, columnIndex) => {
      const highlighted = ServicioMovimiento.estaHighlighted(rowIndex, columnIndex, usarMovimiento.fichasSeleccionadas);
      const movimientoPosible = ServicioMovimiento.esMovimientoPosible(rowIndex, columnIndex, usarMovimiento.movimientosPosibles);
      const deshabilitado = !highlighted && !movimientoPosible;
      return (
        <Ficha 
          id={`ficha-${rowIndex}-${columnIndex}`}
          key={`${rowIndex}-${columnIndex}`}
          color={tileColor} 
          onClick={() => handleFichaClick(rowIndex, columnIndex)}
          highlightClass={highlighted}
          movimientoPosible={movimientoPosible}
          disabled={deshabilitado}
        />
      );
    });
  });

  return (
    <div className="tablero flex w-100 h-screen justify-center items-center">
      {mostrarAlerta && (
        <div className="fixed top-3 right-3 w-2/5 z-50">
          <Alerts type={"error"} message={mensajeAlerta} />
        </div>
      )}
      <div className="tablero-grid grid grid-cols-6 gap-1">
        {gridCell}
      </div>
    </div>
  );
};

export default Tablero;