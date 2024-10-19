import { ModalCancelarPartida } from "../containers/Lobby/components/ModalCancelarPartida.jsx";
import { cleanup, render, screen } from "@testing-library/react";

afterEach(() => {
  jest.clearAllMocks();
  cleanup();
});

describe("ModalGanaste", () => {
  test("deberia mostrar el modal si mostrar es true", () => {
    render(
      <ModalCancelarPartida
        mostrar={true}
        texto={"modal test"}
        enVolverAlHome={() => {}}
      />,
    );
    const modal = screen.getByText("modal test");
    expect(modal).toBeInTheDocument();
  });

  test("no deberia mostrar el modal si mostrar es false", () => {
    render(
      <ModalCancelarPartida
        mostrar={false}
        texto={"modal test"}
        enVolverAlHome={() => {}}
      />,
    );
    const modal = screen.queryByText("modal test");
    expect(modal).not.toBeInTheDocument();
  });

  test("deberia llamar a la funcion enVolverAlHome al hacer click en el boton", () => {
    const enVolverAlHome = jest.fn();
    render(
      <ModalCancelarPartida
        mostrar={true}
        texto={"modal test"}
        enVolverAlHome={enVolverAlHome}
      />,
    );
    const boton = screen.getByText("Volver al home");
    boton.click();
    expect(enVolverAlHome).toHaveBeenCalled();
  });
});
