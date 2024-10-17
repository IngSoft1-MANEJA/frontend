import "react-use-websocket";
import { WEBSOCKET_URL } from "../variablesConfiguracion";

export const WebsocketEvents = Object.freeze({
  WINNER: "WINNER",
  PLAYER_JOIN: "PLAYER_JOIN",
  PLAYER_LEFT: "PLAYER_LEFT",
  START_MATCH: "START_MATCH",
});
