import React, { createContext, useState } from 'react';

export const DatosPartidaContext = createContext();

export const DatosPartidaProvider = ({ children }) => {
  
  const [datosPartida, setDatosPartida] = useState({});

  return (
    <DatosPartidaContext.Provider value={{ datosPartida, setDatosPartida }}>
      {children}
    </DatosPartidaContext.Provider>
  );
};
