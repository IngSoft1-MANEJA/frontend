import React, { useState } from 'react';

export const FiltrosDeBusqueda = ({ alFiltrarPorMaximoDeJugadores }) => {

  const [maximoJugadores, setMaximoJugadores] = useState("0");
  const [badge, setBadge] = useState("");
  const [mensajeError, setMensajeError] = useState("");

  const manejarClick = async () => {
    const valor = parseInt(maximoJugadores);

    if (Number.isNaN(valor)) {
      setMensajeError("El número de jugadores debe ser un número entero");
      return;
    }

    if (valor <= 0 || valor > 4) {
      setMensajeError("El número de jugadores debe ser mayor a 0 y menor o igual a 4");
      return;
    }

    try {
      alFiltrarPorMaximoDeJugadores(valor);
    } catch (error) {
      console.log(error);
      return;
    }

    setBadge(valor);
    setMensajeError("");
  };

  const eliminarBadge = () => {
    setBadge("");
    setMaximoJugadores("0");
    alFiltrarPorMaximoDeJugadores(null);
  };

  return (
    <div className="ml-8 flex items-center">
      <div className="dropdown">
        <div tabIndex={0} role="button" className="btn m-1">
          <svg
            className="h-8 w-8 text-gray-500"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {" "}
            <path stroke="none" d="M0 0h24v24H0z" />{" "}
            <path d="M5.5 5h13a1 1 0 0 1 0.5 1.5L14 12L14 19L10 16L10 12L5 6.5a1 1 0 0 1 0.5 -1.5" />
          </svg>{" "}
          Filtros
        </div>
        <div
          tabIndex={0}
          className="dropdown-content card card-compact bg-base-100 z-[1] w-64 p-2 shadow"
        >
          <div className="card-body">
            <h3 className="card-title">Filtros de búsqueda</h3>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Máximo de jugadores</span>
              </div>
              <input
                type="number"
                min="0"
                max="4"
                value={maximoJugadores}
                placeholder="Número de jugadores"
                className={`input input-bordered w-full max-w-xs ${mensajeError ? "input-error" : ""}`}
                onChange={(event) => setMaximoJugadores(event.target.value)}
              />
              <div className="label">
                <span className="label-text-alt text-error">
                  {mensajeError}
                </span>
              </div>
              <div className="card-actions justify-end mt-3">
                <button className="btn btn-primary" onClick={manejarClick}>
                  Filtrar
                </button>
              </div>
            </label>
          </div>
        </div>
      </div>
      {badge && (
        <div id="badge" className="badge badge-neutral ml-8 py-3">
          Máximo de jugadores: {badge}
          <button
            className="btn btn-xs btn-circle btn-ghost ml-2"
            onClick={eliminarBadge}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}

export default FiltrosDeBusqueda;

