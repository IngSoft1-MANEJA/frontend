import React from "react";

export const ModalGanaste = ({ mostrar, texto, enVolverAlHome }) => {
  if (!mostrar) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box relative">
        <h3 className="font-bold text-lg">{texto}</h3>
        <div className="modal-action">
          <button className="btn" onClick={enVolverAlHome}>
            Volver al home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalGanaste;
