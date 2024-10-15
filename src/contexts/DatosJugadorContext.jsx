import React, { createContext, useState } from "react";

export const DatosJugadorContext = createContext();

export const DatosJugadorProvider = ({ children }) => {
  const [datosJugador, setDatosJugador] = useState({
    is_owner: false,
    player_id: null,
    is_turn: false,
  });

  return (
    <DatosJugadorContext.Provider value={{ datosJugador, setDatosJugador }}>
      {children}
    </DatosJugadorContext.Provider>
  );
};
