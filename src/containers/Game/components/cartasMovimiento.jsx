import React from "react";
import { useEffect } from "react";
import { WEBSOCKET_URL } from "../../../variablesConfiguracion";
import useWebSocket from "react-use-websocket";
import mov1 from '../../../assets/movimientos/mov1.svg';
import mov2 from '../../../assets/movimientos/mov2.svg';
import mov3 from '../../../assets/movimientos/mov3.svg';
import mov4 from '../../../assets/movimientos/mov4.svg';
import mov5 from '../../../assets/movimientos/mov5.svg';
import mov6 from '../../../assets/movimientos/mov6.svg';
import mov7 from '../../../assets/movimientos/mov7.svg';
import backmov from '../../../assets/movimientos/back-mov.svg';
import "./cartasMovimiento.css";

const urlMap = {
    "DIAGONAL": mov1,
    "INVERSE_DIAGONAL": mov2,
    "LINE": mov3,
    "LINE_BETWEEN": mov4,
    "LINE_BORDER": mov5,
    "L": mov6,
    "INVERSE_L": mov7
}

export const CartasMovimiento = () => {

    /*const websocket_url = `${WEBSOCKET_URL}/${match_id}/ws/${player_id}`;
    const { lastJsonMessage } = useWebSocket(websocket_url, { share: true });
    const [cartasMovimiento, setCartasMovimiento] = useState([]);
    const [cartasOponente, setCartasOponente] = useState([]);
    
    useEffect(() => {
        if (lastJsonMessage !== null) {
            if (lastJsonMessage.key == "GET_MOVEMENT_CARD") {
                setCartasMovimiento(lastJsonMessage.payload);
            } else if (lastJsonMessage.key == "PLAYER_RECEIVE_MOVEMENT_CARD") {
                setCartasOponente(lastJsonMessage.payload);
            } else {
                console.error("key incorrecto recibido del websocket");
            }
            }
        }, [
            lastJsonMessage,
            setCartasMovimiento,
        ]);
        */

        const cartasMovimiento = [ {name: "DIAGONAL"}, {name: "INVERSE_DIAGONAL"}, {name: "LINE"}];
        const Oponentes = [1, 2];

        return (
            <div className="cartas-movimientos">
                <div className="cartas-movimientos-propias">
                    {cartasMovimiento.map((carta, index) => (
                        <div key={index} className="carta-movimiento">
                            <img src={urlMap[carta.name]} alt={carta.name}/>
                        </div>
                    ))}
                </div>
                <div className="cartas-movimientos-oponente-arriba">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="carta-movimiento">
                            <img src={backmov}/>
                        </div>
                    ))}
                </div>
                {Oponentes.length > 1 && (
                <div className="cartas-movimientos-oponente-derecha">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="carta-movimiento">
                            <img src={backmov}/>
                        </div>
                    ))}
                </div>
                )}
                {Oponentes.length > 2 && (
                <div className="cartas-movimientos-oponente-izquierda">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="carta-movimiento">
                            <img src={backmov}/>
                        </div>
                    ))}
                </div>
                )}
            </div>
        );
}

export default CartasMovimiento;