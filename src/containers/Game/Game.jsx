import React from "react";
import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import useWebSocket from "react-use-websocket";
import { WEBSOCKET_URL } from "../../variablesConfiguracion.js";
import { AbandonarPartida } from "../../components/AbandonarPartida";
import { Tablero } from "./components/Tablero";
import { TerminarTurno } from "./components/TerminarTurno";
import { DatosJugadorContext } from "../../contexts/DatosJugadorContext";
import { InformacionTurno } from "./components/InformacionTurno.jsx";
import { CartasMovimiento } from "./components/CartasMovimiento.jsx";

export function Game() {
  const { match_id } = useParams();
  const { datosJugador, setDatosJugador } = useContext(DatosJugadorContext);
  // const [tiles, setTiles] = useState([]);
  // const websocket_url = `${WEBSOCKET_URL}/${match_id}/ws/${datosJugador.player_id}`;
  // const { lastJsonMessage } = useWebSocket(websocket_url, { share: true });

  // useEffect(() => {
  //   if (lastJsonMessage !== null) {
  //       if (lastJsonMessage.key == "START_MATCH") {
  //           setTiles(lastJsonMessage.payload.board);
  //       } else {
  //           console.error("key incorrecto recibido del websocket");
  //       }
  //       }
  //   }, [
  //       lastJsonMessage,
  //       setTiles,
  // ]);

  const [selectedCarta, setSelectedCarta] = useState(null);
  const [usedCards, setUsedCards] = useState([]);

  const handleCartaSeleccionada = (carta) => {
    setSelectedCarta(carta);
  };

  const handleFichasSeleccionadas = (fichas) => {
    // Mark the carta as used and reset the selection
    setUsedCards([...usedCards, selectedCarta.name]);
    setSelectedCarta(null);
  };

  const tiles = [
    ['red', 'red', 'green', 'yellow', 'red', 'yellow'], 
    ['green', 'blue', 'red', 'yellow', 'green', 'blue'], 
    ['red', 'yellow', 'green', 'blue', 'blue', 'yellow'], 
    ['green', 'blue', 'red', 'yellow', 'green', 'blue'], 
    ['red', 'yellow', 'green', 'yellow', 'red', 'green'], 
    ['green', 'blue', 'blue', 'yellow', 'green', 'blue']
  ];

  return (
    <div className="game-div relative w-full h-screen m-0">
      <CartasMovimiento 
        onCartaSeleccionada={handleCartaSeleccionada} 
        usedCards={usedCards}
      />
      <InformacionTurno player_id={datosJugador.player_id}/>
      <TerminarTurno/>
      <Tablero 
        tiles={tiles} 
        selectedCarta={selectedCarta} 
        onFichasSeleccionadas={handleFichasSeleccionadas} 
      />
      <AbandonarPartida
        estadoPartida="STARTED"
        esAnfitrion={datosJugador.is_owner}
        idJugador={datosJugador.player_id}
        idPartida={match_id}
      />
    </div>
  );
}
export default Game;