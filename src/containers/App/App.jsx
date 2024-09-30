import "./App.css";
import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { ListaPartidas } from "./components/ListaPartidas.jsx";
import { Game } from "../Game/Game.jsx";
import { Lobby } from "../Lobby/Lobby.jsx";

function App() {

  return (
    <div>
      <Routes>
        <Route 
          path="/" 
          element={<ListaPartidas />} 
        />
        <Route 
          path="/lobby/:match_id/player/:player_id"
          element={<Lobby />}
        />
        <Route 
          path="/matches/:match_id"
          element={<Game />}
        />
      </Routes>
    </div>
  );
}

export default App;