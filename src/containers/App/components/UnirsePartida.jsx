import { useState, useContext, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ServicioPartida } from "../../../services/ServicioPartida";
import { DatosJugadorContext } from "../../../contexts/DatosJugadorContext.jsx";
import "./UnirsePartida.css";

function UnirsePartida({ idPartida }) {
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [mensajeError, setMensajeError] = useState("");
  const [estaCargando, setEstaCargando] = useState(false);
  const { datosJugador, setDatosJugador } = useContext(DatosJugadorContext);
  const navigate = useNavigate();

  const manejarUnirse = async (e) => {
    e.preventDefault();

    if (nombreUsuario) {
      setEstaCargando(true);
      try {
        const dataPartida = await ServicioPartida.unirsePartida(
          idPartida,
          nombreUsuario,
        );

        setDatosJugador({
          ...datosJugador,
          is_owner: false,
          player_id: dataPartida.player_id,
          player_name: nombreUsuario,
        });

        navigate(`/lobby/${idPartida}/player/${dataPartida.player_id}`);
        setEstaCargando(false);
      } catch (error) {
        switch (error.status) {
          case 404:
            setMensajeError("La partida no existe o ha sido cancelada.");
            break;
          case 409:
            setMensajeError("La partida ya esta llena.");
            break;
          case 422:
            setMensajeError("Nombre invalido.");
            break;
          default:
            setMensajeError("Error al unirse a partida");
            break;
        }
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
    setEstaCargando(false);
  };

  return (
    <>
      <div className="unirse-partida">
        <button
          className="btn boton-unirse-partida"
          disabled={
            idPartida !== undefined && idPartida !== null ? "" : "disabled"
          }
          onClick={() => {
            if (idPartida !== undefined && idPartida !== null) {
              document.getElementById("modal-unirse-partida").showModal();
            }
          }}
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
                {estaCargando && (
                  <span className="loading loading-spinner infinite" />
                )}
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}

export default UnirsePartida;
