import React from 'react'
import { useState } from 'react'
// import { useNavigate } from "react-router";
import { useForm } from 'react-hook-form'
import { SuccessAlert } from './SuccessAlert';
import './ModalCrearPartida.css'

export const ModalCrearPartida = () => {
    // const navigate = useNavigate();
    const [showSuccess, setShowSuccess] = useState(false);
    const [message, setMessage] = useState("");

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        reset
    } = useForm({
        defaultValues: {
            playerName: "",
            lobbyName: "",
            playerAmount: ""
        }
    });

    const playerNameWatch = watch("playerName");
    const lobbyNameWatch = watch("lobbyName");
    const playerAmountWatch = watch("playerAmount");

    const onSubmit = async (e) => {
        try {
          let res = await fetch("https://httpbin.org/post", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
              },
            body: JSON.stringify({playerName: playerNameWatch,lobbyName: lobbyNameWatch,playerAmount: playerAmountWatch}),
          });
          let resJson = await res.json();
          if (res.ok) {
            setMessage("Lobby created successfully");
            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                console.log(resJson);
            }, 1000);
            setTimeout(() => {
                document.getElementById('my_modal_1').close()
            }, 1000);
            
            setTimeout(() => {
                setMessage('');
                reset();
                // navigate("/");
              }, 1000);
          }
        } catch (err) {
          console.log(err);
        }
    };

    // handle closure of modal
    const handleClose = (e) => {
        reset();
        document.getElementById('my_modal_1').close();
    }

    return (
        <div>
            {showSuccess ? <SuccessAlert message={message}/> : null}
            <button className="boton-crear-partida btn btn-lg" onClick={()=>document.getElementById('my_modal_1').showModal()}>Create match lobby</button>
            <dialog id="my_modal_1" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Create your own match lobby!</h3>
                    <div className="modal-action">
                        <form id="crear_partida_form" className="crear-partida-form" method="dialog" onSubmit={handleSubmit(onSubmit)}>
                            {/* if there is a button in form, it will close the modal */}
                            <button 
                                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" 
                                onClick={handleClose}>✕</button>
                            <label className="label-modal-crear-partida form-control w-full" >
                                <input 
                                    type="text"
                                    aria-label="playerName"
                                    placeholder="Choose your player name"
                                    value={playerNameWatch}
                                    className="input-modal-crear-partida input input-bordered w-full" 
                                    {...register("playerName", 
                                        {required: {value: true, message: "This field is required"}, 
                                        maxLength: {value: 10, message: "Player name must be shorter than 10 characters"}})}
                                />
                                <span className="error">{errors.playerName?.message}</span>
                                <input 
                                    type="text"
                                    aria-label="lobbyName"
                                    placeholder="Choose your lobby name" 
                                    value={lobbyNameWatch}
                                    className="input-modal-crear-partida input input-bordered w-full"
                                    {...register("lobbyName", 
                                        {required: {value: true, message: "This field is required"}, 
                                        maxLength: {value: 10, message: "Lobby name must be shorter than 10 characters"}})}
                                />
                                <span className="error">{errors.lobbyName?.message}</span>
                                <input 
                                    type="text" 
                                    aria-label="playerAmount"
                                    placeholder="Select the maximum amount of players (2-4)" 
                                    value={playerAmountWatch}
                                    className="input-modal-crear-partida input input-bordered w-full"
                                    {...register("playerAmount", 
                                        {required: {value: true, message: "This field is required"},
                                        min: {value: 2, message: "Lobby has a minimum amount of players of 2"},
                                        max: {value: 4, message: "Lobby has a maximum amount of players of 4"}})}
                                />
                                <span className="error">{errors.playerAmount?.message}</span>
                            </label>
                            <div className="formButtons">
                                <input 
                                    className="submit-crear-partida input btn btn-active " 
                                    type="submit" 
                                    value="Create lobby"
                                />
                            </div>
                        </form>
                    </div>
                </div>
            </dialog>
        </div>
    )
}

export default ModalCrearPartida;