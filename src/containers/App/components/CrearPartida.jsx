import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { set, useForm } from "react-hook-form";
import { Alerts } from "../../../components/Alerts.jsx";
import "./CrearPartida.css";
import { ServicioPartida } from "../../../services/ServicioPartida.js";

export const CrearPartida = () => {
  const navegar = useNavigate();
  const [showSuccess, setShowSuccess] = useState(null);
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      player_name: "",
      lobby_name: "",
      max_players: "",
    },
  });

  const player_nameWatch = watch("player_name");
  const lobby_nameWatch = watch("lobby_name");
  const max_playersWatch = watch("max_players");

  const onSubmit = async (e) => {
    try {
      const resJson = await ServicioPartida.crearPartida(
        lobby_nameWatch,
        player_nameWatch,
        max_playersWatch,
      );

      setMessage("Sala de partida creada con exito");
      setShowSuccess("success");
      console.log(resJson);
      reset();

      setTimeout(() => {
        navegar(`/lobby/${resJson.match_id}/player/${resJson.player_id}`);
      }, 300);
    } catch (err) {
      setMessage("Error creando sala de partida");
      setShowSuccess("error");
      console.log(err);
    }
  };

  // handle closure of modal
  const handleClose = (e) => {
    reset();
    document.getElementById("my_modal_1").close();
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
          {showSuccess ? <Alerts type={showSuccess} message={message} /> : null}
          <h3 className="font-bold text-lg">Crea tu propia sala de partida!</h3>
          <div className="modal-action">
            <form
              id="crear_partida_form"
              className="crear-partida-form w-full"
              method="dialog"
              onSubmit={handleSubmit(onSubmit)}
            >
              {/* if there is a button in form, it will close the modal */}
              <button
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                onClick={handleClose}
              >
                ✕
              </button>
              <label className="label-modal-crear-partida form-control w-full items-center">
                <input
                  type="text"
                  aria-label="player_name"
                  placeholder="Elige tu nombre de jugador"
                  value={player_nameWatch}
                  className="input-modal-crear-partida input input-bordered w-full text-left"
                  {...register("player_name", {
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
                <span className="error">{errors.player_name?.message}</span>
                <input
                  type="text"
                  aria-label="lobby_name"
                  placeholder="Elige el nombre de tu sala de partida"
                  value={lobby_nameWatch}
                  className="input-modal-crear-partida input input-bordered w-full"
                  {...register("lobby_name", {
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
                <span className="error">{errors.lobby_name?.message}</span>
                <input
                  type="text"
                  aria-label="max_players"
                  placeholder="Elige la cantidad maxima de jugadores (2-4)"
                  value={max_playersWatch}
                  className="input-modal-crear-partida input input-bordered w-full"
                  {...register("max_players", {
                    required: {
                      value: true,
                      message: "Este campo es requerido",
                    },
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
                  {errors.max_players?.message}
                </span>
              </label>
              <div className="formButtons">
                <input
                  className="submit-crear-partida input btn btn-active "
                  type="submit"
                  value="Crear sala de partida"
                />
              </div>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default CrearPartida;
