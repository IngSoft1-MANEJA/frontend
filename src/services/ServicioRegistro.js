import { WebsocketEvents } from "./ServicioWebsocket";
import { JugadorGanoMotivo } from "./ServicioPartida";
import { ServicioFigura } from "./ServicioFigura";

function procesarMensajeEvento(
  currentEvent,
  setRegistro,
  datosJugador,
  datosPartida,
  setInformacionChat,
) {
  switch (currentEvent.key) {
    case "GET_PLAYER_MATCH_INFO":
      setRegistro((prevRegistro) => [
        ...prevRegistro,
        {
          mensaje:
            "Te has unido a la partida, tu orden de turno es: " +
            currentEvent.payload.turn_order,
          tipo: "evento",
          turn_order: currentEvent.payload.turn_order ?? null,
          player_name: currentEvent.payload.player_name ?? null,
        },
      ]);
      break;
    case "PLAYER_RECEIVE_SHAPE_CARD":
      if (currentEvent.payload[0].shape_cards.length > 0) {
        if (currentEvent.payload[0].shape_cards.length === 1) {
          setRegistro((prevRegistro) => [
            ...prevRegistro,
            {
              mensaje: `El jugador "${currentEvent.payload[0].player}" ha recibido la carta de figura "${ServicioFigura.cartaStringName(currentEvent.payload[0].shape_cards[0][1])}".`,
              tipo: "evento",
              turn_order: currentEvent.payload.turn_order ?? null,
              player_name: currentEvent.payload.player_name ?? null,
            },
          ]);
        } else {
          setRegistro((prevRegistro) => [
            ...prevRegistro,
            {
              mensaje: `El jugador "${currentEvent.payload[0].player}" ha recibido las cartas de figura "${currentEvent.payload[0].shape_cards.map((figura) => ServicioFigura.cartaStringName(figura[1])).join(", ")}".`,
              tipo: "evento",
              turn_order: currentEvent.payload.turn_order ?? null,
              player_name: currentEvent.payload.player_name ?? null,
            },
          ]);
        }
      }
      break;
    case "END_PLAYER_TURN":
      setRegistro((prevRegistro) => [
        ...prevRegistro,
        {
          mensaje: `El jugador "${currentEvent.payload.current_player_name}" ha terminado su turno.`,
          tipo: "evento",
        },
        {
          mensaje: `Turno de "${currentEvent.payload.next_player_name}".`,
          tipo: "evento",
          turn_order: currentEvent.payload.turn_order ?? null,
          player_name: currentEvent.payload.player_name ?? null,
        },
      ]);
      break;
    case "PLAYER_RECEIVE_NEW_BOARD":
      setRegistro((prevRegistro) => [
        ...prevRegistro,
        {
          mensaje: `El jugador "${datosPartida.current_player_name}" ha realizado un movimiento.`,
          tipo: "evento",
          turn_order: currentEvent.payload.turn_order ?? null,
          player_name: currentEvent.payload.player_name ?? null,
        },
      ]);
      break;
    case "COMPLETED_FIGURE":
      setRegistro((prevRegistro) => [
        ...prevRegistro,
        {
          mensaje: `El jugador "${datosPartida.current_player_name}" ha completado la figura "${ServicioFigura.cartaStringName(currentEvent.payload.figure_name)}".`,
          tipo: "evento",
          turn_order: currentEvent.payload.turn_order ?? null,
          player_name: currentEvent.payload.player_name ?? null,
        },
        {
          mensaje: `Nuevo color prohibido: ${currentEvent.payload.ban_color === null ? "Ninguno" : ServicioFigura.cambiarIdiomaColorFigura(currentEvent.payload.ban_color)}.`,
          tipo: "evento",
          turn_order: currentEvent.payload.turn_order ?? null,
          player_name: currentEvent.payload.player_name ?? null,
        },
      ]);
      break;
    case "PLAYER_LEFT":
      setRegistro((prevRegistro) => [
        ...prevRegistro,
        {
          mensaje: `El jugador "${currentEvent.payload.name}" ha abandonado la partida.`,
          tipo: "evento",
          turn_order: currentEvent.payload.turn_order ?? null,
          player_name: currentEvent.payload.player_name ?? null,
        },
      ]);
      break;
    case "PLAYER_SEND_MESSAGE":
      setRegistro((prevRegistro) => [
        ...prevRegistro,
        {
          mensaje: `${currentEvent.payload.message}`,
          tipo: "chat",
          turn_order: currentEvent.payload.turn_order ?? null,
          player_name: currentEvent.payload.player_name ?? null,
        },
      ]);
      break;
    case WebsocketEvents.UNDO_PARTIAL_MOVE:
      setRegistro((prevRegistro) => [
        ...prevRegistro,
        {
          mensaje: `El jugador "${datosPartida.current_player_name}" ha deshecho un movimiento.`,
          tipo: "evento",
          turn_order: currentEvent.payload.turn_order ?? null,
          player_name: currentEvent.payload.player_name ?? null,
        },
      ]);
      break;
    case WebsocketEvents.WINNER:
      if (currentEvent.payload.reason === JugadorGanoMotivo.FORFEIT) {
        setRegistro((prevRegistro) => [
          ...prevRegistro,
          {
            mensaje: "Has ganado la partida!",
            tipo: "evento",
            turn_order: currentEvent.payload.turn_order ?? null,
            player_name: currentEvent.payload.player_name ?? null,
          },
        ]);
      }
      if (currentEvent.payload.reason === JugadorGanoMotivo.NORMAL) {
        if (datosJugador.player_id === currentEvent.payload.player_id) {
          setRegistro((prevRegistro) => [
            ...prevRegistro,
            {
              mensaje: "Has ganado la partida!",
              tipo: "evento",
              turn_order: currentEvent.payload.turn_order ?? null,
              player_name: currentEvent.payload.player_name ?? null,
            },
          ]);
        } else {
          setRegistro((prevRegistro) => [
            ...prevRegistro,
            {
              mensaje: "Has perdido la partida.",
              tipo: "evento",
              turn_order: currentEvent.payload.turn_order ?? null,
              player_name: currentEvent.payload.player_name ?? null,
            },
          ]);
        }
      }
      break;
    default:
      break;
  }
}

export const ServicioRegistro = {
  procesarMensajeEvento,
};
