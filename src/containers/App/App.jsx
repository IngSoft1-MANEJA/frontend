import "./App.css";
import { Routes, Route } from "react-router-dom";
import ListaPartidas from "./components/ListaPartidas.jsx";
import { Lobby } from "../Lobby/Lobby.jsx";
import { DatosJugadorProvider } from '../../contexts/DatosJugadorContext.jsx';
import { DatosPartidaProvider } from '../../contexts/DatosPartidaContext.jsx';

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
          element={            
            <DatosPartidaProvider>
              <DatosJugadorProvider>
                <Lobby />
              </DatosJugadorProvider>
            </DatosPartidaProvider>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
