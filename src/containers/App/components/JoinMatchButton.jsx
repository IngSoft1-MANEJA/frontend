import { useState } from "react";
import { useNavigate } from "react-router-dom";

function JoinMatchButton(props) {
    const [ userName, setUserName ] = useState("");
    const [ errorMessage, setErrorMessage ] = useState("");
    const navigate = useNavigate();

    const handleJoin = (e) => {
        e.preventDefault();
        console.log(userName);
        if (userName) {
            navigate("/lobby");
        } else {
            setErrorMessage("Por favor, ingrese un nombre de usuario");
        }
    };

    return (
      <>
        <button
          className="btn"
          onClick={() =>
            document.getElementById("join_match_modal").showModal()
          }
        >
          unirse a partida
        </button>
        <dialog id="join_match_modal" className="modal">
          <div className="modal-box">
            <form method="dialog">
              <button
                onClick={() => setErrorMessage("")}
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              >
                ✕
              </button>
            </form>
            <div className="flex items-center">
              <form className="flex flex-col items-start">
                <label className="form-control mb-6">
                  <div className="label">
                    <span className="label-text">Ingresa tu nombre</span>
                  </div>
                  <input
                    className={`input input-bordered ${
                      errorMessage ? "input-error" : ""
                    }`}
                    type="text"
                    placeholder="Nombre"
                    onChange={(e) => setUserName(e.target.value)}
                  />
                  <div className="label">
                    <span className="label-text-alt text-error">
                      {errorMessage}
                    </span>
                  </div>
                </label>
                <button className="btn" onClick={handleJoin}>
                  Unirse
                </button>
              </form>
            </div>
          </div>
        </dialog>
      </>
    );
}

export default JoinMatchButton;