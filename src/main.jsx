import * as React from "react";
import * as ReactDOM from "react-dom/client";
import App from "./containers/App/App.jsx";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Lobby from "./containers/Lobby/Lobby.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/lobby/:idPartida/jugador/:idJugador",
    element: <Lobby />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
