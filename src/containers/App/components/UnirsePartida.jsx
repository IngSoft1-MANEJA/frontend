import { useState, useContext, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ServicioPartida } from "../../../services/ServicioPartida";
import { DatosJugadorContext } from "../../../contexts/DatosJugadorContext.jsx";
import { DatosPartidaContext } from "../../../contexts/DatosPartidaContext.jsx";
import "./UnirsePartida.css";
import { ServicioToken } from "../../../services/ServicioToken.js";

function UnirsePartida({ idPartida, esPublica }) {
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [clave, setClave] = useState("");
  const [mensajeError, setMensajeError] = useState("");
  const [estaCargando, setEstaCargando] = useState(false);
  const { datosJugador, setDatosJugador } = useContext(DatosJugadorContext);
  const { datosPartida } = useContext(DatosPartidaContext);
  const navigate = useNavigate();

  const manejarUnirse = async (e) => {
    e.preventDefault();
    if (nombreUsuario) {
      setEstaCargando(true);
      try {
        const dataPartida = await ServicioPartida.unirsePartida(
          idPartida,
          nombreUsuario,
          clave,
        );

        setDatosJugador({
          ...datosJugador,
          is_owner: false,
          player_id: dataPartida.player_id,
          player_name: nombreUsuario,
        });

        ServicioToken.guardarToken(
          idPartida,
          dataPartida.player_id,
          dataPartida.token,
        );

        navigate(`/lobby/${idPartida}/player/${dataPartida.player_id}`);
        setEstaCargando(false);
      } catch (error) {
        switch (error.status) {
          case 404:
            setMensajeError({
              nombre: "La partida no existe o ha sido cancelada.",
              clave: "",
            });
            break;
          case 409:
            setMensajeError({ nombre: "La partida ya está llena.", clave: "" });
            break;
          case 422:
            setMensajeError({
              nombre: "El nombre de la partida es invalido",
              clave: "",
            });
            break;
          case 401:
            setMensajeError({
              nombre: "",
              clave: "La clave ingresada es incorrecta.",
            });
            break;
          default:
            setMensajeError("Error al unirse a partida");
            break;
        }
        console.error(error.message);
        setEstaCargando(false);
      }
    } else {
      setMensajeError({
        nombre: "Por favor, ingrese un nombre de usuario",
        clave: "",
      });
    }
  };

  useEffect(() => {
    console.log("Valor de datosPartida:", datosPartida);
    console.log("Valor de datosPartida.is_Public:", datosPartida.is_public);
  }, [datosPartida]);

  const cerrarModal = (e) => {
    e.stopPropagation();
    document.getElementById("modal-unirse-partida").close();
    setMensajeError("");
    setNombreUsuario("");
    setClave("");
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
              <label className="form-control">
                <div className="label">
                  <span className="label-text">Ingresa tu nombre</span>
                </div>
                <input
                  className={`input input-bordered ${
                    mensajeError.nombre ? "input-error" : ""
                  }`}
                  type="text"
                  placeholder="Nombre"
                  value={nombreUsuario}
                  onChange={(e) => setNombreUsuario(e.target.value)}
                />
                <div className="label">
                  <span className="label-text-alt text-error">
                    {mensajeError.nombre}
                  </span>
                </div>
              </label>
              {!esPublica && (
                <label className="form-control">
                  <div className="label">
                    <span className="label-text">
                      Ingrese la clave de la sala
                    </span>
                  </div>
                  <input
                    className={`input input-bordered ${
                      mensajeError.clave ? "input-error" : ""
                    }`}
                    type="text"
                    placeholder="Clave"
                    value={clave}
                    onChange={(e) => setClave(e.target.value)}
                  />
                  <div className="label">
                    <span className="label-text-alt text-error">
                      {mensajeError.clave}
                    </span>
                  </div>
                </label>
              )}
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
