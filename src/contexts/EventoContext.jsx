import React, { createContext, useState } from "react";

export const EventoContext = createContext(null);

export const EventoProvider = ({ children }) => {
  const [ultimoEvento, setUltimoEvento] = useState(null);

  return (
    <EventoContext.Provider value={{ ultimoEvento, setUltimoEvento }}>
      {children}
    </EventoContext.Provider>
  );
};
