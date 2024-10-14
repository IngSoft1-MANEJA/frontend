import React from 'react'
import { useEffect, useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import useWebSocket from "react-use-websocket";
import { WEBSOCKET_URL } from "../../../variablesConfiguracion.js";
import { Ficha } from './Ficha.jsx';
import { Alerts } from "../../../components/Alerts";
import "./Tablero.css";
import { DatosJugadorContext } from "../../../contexts/DatosJugadorContext";
import { UsarMovimientoContext } from '../../../contexts/UsarMovimientoContext.jsx';
import { ServicioPartida } from "../../../services/ServicioPartida.js";

export const Tablero = ({ tiles }) => {
  const { match_id } = useParams();
  const { datosJugador, setDatosJugador } = useContext(DatosJugadorContext);
  const { usarMovimiento, setUsarMovimiento } = useContext(UsarMovimientoContext);

  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState("");


  const handleFichaClick = async (rowIndex, columnIndex) => {

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
          //validar movimiento
          try {
            const resJson = await ServicioPartida.validarMovimiento(
              match_id, datosJugador.player_id
            );
            console.log(resJson);
            if (resJson.isValid) { 
              setTimeout(() => {
                setUsarMovimiento({
                  ...usarMovimiento,
                  fichasSeleccionadas: [],
                  cartaSeleccionada: null,
                  cartasUsadas: [...usarMovimiento.cartasUsadas, usarMovimiento.cartaSeleccionada],
                  highlightCarta: { state: false, key: '' },
                });
              }, 700);
            } else {
              setMensajeAlerta("Movimiento inválido");
              setMostrarAlerta(true);
              setUsarMovimiento({
                ...usarMovimiento,
                fichasSeleccionadas: [],
              });
              setTimeout(() => {
                setMostrarAlerta(false);
              },1000);
              console.log('Movimiento inválido');
            }
          } catch (err) {
            setMensajeAlerta("Error creando sala de partida");
            console.log(err);
          }
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
      {mostrarAlerta && <Alerts type={'error'} message={mensajeAlerta} />}
      <div className="tablero-grid grid grid-cols-6 gap-1">
        {gridCell}
      </div>
    </div>
  );
};

export default Tablero;

