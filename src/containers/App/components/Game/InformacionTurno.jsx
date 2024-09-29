import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useWebSocket from "react-use-websocket";
import { WEBSOCKET_URL } from "../../../../variablesConfiguracion.js";
import './InformacionTurno.css';

export const InformacionTurno = () => {

    const { match_id, player_id } = useParams();
    const [turnos, setTurnos] = useState({current_turn: '', next_turn: ''});
    const websocket_url = `${WEBSOCKET_URL}/${match_id}/ws/${player_id}`;
    const { lastJsonMessage } = useWebSocket(websocket_url, { share: true });

    useEffect(() => {
        if (lastJsonMessage !== null) {
            if (lastJsonMessage.key == "GET_TURN_ORDER") {
                setTurnos({
                    current_turn: lastJsonMessage.payload.current_turn,
                    next_turn: lastJsonMessage.payload.next_turn,
                });
            } else {
                console.error("key incorrecto recibido del websocket");
            }
            }
        }, [
            lastJsonMessage,
            setTurnos,
        ]);

    return (
        <div className='informacion-div w-fit'>
        <table className="table-xs m-3">
            <thead>
            <tr>
                <th>Turn Order</th>
                <th>Name</th>
            </tr>
            </thead>
            <tbody>
            <tr className="bg-base-200">
                <th>Current</th>
                <td>{turnos.current_turn}</td>
            </tr>
            <tr>
                <th>Next</th>
                <td>{turnos.next_turn}</td>
            </tr>
            </tbody>
        </table>
        </div>

    );
};

export default InformacionTurno;