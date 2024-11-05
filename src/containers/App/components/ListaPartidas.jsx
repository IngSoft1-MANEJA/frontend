import React, { useState, useEffect } from "react";
import { Alerts } from "../../../components/Alerts.jsx";
import "./ListaPartidas.css";
import CrearPartida from "./CrearPartida.jsx";
import UnirsePartida from "./UnirsePartida.jsx";
import { ServicioPartida } from "../../../services/ServicioPartida.js";
import FiltrosDeBusqueda from "./FiltrosDeBusqueda.jsx";

export const ListaPartidas = () => {
  const [partidas, setPartidas] = useState([]);
  const [selectedPartida, setSelectedPartida] = useState(null);
  const [mensaje, setMensaje] = useState("");

  const fetchPartidas = async () => {
    try {
      const data = await ServicioPartida.listarPartidas();
      setPartidas(data);

      if (data.length === 0) {
        setMensaje("No se encuentran partidas disponibles");
      }
    } catch (error) {
      console.error(`Error en fetch de partidas: ${error}`);
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
    <div>
      <h1 className="poiret-one-regular text-8xl pb-5">EL SWITCHER</h1>
      <div className="m-auto">
        <FiltrosDeBusqueda setPartidas={setPartidas} />
      </div>
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
              {partidas.length === 0 ? (
                <>
                  <tr>
                    <td colSpan="3" style={{ height: "20px" }}></td>
                  </tr>
                  <tr>
                    <td
                      colSpan="3"
                      style={{
                        textAlign: "center",
                        color: "gray",
                        fontSize: "1.2em",
                      }}
                    >
                      {mensaje}
                    </td>
                  </tr>
                </>
              ) : (
                partidas.map((partida) => (
                  <tr
                    key={partida.match_id}
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
                    <td>{partida.match_name}</td>
                    <td className="cantidad-jugadores">
                      {partida.current_players}/{partida.max_players}
                    </td>
                  </tr>
                ))
              )}
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
    </div>
  );
};

export default ListaPartidas;
