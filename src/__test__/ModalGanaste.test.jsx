import ModalGanaste from "../containers/Game/components/ModalGanaste";
import { cleanup, render, screen } from "@testing-library/react";

afterEach(() => {
  jest.clearAllMocks();
  cleanup();
});

describe("ModalGanaste", () => {
  it("deberia mostrar el modal si mostrar es true", () => {
    render(
      <ModalGanaste
        mostrar={true}
        texto={"modal test"}
        enVolverAlHome={() => {}}
      />,
    );
    const modal = screen.getByText("modal test");
    expect(modal).toBeInTheDocument();
  });

  it("no deberia mostrar el modal si mostrar es false", () => {
    render(
      <ModalGanaste
        mostrar={false}
        texto={"modal test"}
        enVolverAlHome={() => {}}
      />,
    );
    const modal = screen.queryByText("modal test");
    expect(modal).not.toBeInTheDocument();
  });

  it("deberia llamar a la funcion enVolverAlHome al hacer click en el boton", () => {
    const enVolverAlHome = jest.fn();
    render(
      <ModalGanaste
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
