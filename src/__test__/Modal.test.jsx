import { Modal } from "../components/Modal.jsx";
import { cleanup, render, screen } from "@testing-library/react";

afterEach(() => {
  jest.clearAllMocks();
  cleanup();
});

describe("ModalGanaste", () => {
  it("deberia mostrar el modal si mostrar es true", () => {
    render(
      <Modal
        mostrar={true}
        texto={"modal test"}
        funcionDeClick={() => {}}
        boton={"boton test"}
      />,
    );
    const modal = screen.getByText("modal test");
    expect(modal).toBeInTheDocument();
  });

  it("no deberia mostrar el modal si mostrar es false", () => {
    render(
      <Modal
        mostrar={false}
        texto={"modal test"}
        funcionDeClick={() => {}}
        boton={"boton test"}
      />,
    );
    const modal = screen.queryByText("modal test");
    expect(modal).not.toBeInTheDocument();
  });

  it("deberia llamar a la funcion funcionDeClick al hacer click en el boton", () => {
    const enVolverAlHome = jest.fn();
    render(
      <Modal
        mostrar={true}
        texto={"modal test"}
        funcionDeClick={enVolverAlHome}
        boton={"boton test"}
      />,
    );
    const boton = screen.getByText("boton test");
    boton.click();
    expect(enVolverAlHome).toHaveBeenCalled();
  });
});
