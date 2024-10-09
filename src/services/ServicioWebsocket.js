import "react-use-websocket";
import { WEBSOCKET_URL } from "../variablesConfiguracion";

export const WebsocketEvents = Object.freeze({
    WINNER: "WINNER",
    PLAYER_JOIN: "PLAYER_JOIN",
    PLAYER_LEFT: "PLAYER_LEFT",
    START_MATCH: "START_MATCH",
});

export const crearWebsocket = (match_id, player_id) => {
  const websocket_url = `${WEBSOCKET_URL}/matches/${match_id}/ws/${player_id}`;
  return useWebSocket(websocket_url, {
    share: true,
    onClose: () => console.log("Websocket - Lobby: conexión cerrada."),
    onError: (event) => console.error("Websocket - Lobby: error: ", event),
    onOpen: () => console.log("Websocket - Lobby: conexión abierta."),
  });
}