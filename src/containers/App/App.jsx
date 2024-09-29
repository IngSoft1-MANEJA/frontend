import "./App.css";
import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { ListaPartidas } from "./components/ListaPartidas.jsx";
import { Game } from "./components/Game/Game.jsx";

function App() {

  return (
    <div>
      <Routes>
        <Route 
          path="/" 
          element={<ListaPartidas />} 
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
