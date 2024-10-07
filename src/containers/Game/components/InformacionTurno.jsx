import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useWebSocket from "react-use-websocket";
import { WEBSOCKET_URL } from "../../../variablesConfiguracion.js";
import './InformacionTurno.css';

export const InformacionTurno = ({player_id}) => {

    const { match_id } = useParams();
    const [turnos, setTurnos] = useState({current_turn: ''});
    const websocket_url = `${WEBSOCKET_URL}/${match_id}/ws/${player_id}`;
    const { lastJsonMessage } = useWebSocket(websocket_url, { share: true });

    useEffect(() => {
        if (lastJsonMessage !== null) {
            if (lastJsonMessage.key == "GET_TURN_ORDER") {
                setTurnos({
                    current_turn: lastJsonMessage.payload.current_turn,
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
        <div className='informacion-div w-fit max-w-md flex h-fit box-border overflow-hidden'>
            <table className="table-xs m-3">
                <thead>
                    <tr>
                        <th className='w-1/4 min-w-28'>Turn Order</th>
                        <th className='w-3/4'>Name</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="bg-base-200 h-8">
                        <th className='w-1/4'>Current</th>
                        <td className='w-3/4'>{turnos.current_turn}</td>
                    </tr>
                </tbody>
            </table>
        </div>

    );
};

export default InformacionTurno;