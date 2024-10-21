import React, { createContext, useState } from "react";

export const FigurasContext = createContext();

export const FigurasProvider = ({ children }) => {
  const [figuras, setFiguras] = useState({
    historial: [],
    figuras_actuales: [],
  });

  const agregarFiguras = (nuevasFiguras) => {
    setFiguras((prevState) => ({
      historial: [...prevState.historial, prevState.figuras_actuales],
      figuras_actuales: nuevasFiguras,
    }));
  };

  const deshacerFiguras = () => {
    setFiguras((prevState) => {
      if (prevState.historial.length === 0) return prevState;
      const ultimasFiguras =
        prevState.historial[prevState.historial.length - 1];
      const nuevaHistoria = prevState.historial.slice(0, -1);
      return {
        historial: nuevaHistoria,
        figuras_actuales: ultimasFiguras,
      };
    });
  };

  return (
    <FigurasContext.Provider
      value={{ figuras, agregarFiguras, deshacerFiguras }}
    >
      {children}
    </FigurasContext.Provider>
  );
};
