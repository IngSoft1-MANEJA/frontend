import React, { useState, useEffect } from "react";
import "./ListaPartidas.css";
import CrearPartida from "./CrearPartida.jsx";
import UnirsePartida from "./UnirsePartida.jsx";
import useWebSocket from "react-use-websocket";
import { WebsocketEvents } from "../../../services/ServicioWebsocket.js";
import { WEBSOCKET_URL } from "../../../variablesConfiguracion.js";
import FiltrosDeBusqueda from "./FiltrosDeBusqueda.jsx";

export const ListaPartidas = () => {
  const [partidas, setPartidas] = useState([]);
  const [selectedPartida, setSelectedPartida] = useState(null);

  const { lastJsonMessage, sendJsonMessage } = useWebSocket(
    `${WEBSOCKET_URL}/matches/ws`,
  );

  useEffect(() => {
    if (lastJsonMessage?.key === WebsocketEvents.MATCHES_LIST) {
      const partidas = lastJsonMessage.payload.matches;
      setPartidas(partidas);
    }
  }, [lastJsonMessage]);

  function handleSelectPartida(partida) {
    setSelectedPartida(partida);
  }

  function cambiaBusqueda(event) {
    filtrarPorNombrePartida(event.target.value);
  }

  const filtrarPorNombrePartida = (nombrePartida) => {
    // TODO: revisar el key y payload con el back.
    sendJsonMessage({
      key: "FILTER_MATCHES",
      payload: { match_name: nombrePartida },
    });
  };

  const filtrarPorMaximoJugadores = (maximoJugadores) => {
    sendJsonMessage({
      key: "FILTER_MATCHES",
      payload: { max_players: maximoJugadores },
    });
  };

  return (
    <div>
      <h1 className="poiret-one-regular text-8xl pb-5">EL SWITCHER</h1>
      <div className="flex flex-row align-center justify-center items-center my-5">
        <input
          type="text"
          placeholder="Buscar partida por nombre..."
          onChange={cambiaBusqueda}
          className="search-input"
        />
        <FiltrosDeBusqueda
          alFiltrarPorMaximoDeJugadores={filtrarPorMaximoJugadores}
        />
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
                <th></th>
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
                      No se encuentran partidas disponibles
                    </td>
                  </tr>
                </>
              ) : (
                partidas.map((partida) => (
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
                    <td>{partida.match_name}</td>
                    <td className="cantidad-jugadores">
                      {partida.current_players}/{partida.max_players}
                    </td>
                    <td>
                      {!partida.is_public && (
                        <svg
                          className="h-8 w-8 text-gray-500 ml-2"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="buttons-menu">
          <CrearPartida />
          <UnirsePartida idPartida={selectedPartida?.id} />
        </div>
      </div>
    </div>
  );
};

export default ListaPartidas;
