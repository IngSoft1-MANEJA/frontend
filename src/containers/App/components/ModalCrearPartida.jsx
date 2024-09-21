import React from 'react'
import { useState } from 'react'
import { redirect } from 'react-router-dom'
import './ModalCrearPartida.css'

export const ModalCrearPartida = () => {
    const [nameState, setNameState] = useState("");
    const [lobbyNameState, setLobbyNameState] = useState("");
    const [playerAmountState, setPlayerAmountState] = useState("");
    const [message, setMessage] = useState("");

    const formData = {
        name: nameState,
        lobbyName: lobbyNameState,
        playerAmount: playerAmountState,
    };

    // handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (nameState < 3 || nameState > 20) {
            setMessage('Player name must be between 3 and 20');
            return;
        }
        if (lobbyNameState.length < 3 || playerAmountState.length > 20) {
            setMessage('Lobby name must be between 3 and 20');
            return;
        }
        if (playerAmountState < 2 || playerAmountState > 4) {
            setMessage('Player amount must be between 2 and 4');
            return;
        }

        try {
          let res = await fetch("https://httpbin.org/post", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
              },
            body: JSON.stringify(formData),
          });
          let resJson = await res.json();
          if (res.ok) {
            setNameState("");
            setLobbyNameState("");
            setPlayerAmountState("");
            setMessage("Lobby created successfully");
            console.log(resJson);

            setTimeout(() => {
                document.getElementById('my_modal_1').close()
                setMessage('');
              }, 2000);
            redirect("/lobby");
          } else {
            setMessage("An error occurred while creating the lobby");
          }
        } catch (err) {
          console.log(err);
          setMessage("An error occurred while creating the lobby");
        }
    };

    // handle closure of modal
    const handleClose = (e) => {
        e.stopPropagation();
        e.preventDefault();
        setNameState("");
        setLobbyNameState("");
        setPlayerAmountState("");
        setMessage("");
        document.getElementById('my_modal_1').close();
    }

    return (
        <div>
            <button className="boton-crear-partida btn btn-lg" onClick={()=>document.getElementById('my_modal_1').showModal()}>Crear Partida</button>
            <dialog id="my_modal_1" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Crete your own match lobby!</h3>
                    <div className="modal-action">
                        <form id="crear_partida_form" className="crear-partida-form" method="dialog" onSubmit={handleSubmit}>
                            {/* if there is a button in form, it will close the modal */}
                            <button 
                                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" 
                                onClick={handleClose}>✕</button>
                                
                            <label className="label-modal-crear-partida form-control w-full" >
                                <input 
                                    type="text" 
                                    placeholder="Elige tu nombre de jugador" 
                                    className="input-modal-crear-partida input input-bordered w-full" 
                                    value={nameState} 
                                    onChange={(e) => setNameState(e.target.value)} 
                                />
                                <input 
                                    type="text" 
                                    placeholder="Nombre de tu sala" 
                                    className="input-modal-crear-partida input input-bordered w-full" 
                                    value={lobbyNameState}  
                                    onChange={(e) => setLobbyNameState(e.target.value)} 
                                />
                                <input 
                                    type="number" 
                                    placeholder="Cantidad maxima de jugadores (entre 2 y 4)" 
                                    className="input-modal-crear-partida input input-bordered w-full" 
                                    value={playerAmountState} 
                                    onChange={(e) => setPlayerAmountState(e.target.value)} 
                                />
                            </label>
                            <div className="formButtons">
                                <input 
                                    className="submit-crear-partida input btn btn-active " 
                                    type="submit" 
                                    value="Create lobby"
                                />
                            </div>
                            <div className="message">{message ? <p>{message}</p> : null}</div>
                        </form>
                    </div>
                </div>
            </dialog>
        </div>
    )
}

export default ModalCrearPartida;