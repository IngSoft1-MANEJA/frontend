import React, { createContext, useState } from "react";

export const UsarMovimientoContext = createContext();

export const UsarMovimientoProvider = ({ children }) => {
  const [usarMovimiento, setUsarMovimiento] = useState({
    cartaHovering: false,
    fichaHovering: false,
    cartaSeleccionada: null,
    fichasSeleccionadas: [],
    cartasUsadas: [],
  });

  return (
    <UsarMovimientoContext.Provider value={{ usarMovimiento, setUsarMovimiento }}>
      {children}
    </UsarMovimientoContext.Provider>
  );
};
