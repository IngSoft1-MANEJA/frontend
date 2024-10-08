import React, { useEffect, useState } from "react";
import { BotonDeshacerMovimientoParcial } from "./components/DeshacerMovimientoParcial";
import { set } from "react-hook-form";

/*import { useContext } from "react";
import { useParams } from "react-router-dom";
import { AbandonarPartida } from "../../components/AbandonarPartida";
import { DatosJugadorContext } from "../../contexts/DatosJugadorContext";*/

export function Game() {
  /*const { datosJugador, setDatosJugador } = useContext(DatosJugadorContext);
  const { match_id } = useParams();*/
  const [deshacerMovimientoParcial, setDeshacerMovimientoParcial] = useState(false);

  useEffect(() => {
    if (deshacerMovimientoParcial) {
      // Agregar lógica para deshacer movimiento parcial
      // setDeshacerMovimientoParcial(false);
    }
  }, [deshacerMovimientoParcial, setDeshacerMovimientoParcial]);

  return (
    <div>
      {/*<AbandonarPartida
        estadoPartida="STARTED"
        esAnfitrion={datosJugador.is_owner}
        idJugador={datosJugador.player_id}
        idPartida={match_id}
      />*/}
      <BotonDeshacerMovimientoParcial
        setDeshacerMovimientoParcial={setDeshacerMovimientoParcial}
      />
    </div>
  );
}
export default Game;
