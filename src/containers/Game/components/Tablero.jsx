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
      else if (usarMovimiento.fichasSeleccionadas.length < 2) {
        // Agregar la ficha seleccionada si el array tiene menos de 2 fichas
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
    console.log('Fichas seleccionadas:', usarMovimiento.fichasSeleccionadas);
    if (usarMovimiento.fichasSeleccionadas.length === 2 && !haValidadoMovimiento) {
      // Ejecutar swapFichas y limpiar fichas seleccionadas
      setHaValidadoMovimiento(true);
      llamarServicio(usarMovimiento.fichasSeleccionadas);
    }
  }, [usarMovimiento.fichasSeleccionadas]);

  const llamarServicio = async (newFichasSeleccionadas) => {
    console.log("Entrando al servicio");
    try {
      console.log(newFichasSeleccionadas);
      console.log(usarMovimiento.cartaSeleccionada);
      const resJson = await ServicioPartida.validarMovimiento(
        match_id,
        datosJugador.player_id,
        newFichasSeleccionadas,
        usarMovimiento.cartaSeleccionada
      );
      console.log(resJson);
      // Realizar animacion de swap.
      console.log("Use swapFichas");
      swapFichas(newFichasSeleccionadas);
      // Actualizar selecciones
      setTimeout(() => {
        setUsarMovimiento({
          ...usarMovimiento,
          fichasSeleccionadas: [],
          cartaSeleccionada: null,
          cartasUsadas: [...usarMovimiento.cartasUsadas, usarMovimiento.cartaSeleccionada],
          highlightCarta: { state: false, key: '' },
        });
      }, 700);
      setHaValidadoMovimiento(false);
    } catch (err) {
      setMensajeAlerta("Error al validar movimiento");
      console.log(err);
    }
  }

  const estaHighlighted = (rowIndex, columnIndex) => {
    return usarMovimiento.fichasSeleccionadas.some(ficha => ficha.rowIndex === rowIndex && ficha.columnIndex === columnIndex);
  };

  const gridCell = tiles.map((row, rowIndex) => {
    return row.map((tileColor, columnIndex) => {
      return (
        <Ficha 
          id={`ficha-${rowIndex}-${columnIndex}`}
          key={`${rowIndex}-${columnIndex}`}
          color={tileColor} 
          onClick={() => handleFichaClick(rowIndex, columnIndex)}
          highlightClass={estaHighlighted(rowIndex, columnIndex)}
        />
      );
    });
  });
  return (
    <div className="tablero flex w-100 h-screen justify-center items-center">
      {mostrarAlerta && <Alerts type={'error'} message={mensajeAlerta} />}
      <div className="tablero-grid grid grid-cols-6 gap-1">
        {gridCell}
      </div>
    </div>
  );
};

export default Tablero;
