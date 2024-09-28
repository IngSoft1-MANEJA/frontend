import "./AbandonarPartida.css";
import { useNavigate } from "react-router-dom";
import { ServicioPartida } from "../../../services/ServicioPartida";

export const AbandonarPartida = ({idJugador, idPartida}) => {
    const navigate = useNavigate();

    const manejarAbandonar = async () => {
        try {
            await ServicioPartida.abandonarPartida(idJugador, idPartida);
            navigate("/");
        } catch (error) {
            console.error("Error al abandonar partida", error);
        }
    }

    return (
        <div>
            <button className="abandonar-partida-boton" onClick={manejarAbandonar}>
                Abandonar
            </button>
        </div>
    )
}

export default AbandonarPartida;