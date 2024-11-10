export const CrearPartidaMock = {
  nombreJugador: "nombreJugador",
  nombreSala: "nombreSala",
  cantidadJugadores: 3,
  contraseña: "",
};

export const CrearPartidaMockError = {
  nombreJugador:
    "nombreJugadorEsDemasiadoLargoParaSerUsadoEnElCampoDeNombreJugador",
  nombreSala: "nombreSala",
  cantidadJugadores: 74,
  contraseña: "",
};

export const CrearPartidaMockConContraseña = {
  ...CrearPartidaMock,
  contraseña: "123456",
};

export const CrearPartidaMockErrorConContraseña = {
  ...CrearPartidaMockError,
  contraseña: "contraseñaQueSuperaLos50CaracteresDeLimiteParaLaContraseña",
};
