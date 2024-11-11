export const CrearPartidaMock = {
  nombreJugador: "nombreJugador",
  nombreSala: "nombreSala",
  cantidadJugadores: 3,
  clave: "",
};

export const CrearPartidaMockError = {
  nombreJugador:
    "nombreJugadorEsDemasiadoLargoParaSerUsadoEnElCampoDeNombreJugador",
  nombreSala: "nombreSala",
  cantidadJugadores: 74,
  clave: "",
};

export const CrearPartidaMockConClave = {
  ...CrearPartidaMock,
  clave: "123456",
};

export const CrearPartidaMockErrorConClave = {
  ...CrearPartidaMockError,
  clave: "contraseñaQueSuperaLos50CaracteresDeLimiteParaLaContraseña",
};
