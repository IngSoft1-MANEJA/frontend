import { ServicioPartida } from "../../../services/ServicioPartida";

export function BotonDeshacerMovimientoParcial({ setDeshacerMovimientoParcial }) {
  const deshacerMovimientoParcial = async () => {
    try {
      await ServicioPartida.deshacerMovimientoParcial();
      setDeshacerMovimientoParcial(true);
    } catch (error) {
      console.error("Error al deshacer movimiento parcial", error);
    }
  };

  return (
    <div>
      <button className="btn btn-primary" onClick={deshacerMovimientoParcial}>
        <svg
          className="h-6 w-6"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {" "}
          <path stroke="none" d="M0 0h24v24H0z" />{" "}
          <path d="M9 13l-4 -4l4 -4m-4 4h11a4 4 0 0 1 0 8h-1" />
        </svg>
        Deshacer Movimiento Parcial
      </button>
    </div>
  );
}
