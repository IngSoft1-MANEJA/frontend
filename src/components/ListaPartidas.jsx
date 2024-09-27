// src/components/ListaPartidas/ListaPartidas.jsx
import React, { useState, useEffect } from 'react';
import  Alert from './Alerts.jsx';
import './ListaPartidas.css';

export const ListaPartidas = () => {
    /*const [selectedPartida, setSelectedPartida] = useState(null);*/
    const [partidas, setPartidas] = useState([]);
    const [alert, setAlert] = useState(null);

    const fetchPartidas = async () => {
        try {
            const response = await fetch('/matches');

            if (!response.ok) {
                throw new Error('Error en fetch');
            }

            const data = await response.json();
            setPartidas(data);
            setAlert(null);
        } catch (error) { 
            setAlert({
                type: 'error',
                message: 'Error al encontrar partidas',
            });
        }
    };

    useEffect(() => {
        fetchPartidas();
    }, []);
  
    function refreshPartidas() {
        fetchPartidas();
    }

    return (
        <>
        {alert && alert.type && alert.message && <Alert type={alert.type} message={alert.message} />}    
            <div className="Partidas">
                <div className="table-container">
                    <table className="table-xs">
                        {/* Defino las columnas de la tabla */}
                        <thead>
                            <tr>
                                <th></th>
                                <th>Nombre</th>
                                <th className='cantidad-jugadores'>Jugadores</th>
                            </tr>
                        </thead>
                        <tbody>
                        {/* Defino las filas de la tabla */}
                        {partidas.map((partida) => (
                            <tr
                            key={partida.id}
                            /*onClick={() => handleSelectPartida(partida)}
                            style={{
                                cursor: 'pointer',
                                backgroundColor: selectedPartida?.id === partida.id ? 'rgba(0, 123, 255,0.4)' : 'transparent',
                            }}*/
                            >
                            <td>{partida.id}</td>
                            <td>{partida.nombre}</td>
                            <td className= 'cantidad-jugadores'>{partida.jugadoresActuales}/{partida.jugadoresMaximos}</td>
                            </tr>
                        ))} 
                        </tbody>
                    </table>
                </div>
                <div className='buttons-menu'>
                    <button
                    className='refresh-button' 
                    onClick={refreshPartidas}>
                    <svg 
                    class="h-2 w-2 text-gray-500"
                    viewBox="0 0 24 24"  
                    fill="none"  
                    stroke="currentColor"  
                    stroke-width="2"  
                    stroke-linecap="round"  
                    stroke-linejoin="round"
                    >  
                        <polyline points="23 4 23 10 17 10" />  
                        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                    </svg>
                        Refrescar
                    </button>
                </div>
            </div>
        </>
    );
};

export default ListaPartidas;