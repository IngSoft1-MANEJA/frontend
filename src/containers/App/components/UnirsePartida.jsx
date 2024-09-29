import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ServicioPartida } from "../../../services/ServicioPartida";
import "./UnirsePartida.css";

function UnirsePartida({ idPartida }) {
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [mensajeError, setMensajeError] = useState("");
  const [estaCargando, setEstaCargando] = useState(false);
  const navigate = useNavigate();

  const manejarUnirse = async (e) => {
    e.preventDefault();
    if (nombreUsuario) {
      try {
        setEstaCargando(true);
        await ServicioPartida.unirsePartida(idPartida, nombreUsuario);
        setEstaCargando(false);
        navigate("/lobby");
        console.log("lobby called");
      } catch (error) {
        console.error(error.message);
        setEstaCargando(false);
      }
    } else {
      setMensajeError("Por favor, ingrese un nombre de usuario");
    }
  };

  const cerrarModal = (e) => {
    e.stopPropagation();
    document.getElementById("modal-unirse-partida").close();
    setMensajeError("");
    setNombreUsuario("");
  };

  return (
    <>
      <div className="unirse-partida">
        <button
          className="btn boton-unirse-partida"
          onClick={() => document.getElementById("modal-unirse-partida").showModal()}
        >
          Unirse a partida
        </button>
      </div>
      <dialog id="modal-unirse-partida" className="modal">
        <div className="modal-box">
          <button
            onClick={cerrarModal}
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          >
            ✕
          </button>
          <div className="flex items-center">
            <form className="flex flex-col items-start">
              <label className="form-control mb-6">
                <div className="label">
                  <span className="label-text">Ingresa tu nombre</span>
                </div>
                <input
                  className={`input input-bordered ${
                    mensajeError ? "input-error" : ""
                  }`}
                  type="text"
                  placeholder="Nombre"
                  value={nombreUsuario}
                  onChange={(e) => setNombreUsuario(e.target.value)}
                />
                <div className="label">
                  <span className="label-text-alt text-error">
                    {mensajeError}
                  </span>
                </div>
              </label>
              <button className="btn" onClick={manejarUnirse}>
                  Unirse
                {estaCargando && <span className="loading loading-spinner"/>}
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}

export default UnirsePartida;
