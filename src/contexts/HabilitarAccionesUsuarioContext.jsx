import React, { createContext, useState } from "react";

export const HabilitarAccionesUsuarioContext = createContext();

export const HabilitarAccionesUsuarioProvider = ({ children }) => {
  const [habilitarAccionesUsuario, setHabilitarAccionesUsuario] =
    useState(true);

  return (
    <HabilitarAccionesUsuarioContext.Provider
      value={{ habilitarAccionesUsuario, setHabilitarAccionesUsuario }}
    >
      {children}
    </HabilitarAccionesUsuarioContext.Provider>
  );
};
