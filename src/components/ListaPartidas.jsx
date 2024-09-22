// src/components/ListaPartidas/ListaPartidas.jsx
import React, { useState } from 'react';
import './ListaPartidas.css';

function ListaPartidas () {
    const [selectedPartida, setSelectedPartida] = useState(null);
    
    const partidas = [ //Podemos cambiarlo por un fetch para conseguir las partidas
        { id: 1, nombre: 'ManuLol,ManuLol,ManuLol,ManuLol,ManuLol,ManuLol,ManuLolManuLolManuLol', estado: 'Activo', jugadores: '4' },
        { id: 2, nombre: 'ManuLol', estado: 'Activo', jugadores: '3' },
        { id: 3, nombre: 'ManuLol', estado: 'Activo', jugadores: '2' },
        { id: 4, nombre: 'ManuLol,ManuLol,ManuLol,ManuLol,ManuLol,ManuLol,ManuLolManuLolManuLol', estado: 'Activo', jugadores: '4' },
        { id: 5, nombre: 'ManuLol', estado: 'Activo', jugadores: '3' },
        { id: 6, nombre: 'ManuLol', estado: 'Activo', jugadores: '2' },
        { id: 7, nombre: 'ManuLol,ManuLol,ManuLol,ManuLol,ManuLol,ManuLol,ManuLolManuLolManuLol', estado: 'Activo', jugadores: '4' },
        { id: 8, nombre: 'ManuLol', estado: 'Activo', jugadores: '3' },
        { id: 9, nombre: 'ManuLol', estado: 'Activo', jugadores: '2' },
        { id: 10, nombre: 'ManuLol,ManuLol,ManuLol,ManuLol,ManuLol,ManuLol,ManuLolManuLolManuLol', estado: 'Activo', jugadores: '4' },
        { id: 11, nombre: 'ManuLol', estado: 'Activo', jugadores: '3' },
        { id: 12, nombre: 'ManuLol', estado: 'Activo', jugadores: '2' },
      ];

    function handleRefreshPartidas() {
    }

    return (
        <div className="Partidas">
            <table className="table table-xs">
                {/* Defino las columnas de la tabla */}
                <thead>
                    <tr>
                        <th></th>
                        <th>Nombre</th>
                        <th>Estado</th>
                        <th>Jugadores</th>
                    </tr>
                </thead>
                <tbody>
                {/* Defino las filas de la tabla */}
                {partidas.map((partida) => (
                    <tr
                    key={partida.id}
                    onClick={() => handleSelectPartida(partida)}
                    style={{
                        cursor: 'pointer',
                        backgroundColor: selectedPartida?.id === partida.id ? 'rgba(0, 123, 255,0.4)' : 'transparent',
                    }}
                    >
                    <td>{partida.id}</td>
                    <td>{partida.nombre}</td>
                    <td>{partida.estado}</td>
                    <td>{partida.jugadores}</td>
                    </tr>
                ))} 
                </tbody>
            </table>
            <div className='buttons'>
                <button
                className='refresh-button' 
                onClick={handleRefreshPartidas}>
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
    );
};

export default ListaPartidas;