import React, { useState, useEffect } from "react";
import { Alerts } from "../../../components/Alerts.jsx";
import "./ListaPartidas.css";
import CrearPartida from "./CrearPartida.jsx";
import UnirsePartida from "./UnirsePartida.jsx";

export const ListaPartidas = () => {
  const [partidas, setPartidas] = useState([]);
  const [selectedPartida, setSelectedPartida] = useState(null);
  const [alert, setAlert] = useState(null);

  const fetchPartidas = async () => {
    try {
      const response = await fetch("/matches");

      if (!response.ok) {
        throw new Error("Error en fetch");
      }

      const data = await response.json();
      setPartidas(data);
      setAlert(null);
    } catch (error) {
      setAlert({
        type: "info",
        message: "No hay partidas disponibles",
      });
    }
  };

  useEffect(() => {
    fetchPartidas();
  }, []);

  function refreshPartidas() {
    fetchPartidas();
  }

  function handleSelectPartida(partida) {
    setSelectedPartida(partida);
  }

  return (
    <>
      {alert && alert.type && alert.message && (
        <Alerts type={alert.type} message={alert.message} />
      )}
      <div className="Partidas">
        <div className="table-container">
          <table className="table-xs">
            {/* Defino las columnas de la tabla */}
            <thead>
              <tr>
                <th></th>
                <th>Nombre de Sala</th>
                <th className="cantidad-jugadores">Jugadores</th>
              </tr>
            </thead>
            <tbody>
              {/* Defino las filas de la tabla */}
              {partidas.map((partida) => (
                <tr
                  key={partida.id}
                  onClick={() => handleSelectPartida(partida)}
                  style={{
                    cursor: "pointer",
                    backgroundColor:
                      selectedPartida?.id === partida.id
                        ? "rgba(0, 123, 255,0.4)"
                        : "transparent",
                  }}
                >
                  <td>{partida.id}</td>
                  <td>{partida.nombre}</td>
                  <td className="cantidad-jugadores">
                    {partida.jugadoresActuales}/{partida.jugadoresMaximos}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="buttons-menu">
          <button className="refresh-button btn mb-1" onClick={refreshPartidas}>
            <svg
              className="h-2 w-2 text-gray-700"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="23 4 23 10 17 10" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
            Refrescar
          </button>
          <CrearPartida />
          <UnirsePartida idPartida={selectedPartida?.id} />
        </div>
      </div>
    </>
  );
};

export default ListaPartidas;
