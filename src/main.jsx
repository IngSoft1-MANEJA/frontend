import * as React from "react";
import * as ReactDOM from "react-dom/client";
import App from "./containers/App/App.jsx";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Lobby from "./containers/Lobby/Lobby.jsx";
import Game from "./containers/Game/Game.jsx";

const router = createBrowserRouter([
  {
    path: "*",
    element: <App />,
    children: [
      {
        path: "lobby/:match_id/player/:player_id",
        element: <Lobby />,
      },
      {
        path: "matches/:match_id",
        element: <Game />,
      },
    ],
  },
  {
    path: "/matches/:match_id",
    element: <Game />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
