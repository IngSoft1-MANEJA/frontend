import "./App.css";
import { Routes, Route } from "react-router-dom";
import ListaPartidas from "./components/ListaPartidas.jsx";
import { Lobby } from "../Lobby/Lobby.jsx";
import { Game } from "../Game/Game.jsx";
import { DatosJugadorProvider } from "../../contexts/DatosJugadorContext.jsx";
import { DatosPartidaProvider } from "../../contexts/DatosPartidaContext.jsx";
import { EventoProvider } from "../../contexts/EventoContext.jsx";
import { TilesProvider } from "../../contexts/tilesContext.jsx";
import Temporizador from "../Game/components/Temporizador.jsx";
import { HabilitarAccionesUsuarioProvider } from "../../contexts/HabilitarAccionesUsuarioContext.jsx";

function App() {
  return (
    <div>
      <EventoProvider>
        <Routes>
          <Route
            path="/"
            element={
              <DatosPartidaProvider>
                <DatosJugadorProvider>
                  <ListaPartidas />
                </DatosJugadorProvider>
              </DatosPartidaProvider>
            }
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
          <Route
            path="/matches/:match_id/player/:player_id"
            element={
              <DatosPartidaProvider>
                <DatosJugadorProvider>
                  <TilesProvider>
                    <HabilitarAccionesUsuarioProvider>
                      <Game />
                    </HabilitarAccionesUsuarioProvider>
                  </TilesProvider>
                </DatosJugadorProvider>
              </DatosPartidaProvider>
            }
          />
          <Route path="/test-area" element={<Temporizador />} />
        </Routes>
      </EventoProvider>
    </div>
  );
}

export default App;
