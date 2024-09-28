import { BACKEND_URL } from "../appConfigVars";

export class MatchService {
  static ENDPOINT_GROUP = "match";

  static async joinMatch(matchId, playerName) {
    const response = await fetch(
      `${BACKEND_URL}/${this.ENDPOINT_GROUP}/${matchId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ player_name: playerName }),
      }
    );

    if (!response.ok) {
      throw new Error(`Error joining match - status: ${response.status}`);
    }

    const json = await response.json();
    return json;
  }
}