import React from 'react'
import { useEffect, useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Ficha } from './Ficha.jsx';
import { Alerts } from "../../../components/Alerts";
import "./Tablero.css";
import { UsarMovimientoContext } from '../../../contexts/UsarMovimientoContext.jsx';
import { DatosJugadorContext } from '../../../contexts/DatosJugadorContext.jsx';
import { ServicioPartida } from "../../../services/ServicioPartida.js";
import { calcularMovimientos } from "../../../services/calcularMovimientos.js";

export const Tablero = ({ tiles }) => {
  const { match_id } = useParams();

  const {newTablero, setNewTablero} = useState([]);
  const {datosJugador, setDatosJugador} = useContext(DatosJugadorContext);
  const { usarMovimiento, setUsarMovimiento } = useContext(UsarMovimientoContext);
  const [movimientos, setMovimientos] = useState([]);

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
        const movimientosCalculados = calcularMovimientos(rowIndex, columnIndex, usarMovimiento.cartaSeleccionada);
        setTimeout(() => {
          setUsarMovimiento(prev => ({ ...prev, movimientosPosibles: movimientosCalculados }));
        }, 0);
        // setMovimientos(movimientosCalculados);
        
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
      llamarServicio(usarMovimiento.fichasSeleccionadas);
    }
  }, [usarMovimiento.fichasSeleccionadas]);

  const llamarServicio = async (newFichasSeleccionadas) => {
    try {
      const resJson = await ServicioPartida.validarMovimiento(
        match_id,
        datosJugador.player_id,
        newFichasSeleccionadas,
        usarMovimiento.cartaSeleccionada
      );
      console.log(resJson);

      //realizar swap de fichas

      setTimeout(() => {
        setUsarMovimiento({
          ...usarMovimiento,
          fichasSeleccionadas: [],
          cartaSeleccionada: null,
          cartasUsadas: [...usarMovimiento.cartasUsadas, usarMovimiento.cartaSeleccionada],
          highlightCarta: { state: false, key: '' },
        });
      }, 700);
    } catch (err) {
      setMensajeAlerta("Error al validar movimiento");
      setMostrarAlerta(true);
      setUsarMovimiento({
        ...usarMovimiento,
        fichasSeleccionadas: [],
      });
      setTimeout(() => {
        setMostrarAlerta(false);
      },1000);
      console.log(err);
    }
  }

  const estaHighlighted = (rowIndex, columnIndex) => {
    return usarMovimiento.fichasSeleccionadas.some(ficha => ficha.rowIndex === rowIndex && ficha.columnIndex === columnIndex);
  };

  const esMovimientoPosible = (rowIndex, columnIndex) => {
    return usarMovimiento.movimientosPosibles.some(movimiento => movimiento[0] === rowIndex && movimiento[1] === columnIndex);
  };

  const gridCell = tiles.map((row, rowIndex) => {
    return row.map((tileColor, columnIndex) => {
      const highlighted = estaHighlighted(rowIndex, columnIndex);
      const movimientoPosible = esMovimientoPosible(rowIndex, columnIndex);
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