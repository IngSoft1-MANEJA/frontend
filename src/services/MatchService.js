import { BACKEND_URL } from "../constants";

export class MatchService {
  static BASE_URL = "/match";

  static async joinMatch(matchId, playerName) {
    const response = await fetch(`${BACKEND_URL}/${this.BASE_URL}/${matchId}/join`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ player_name: playerName }),
    });


    if (!response.ok) {
        throw new Error(`Error joining match - status: ${response.status}`);
    }

    const json = await response.json();
    return json;
  }
}