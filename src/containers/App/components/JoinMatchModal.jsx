import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MatchService } from "../../../services/MatchService";

function JoinMatchModal({ matchId }) {
  const [userName, setUserName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleJoin = async (e) => {
    e.preventDefault();
    if (userName) {
      try {
        setIsLoading(true);
        await MatchService.joinMatch(matchId, userName);
        setIsLoading(false);
        navigate("/lobby");
        console.log("lobby called");
      } catch (error) {
        console.error(error.message);
        setIsLoading(false);
      }
    } else {
      setErrorMessage("Por favor, ingrese un nombre de usuario");
    }
  };

  const closeModal = (e) => {
    e.stopPropagation();
    document.getElementById("join_match_modal").close();
    setErrorMessage("");
    setUserName("");
  };

  return (
    <>
      <button
        className="btn"
        onClick={() => document.getElementById("join_match_modal").showModal()}
      >
        unirse a partida
      </button>
      <dialog id="join_match_modal" className="modal">
        <div className="modal-box">
          <button
            onClick={closeModal}
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
                    errorMessage ? "input-error" : ""
                  }`}
                  type="text"
                  placeholder="Nombre"
                  value={userName}
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
                {isLoading && <span className="loading loading-spinner"/>}
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}

export default JoinMatchModal;
