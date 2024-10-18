import React from 'react'
import { useEffect, useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Ficha } from './Ficha.jsx';
import { Alerts } from "../../../components/Alerts";
import "./Tablero.css";
import { UsarMovimientoContext } from '../../../contexts/UsarMovimientoContext.jsx';
import { DatosJugadorContext } from '../../../contexts/DatosJugadorContext.jsx';
import { EventoContext } from '../../../contexts/EventoContext.jsx';
import { ServicioPartida } from "../../../services/ServicioPartida.js";
import { set } from 'react-hook-form';

export const Tablero = () => {
  const { match_id } = useParams();
  const { datosJugador, setDatosJugador } = useContext(DatosJugadorContext);
  const { usarMovimiento, setUsarMovimiento } = useContext(UsarMovimientoContext);
  const { ultimoEvento } = useContext(EventoContext);

  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState("");
  const [tiles, setTiles] = useState([]);
  const [haValidadoMovimiento, setHaValidadoMovimiento] = useState(false);

  useEffect(() => {
    if (ultimoEvento !== null) {
      if (ultimoEvento.key === "GET_PLAYER_MATCH_INFO") {
        console.log("Llegó el evento GET_PLAYER_MATCH_INFO en tablero");
        setTiles(ultimoEvento.payload.board);
      }
      if (ultimoEvento.key === "PLAYER_RECEIVE_NEW_BOARD") {
        console.log("Llegó el evento PLAYER_RECEIVE_NEW_BOARD");
        setTiles(ultimoEvento.payload.board);
        
      }
    }
  }, [ultimoEvento]);


  const swapFichas = (fichasSeleccionadas) => {

    if (fichasSeleccionadas.length === 2) {
      const [ficha1, ficha2] = usarMovimiento.fichasSeleccionadas;
    
      const { rowIndex: filaFicha1, columnIndex: columnaFicha1 } = ficha1;
      const { rowIndex: filaFicha2, columnIndex: columnaFicha2 } = ficha2;
    
      const ficha1Element = document.getElementById(`ficha-${filaFicha1}-${columnaFicha1}`);
      const ficha2Element = document.getElementById(`ficha-${filaFicha2}-${columnaFicha2}`);
    
      // Aplicar la clase para desvanecer las fichas
      ficha1Element.classList.add('oculto');
      ficha2Element.classList.add('oculto');
    
      // Esperar a que la animación termine antes de intercambiar
      setTimeout(() => {
        // Intercambiar las fichas en el estado
        const newTiles = tiles.map(row => [...row]);
    
        const temp = newTiles[filaFicha1][columnaFicha1];
        newTiles[filaFicha1][columnaFicha1] = newTiles[filaFicha2][columnaFicha2];
        newTiles[filaFicha2][columnaFicha2] = temp;
    
        setTiles(newTiles);
    
        // Mostrar las fichas intercambiadas
        ficha1Element.classList.remove('oculto');
        ficha2Element.classList.remove('oculto');
    
        // Limpiar la selección de fichas
        setUsarMovimiento(prev => ({
          ...prev,
          fichasSeleccionadas: [],
          cartaSeleccionada: null,
        }));
      }, 500); // Duración de la animación (0.5s)
    }
  };

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
        const movimientosCalculados = ServicioMovimiento.calcularMovimientos(rowIndex, columnIndex, usarMovimiento.cartaSeleccionada[1]);
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
    if (usarMovimiento.fichasSeleccionadas.length === 2 && !haValidadoMovimiento) {
      setHaValidadoMovimiento(true);
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