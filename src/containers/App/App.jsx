import "./App.css";
import { Routes, Route } from "react-router-dom";
import { ListaPartidas } from "./components/ListaPartidas.jsx";
import { Game } from "./components/Game.jsx";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<ListaPartidas />} />
        <Route path="/home" element={<ListaPartidas />} />
        <Route path="/matches/:matchId" element={<Game />} />
      </Routes>
    </div>
  );
}

export default App;
