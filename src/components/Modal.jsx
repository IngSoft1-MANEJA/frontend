function Modal() {
  const cerrarModal = (e) => {
    e.stopPropagation();
    document.getElementById("modal").close();
  };

  return (
    <>
      <div className="unirse-partida"></div>
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
                {estaCargando && <span className="loading loading-spinner" />}
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}

export default Modal;
