import React from "react";
import { screen, render, waitFor } from "@testing-library/react";
import { jest } from "@jest/globals";
import { InformacionTurno } from "../containers/App/components/InformacionTurno.jsx";

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        current_player_turn: "Player 1",
        next_player_turn: "Player 2",
      }),
  }),
);

const consoleErrorMock = jest
  .spyOn(console, "error")
  .mockImplementation(() => {});

describe("InformacionTurno", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("fetches and displays turn information correctly", async () => {
    render(<InformacionTurno matchId="12345" />);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "/matches/12345/Board",
        expect.objectContaining({
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }),
      );
    });

    await waitFor(() => {
      expect(screen.getByText("Current")).toBeInTheDocument();
      expect(screen.getByText("Player 1")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("Next")).toBeInTheDocument();
      expect(screen.getByText("Player 2")).toBeInTheDocument();
    });
  });

  test("handles fetch error gracefully", async () => {
    fetch.mockImplementationOnce(() => Promise.reject("API is down"));

    render(<InformacionTurno matchId="12345" />);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "/matches/12345/Board",
        expect.objectContaining({
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }),
      );
    });

    expect(consoleErrorMock).toHaveBeenCalledWith(
      "Error en fetch",
      "API is down",
    );

    await waitFor(() => {
      expect(screen.getByText("Current")).toBeInTheDocument();
      expect(screen.getByText("Next")).toBeInTheDocument();
    });
  });
});
