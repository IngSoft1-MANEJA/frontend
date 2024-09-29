import React, { useEffect, useState } from 'react';
import './InformacionTurno.css';

export const InformacionTurno = ({ matchId }) => {
  const [turnInfo, setTurnInfo] = useState({ currentTurn: '', nextTurn: '' });

  // const turnInfo = { currentTurn: '1', nextTurn: '2' };

  useEffect(() => {
    const fetchTurnInfo = async () => {
      try {
        const response = await fetch(`/matches/${matchId}/Board`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        setTurnInfo({ currentTurn: data.current_player_turn, nextTurn: data.next_player_turn });
      } catch (error) {
        console.error('Error en fetch', error);
      }
    };
    fetchTurnInfo();
  }, [matchId]);

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
            <td>{turnInfo.currentTurn}</td>
          </tr>
          <tr>
            <th>Next</th>
            <td>{turnInfo.nextTurn}</td>
          </tr>
        </tbody>
      </table>
    </div>

  );
};

export default InformacionTurno;