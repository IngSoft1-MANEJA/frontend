import React, { useEffect, useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { set, useForm } from "react-hook-form";
import { Alerts } from "../../../components/Alerts.jsx";
import { ServicioPartida } from "../../../services/ServicioPartida.js";
import { DatosJugadorContext } from "../../../contexts/DatosJugadorContext.jsx";
import { DatosPartidaContext } from "../../../contexts/DatosPartidaContext.jsx";
import "./CrearPartida.css";

export const CrearPartida = () => {
  const navegar = useNavigate();

  const [showSuccess, setShowSuccess] = useState(null);
  const [message, setMessage] = useState("");
  const [shouldFetch, setShouldFetch] = useState(true);
  const [estaCargando, setEstaCargando] = useState(false);
  const { datosJugador, setDatosJugador } = useContext(DatosJugadorContext);
  const { datosPartida, setDatosPartida } = useContext(DatosPartidaContext);
  
  const shouldFetchRef = useRef(shouldFetch);

  useEffect(() => {
    shouldFetchRef.current = shouldFetch;
  }, [shouldFetch]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    clearErrors,
  } = useForm({
    defaultValues: {
      nombreJugador: "",
      nombreSala: "",
      cantidadJugadores: 2,
      contraseña: "",
    },
  });

  const nombreJugadorWatch = watch("nombreJugador");
  const nombreSalaWatch = watch("nombreSala");
  const cantidadJugadoresWatch = watch("cantidadJugadores");
  const contrsaeñaWatch = watch("contraseñaSala")

  const onSubmit = async (e) => {
    e.preventDefault();
    setShouldFetch(true);
    setEstaCargando(true);

    setTimeout(async () => {
      if (!shouldFetchRef.current) return;

      try {
        const resJson = await ServicioPartida.crearPartida(
          nombreSalaWatch,
          nombreJugadorWatch,
          cantidadJugadoresWatch,
          contrsaeñaWatch,
        );
        console.log(resJson);
        reset();
        setDatosJugador({
          ...datosJugador,
          is_owner: true,
          player_id: resJson.player_id,
          player_name: nombreJugadorWatch,
        });
        if (
          cantidadJugadoresWatch !== null &&
          cantidadJugadoresWatch !== undefined
        ) {
          setDatosPartida({
            ...datosPartida,
            max_players: cantidadJugadoresWatch,
          });
        }
        navegar(`/lobby/${resJson.match_id}/player/${resJson.player_id}`);
        setEstaCargando(false);
      } catch (err) {
        setEstaCargando(false);
        setMessage("Error creando sala de partida");
        setShowSuccess("error");
        console.log(err);
      }
    }, 1500);
  };

  const handleClose = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowSuccess(null);
    setMessage("");
    setShouldFetch(false);
    document.getElementById("my_modal_1").close();
    reset({}, { keepDirtyFields: true });
    clearErrors();
    setEstaCargando(false);
  };

  return (
    <>
      <div className="CrearPartida w-full">
        <button
          className="boton-crear-partida btn mb-1"
          onClick={() => document.getElementById("my_modal_1").showModal()}
        >
          Crear sala
        </button>
      </div>
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Crea tu propia sala de partida!</h3>
          <div className="modal-action">
            <form
              noValidate
              id="crear_partida_form"
              className="crear-partida-form w-full"
              method="dialog"
              onSubmit={handleSubmit(onSubmit)}
            >
              <button
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                onClick={handleClose}
              >
                ✕
              </button>
              <label className="label-modal-crear-partida form-control w-full items-center">
                <input
                  type="text"
                  aria-label="nombreJugador"
                  placeholder="Elige tu nombre de jugador"
                  value={nombreJugadorWatch}
                  className={`input-modal-crear-partida input input-bordered w-full text-left${
                    errors.nombreJugador?.message
                      ? "input-modal-crear-partida input-error input-bordered w-full text-left"
                      : ""
                  }`}
                  {...register("nombreJugador", {
                    required: {
                      value: true,
                      message: "Este campo es requerido",
                    },
                    maxLength: {
                      value: 50,
                      message:
                        "El nombre de jugador debe ser menor a 50 caracteres",
                    },
                  })}
                />
                <span className="error">{errors.nombreJugador?.message}</span>
                <input
                  type="text"
                  aria-label="nombreSala"
                  placeholder="Elige el nombre de tu sala de partida"
                  value={nombreSalaWatch}
                  className={`input-modal-crear-partida input input-bordered w-full text-left${
                    errors.nombreSala?.message
                      ? "input-modal-crear-partida input-error input-bordered w-full text-left"
                      : ""
                  }`}
                  {...register("nombreSala", {
                    required: {
                      value: true,
                      message: "Este campo es requerido",
                    },
                    maxLength: {
                      value: 50,
                      message:
                        "El nombre de la sala debe ser menor a 50 caracteres",
                    },
                  })}
                />
                <span className="error">{errors.nombreSala?.message}</span>
                <input
                  type="password"
                  placeholder="Contraseña de la sala (opcional)"
                  className={`input-modal-crear-partida input input-bordered w-full text-left${
                    errors.contraseña?.message ? " input-error" : ""
                  }`}
                  {...register("contraseña", {
                    maxLength: {
                      value: 50,
                      message: "La contraseña debe ser menor a 50 caracteres",
                    },
                    validate: value =>
                      value === "" || value.length > 0 || "La contraseña no debe estar vacía",
                  })}
                />
                <span className="error">{errors.contraseña?.message}</span>
                <input
                  type="number"
                  min={2}
                  max={4}
                  aria-label="cantidadJugadores"
                  placeholder="Elige la cantidad maxima de jugadores (2-4)"
                  value={cantidadJugadoresWatch}
                  className={`input-modal-crear-partida input input-bordered w-full text-left${
                    errors.cantidadJugadores?.message
                      ? "input-modal-crear-partida input-error input-bordered w-full text-left"
                      : ""
                  }`}
                  {...register("cantidadJugadores", {
                    required: {
                      value: true,
                      message: "Este campo es requerido",
                    },
                    valueAsNumber: true,
                    min: {
                      value: 2,
                      message: "La sala debe tener un minimo de 2 jugadores",
                    },
                    max: {
                      value: 4,
                      message: "La sala debe tener un maximo de 4 jugadores",
                    },
                  })}
                />
                <span className="error">
                  {errors.cantidadJugadores?.message}
                </span>
              </label>
              {showSuccess ? (
                <Alerts type={showSuccess} message={message} />
              ) : null}
              <div className="formButtons">
                <button className="btn" onClick={onSubmit}>
                  Crear Sala de Partida
                  {estaCargando && <span className="loading loading-spinner" />}
                </button>
              </div>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default CrearPartida;
