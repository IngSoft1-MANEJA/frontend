import React, { createContext, useState } from 'react';

const DatosJugadorContext = createContext();

export const DatosJugadorProvider = ({ children }) => {
  const [datosJugador, setDatosJugador] = useState({});

  return (
    <DatosJugadorContext.Provider value={{ datosJugador, setDatosJugador }}>
      {children}
    </DatosJugadorContext.Provider>
  );
};

export default { DatosJugadorContext, DatosJugadorProvider };