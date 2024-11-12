import React, { createContext, useState } from "react";

export const FigurasContext = createContext();

export const FigurasProvider = ({ children }) => {
  const [figuras, setFiguras] = useState({
    figuras_actuales: [],
    color_prohibido: "",
  });

  const agregarFiguras = (nuevasFiguras) => {
    setFiguras((prevState) => ({
      figuras_actuales: nuevasFiguras,
      color_prohibido: prevState.color_prohibido,
    }));
  };

  return (
    <FigurasContext.Provider
      value={{ figuras, agregarFiguras, setFiguras }}
    >
      {children}
    </FigurasContext.Provider>
  );
};
