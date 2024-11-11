import React, { createContext, useState } from "react";

export const FigurasContext = createContext();

export const FigurasProvider = ({ children }) => {
  const [figuras, setFiguras] = useState({
    historial: [],
    figuras_actuales: [],
    color_prohibido: "",
  });

  const agregarFiguras = (nuevasFiguras) => {
    setFiguras((prevState) => ({
      historial: [...prevState.historial, prevState.figuras_actuales],
      figuras_actuales: nuevasFiguras,
      color_prohibido: prevState.color_prohibido,
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
        color_prohibido: prevState.color_prohibido,
      };
    });
  };

  return (
    <FigurasContext.Provider
      value={{ figuras, agregarFiguras, deshacerFiguras, setFiguras }}
    >
      {children}
    </FigurasContext.Provider>
  );
};
