
function ordenarOponentes (oponentes, maxPlayers, miTurno) {
  const oponentesOrdenados = oponentes.sort((a, b) => {
    const turnoA = a.turn_order < miTurno ? a.turn_order + maxPlayers : a.turn_order;
    const turnoB = b.turn_order < miTurno ? b.turn_order + maxPlayers : b.turn_order;
    return turnoA - turnoB;
  });

  return oponentesOrdenados;
};

const claseCarta = (
  cartaId,
  cartaSeleccionada,
  cartaMovSeleccionada,
  isPlayerTurn,
  cartasFigurasCompletadas
) => {
  const efectoHover =
    " hover:cursor-pointer" +
    " hover:shadow-[0px_0px_15px_rgba(224,138,44,1)]" +
    " hover:scale-105";

  const efectoSeleccionada =
    " cursor-pointer" +
    " shadow-[0px_0px_20px_rgba(100,200,44,1)]" +
    " scale-105";

  const deshabilitada = "opacity-25 pointer-events-none greyscale";

  if (cartasFigurasCompletadas.includes(cartaId)) {
    return deshabilitada;
  }

  if (!isPlayerTurn) {
    return "";
  }

  if (cartaMovSeleccionada !== null) {
    return deshabilitada;
  }

  if (cartaSeleccionada !== null) {
    if (cartaSeleccionada === cartaId) {
      return efectoSeleccionada;
    } else {
      return deshabilitada;
    }
  }

  return efectoHover;
};

const seleccionarCarta = (cartaId, isPlayerTurn, cartaMovSeleccionada, cartaSeleccionada, setCartaSeleccionada, cartasFigurasCompletadas) => {
  if (
    !isPlayerTurn ||
    cartaMovSeleccionada !== null ||
    cartasFigurasCompletadas.includes(cartaId)
  ) {
    return;
  }

  if (cartaSeleccionada !== null) {
    if (cartaSeleccionada === cartaId) {
      setCartaSeleccionada(null);
    }
  } else {
    setCartaSeleccionada(cartaId);
  }
};

export const ServicioFigura = {ordenarOponentes, claseCarta, seleccionarCarta};