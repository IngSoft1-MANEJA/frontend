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
import "./cartasMovimiento.css";

const urlMap = {
    "Diagonal": mov1,
    "Inverse Diagonal": mov2,
    "Line": mov3,
    "Line Between": mov4,
    "Line Border": mov5,
    "L": mov6,
    "Inverse L": mov7
}

export const CartasMovimiento = () => {

    /*const websocket_url = `${WEBSOCKET_URL}/${match_id}/ws/${player_id}`;
    const { lastJsonMessage } = useWebSocket(websocket_url, { share: true });
    const [cartasMovimiento, setCartasMovimiento] = useState([]);

    
    useEffect(() => {
        if (lastJsonMessage !== null) {
            if (lastJsonMessage.key == "GET_MOVEMENT_CARD") {
                setCartasMovimiento(lastJsonMessage.payload);
            } else {
                console.error("key incorrecto recibido del websocket");
            }
            }
        }, [
            lastJsonMessage,
            setCartasMovimiento,
        ]);*/

    const cartasMovimiento = [
        { name: "Diagonal" },
        { name: "Inverse Diagonal" },
        { name: "L" }];
        
    return (
        <div className="cartas-movimientos">
        {cartasMovimiento.map((carta, index) => (
            <div key={index} className="carta-movimiento">
                <img src={urlMap[carta.name]} alt={carta.name} />
            </div>
        ))}
        </div>
    );
}

export default CartasMovimiento;