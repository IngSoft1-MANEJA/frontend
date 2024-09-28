import React from "react";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import {
  render,
  fireEvent,
  screen,
  cleanup,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import JoinMatchModal from "../containers/App/components/JoinMatchModal";
import { BACKEND_URL } from "../appConfigVars";
import { BrowserRouter, MemoryRouter } from "react-router-dom";

const server = setupServer(
  http.post(`${BACKEND_URL}/match/:id`, () => {
    return new HttpResponse(null, { status: 201 });
  })
);

const mockUsedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockUsedNavigate,
}));

describe("JoinMatchButton", () => {
  beforeAll(() => {
    server.listen({onUnhandledRequest: 'error'});
    HTMLDialogElement.prototype.showModal = jest.fn();
    HTMLDialogElement.prototype.close = jest.fn();
    HTMLFormElement.prototype.requestSubmit = jest.fn();
  });

  afterEach(cleanup);
  afterEach(() => {
    jest.clearAllMocks();
    server.resetHandlers();
  });

  afterAll(() => server.close());

  it("should render correctly", () => {
    render(<JoinMatchModal matchId={1} />);
  });

  it("should call showModal when button is clicked", () => {
    render(<JoinMatchModal matchId={1} />);

    fireEvent.click(screen.getByText("unirse a partida"));

    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalledTimes(1);
  });

  it("should call close when close button is clicked", () => {
    render(<JoinMatchModal matchId={1} />);

    fireEvent.click(screen.getByText("unirse a partida"));
    fireEvent.click(screen.getByText("✕"));

    expect(HTMLDialogElement.prototype.close).toHaveBeenCalledTimes(1);
  });

  it("should clear modal input when closed", () => {
    render(<JoinMatchModal matchId={1} />);

    fireEvent.click(screen.getByText("unirse a partida"));

    const el = screen.getByLabelText("Ingresa tu nombre");
    const input = el.parentElement.parentElement.querySelector("input");

    fireEvent.change(input, { target: { value: "test" } });
    expect(input.value).toBe("test");

    fireEvent.click(screen.getByText("✕"));
    expect(input.value).toBe("");
  });

  it("should show an error message when no username is entered and clicked join", () => {
    render(<JoinMatchModal matchId={1} />);

    fireEvent.click(screen.getByText("unirse a partida"));
    fireEvent.click(screen.getByText("Unirse"));

    const errorMessage = screen.getByText(
      "Por favor, ingrese un nombre de usuario"
    );
    expect(errorMessage).toBeInTheDocument();
  });

  it("should make a successful join match request and navigate to lobby", async () => {
    console.error = jest.fn();
    server.use(
      http.post(`${BACKEND_URL}/match/:id`, async ({ request, params }) => {
        const { id } = params;
        const { player_name } = JSON.parse(request.body);

        if (id !== "1" || player_name !== "test") {
          return new HttpResponse(null, { status: 400 });
        }

        return new HttpResponse(null, { status: 201 });
      })
    );

    render(
      <MemoryRouter>
        <JoinMatchModal matchId={1} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("unirse a partida"));

    const el = screen.getByLabelText("Ingresa tu nombre");
    const input = el.parentElement.parentElement.querySelector("input");

    fireEvent.change(input, { target: { value: "test" } });
    fireEvent.click(screen.getByText("Unirse"));

    await waitFor(() => {
      expect(console.error).not.toHaveBeenCalled();
      expect(mockUsedNavigate).toHaveBeenCalledTimes(1);
      expect(mockUsedNavigate).toHaveBeenCalledWith("/lobby");
    });
  });
});
