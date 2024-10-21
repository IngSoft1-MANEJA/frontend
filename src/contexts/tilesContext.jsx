import React, { createContext, useState } from "react";

export const TilesContext = createContext();

export const TilesProvider = ({ children }) => {
  const [tiles, setTiles] = useState([]);

  return (
    <TilesContext.Provider value={{ tiles, setTiles }}>
      {children}
    </TilesContext.Provider>
  );
};
