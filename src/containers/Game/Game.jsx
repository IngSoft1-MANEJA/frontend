import React from "react";
import { Tablero } from "./components/Tablero.jsx";

export const Game = () => {
  return (
    <div className="game-div w-full h-screen m-0">
      <Tablero />
    </div>
  );
};

export default Game;