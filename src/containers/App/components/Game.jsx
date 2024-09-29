import React from "react";
import { InformacionTurno } from "./InformacionTurno";

export const Game = () => {
  return (
    <div className="game-div">
      <InformacionTurno matchId={matchId} />
    </div>
  );
};

export default Game;
