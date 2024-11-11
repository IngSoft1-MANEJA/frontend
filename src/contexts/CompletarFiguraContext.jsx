import { createContext, useState } from "react";

export const CompletarFiguraContext = createContext();

export const CompletarFiguraProvider = ({ children }) => {
  const [cartaSeleccionada, setCartaSeleccionada] = useState(null);
  const [esCartaOponente, setEsCartaOponente] = useState(null);
  const contextValue = {
    cartaSeleccionada,
    setCartaSeleccionada,
    esCartaOponente,
    setEsCartaOponente,
  };
  return (
    <CompletarFiguraContext.Provider value={contextValue}>
      {children}
    </CompletarFiguraContext.Provider>
  );
};
