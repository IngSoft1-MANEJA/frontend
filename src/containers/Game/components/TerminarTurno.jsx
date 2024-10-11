import React from 'react'
import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { DatosJugadorContext } from "../../../contexts/DatosJugadorContext";
import { ServicioPartida } from "../../../services/ServicioPartida";
import { Alerts } from "../../../components/Alerts";
import {EventoContext} from "../../../contexts/EventoContext";

export const TerminarTurno = () => {
    const { match_id } = useParams();

    const { datosJugador } = useContext(DatosJugadorContext);
    const {ultimoEvento} = useContext(EventoContext);

    const [mostrarAlerta, setMostrarAlerta] = useState(false);
    const [mensajeAlerta, setMensajeAlerta] = useState("");
    const [habilitarBoton, setHabilitarBoton] = useState(false);

    const tipoAlerta = "info";

    useEffect(() => {
        if (ultimoEvento !== null) {
            switch (ultimoEvento.key) {
                case "START_MATCH":
                    if (ultimoEvento.payload.turn_order === 1){
                        setHabilitarBoton(true);
                    } else {
                        setHabilitarBoton(false);
                    }

                    setMensajeAlerta(
                        `Turno de ${ultimoEvento.payload.player_name}.`,
                    );
                    setMostrarAlerta(true);

                    setTimeout(() => {
                        setMostrarAlerta(false);
                    }, 1500);
                break;

                case "END_PLAYER_TURN":
                    setMensajeAlerta(
                        `${ultimoEvento.payload.current_player_name} ha terminado su turno.`,
                    );
                    setMostrarAlerta(true);
                    setTimeout(() => {
                        setMostrarAlerta(false);
                    }, 1500);
                    
                    if (ultimoEvento.payload.next_player_turn === datosJugador.player_turn){
                        setHabilitarBoton(true);
                    } else {
                        setHabilitarBoton(false);
                    }

                    setMensajeAlerta(
                        `Turno de ${ultimoEvento.payload.next_player_name}.`,
                    );
                    setMostrarAlerta(true);

                    setTimeout(() => {
                        setMostrarAlerta(false);
                    }, 1500);
                    
                break;
        
                default:
                    console.error("key incorrecto recibido del websocket");
                break;
            }
        }
    }, [
    ultimoEvento,
    setMostrarAlerta,
    setMensajeAlerta,

    ]);

    const handleTerminarTurno = async () => {
        const respuesta = await ServicioPartida.terminarTurno(
            match_id,
            datosJugador.player_id,
        );
    }

    

    return (
        <div className='terminar-turno-div'>
            {mostrarAlerta && <Alerts type={tipoAlerta} message={mensajeAlerta} />}
            <div className='terminar-turno-boton-div absolute right-8 bottom-8'>
                <button
                className="terminar-turno-boton btn"
                onClick={handleTerminarTurno}
                disabled={!habilitarBoton}
                >
                Terminar turno
                </button>
            </div>
        </div>
    )
}

export default TerminarTurno;
