import React, { useState } from 'react';
import { ServicioPartida } from "../../../services/ServicioPartida.js";

export const FiltrosDeBusqueda = ({ setPartidas }) => {

  const [maximoJugadores, setMaximoJugadores] = useState(0);

  const manejarClick = async () => {
    console.log(maximoJugadores);
    if (maximoJugadores <= 0 || maximoJugadores > 4) {
      // mostrar alerta, con toast
      return;
    }

    try {
      const respuesta = await ServicioPartida.listarPartidas(maximoJugadores);
      setPartidas(respuesta);
    } catch (error) {
      console.log(error);
      //mostrar alerta
    }
  };

  return (
    <div className="dropdown">
      <div tabIndex={0} role="button" className="btn m-1"><svg className="h-8 w-8 text-gray-500" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <path d="M5.5 5h13a1 1 0 0 1 0.5 1.5L14 12L14 19L10 16L10 12L5 6.5a1 1 0 0 1 0.5 -1.5" /></svg> Filtrar
      </div>
      <div
        tabIndex={0}
        className="dropdown-content card card-compact bg-base-100 z-[1] w-64 p-2 shadow">
        <div className="card-body">
          <h3 className="card-title">Filtros de búsqueda</h3>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Máximo de jugadores</span>
            </div>
            <input type="number" min="0" max="4" placeholder="Número de jugadores" className="input input-bordered w-full max-w-xs" onChange={(event) => setMaximoJugadores(event.target.value)} />
            <div className="card-actions justify-end mt-3">
              <button className="btn btn-primary" onClick={manejarClick}>Filtrar</button>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}

export default FiltrosDeBusqueda;

