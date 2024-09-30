import React from "react";
import { useEffect } from "react";
import useWebSocket from "react-use-websocket";
import mov1 from '../../../assets/movimientos/mov1.svg';
import mov2 from '../../../assets/movimientos/mov2.svg';
import mov3 from '../../../assets/movimientos/mov3.svg';
import mov4 from '../../../assets/movimientos/mov4.svg';
import mov5 from '../../../assets/movimientos/mov5.svg';
import mov6 from '../../../assets/movimientos/mov6.svg';
import mov7 from '../../../assets/movimientos/mov7.svg';

export const CartasMovimiento = () => {

    const { lastJsonMessage } = useWebSocket(websocket_url, { share: true });
    const [cartasMovimiento, setCartasMovimiento] = useState([]);

    useEffect(() => {
        if (lastJsonMessage !== null) {
            if (lastJsonMessage.key == "GET_MOVEMENT_CARD") {
                setTurnos({
                    current_turn: lastJsonMessage.payload.current_turn,
                });
            } else {
                console.error("key incorrecto recibido del websocket");
            }
            }
        }, [
            lastJsonMessage,
            setTurnos,
    ]);


    const cartas = [
        { nombre: "mov1", url: mov1 },
        { nombre: "mov2", url: mov2 },
        { nombre: "mov3", url: mov3 },
        { nombre: "mov4", url: mov4 },
        { nombre: "mov5", url: mov5 },
        { nombre: "mov6", url: mov6 },
        { nombre: "mov7", url: mov7 },
    ];

    return (
        <div className="cartas-figuras">
        {cartas.map((carta, index) => (
            <div key={index} className="carta-figura">
                <img src={carta.url} alt={carta.nombre} />
            </div>
        ))}
        </div>
    );
}

export default CartasMovimiento;