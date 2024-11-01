function cartaStringName (carta) {
  switch (carta) {
    case 1:
      return "T_90";
    case 2:
      return "INVERSE_SNAKE";
    case 3:
      return "SNAKE";
    case 4:
      return "STAIRS";
    case 5:
      return "LINE";
    case 6:
      return "L";
    case 7:
      return "INVERSE_L_90";
    case 8:
      return "L_90";
    case 9:
      return "TOILET";
    case 10:
      return "Z_90";
    case 11:
      return "INVERSE_TOILET";
    case 12:
      return "S_90";
    case 13:
      return "BATON";
    case 14:
      return "INVERSE_BATON";
    case 15:
      return "TURTLE";
    case 16:
      return "U";
    case 17:
      return "PLUS";
    case 18:
      return "DOG";
    case 19:
      return "MINI_SNAKE";
    case 20:
      return "SQUARE";
    case 21:
      return "INVERSE_MINI_SNAKE";
    case 22:
      return "TRIANGLE";
    case 23:
      return "INVERSE_MINI_L";
    case 24:
      return "MINI_LINE";
    case 25:
      return "MINI_L_90";
    default:
      return "Figura no encontrada.";
      break;
  }
};

function ordenarOponentes (oponentes, maxPlayers, miTurno) {
  if (!Array.isArray(oponentes)) {
    return [];
  }
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

export const ServicioFigura = {cartaStringName, ordenarOponentes, claseCarta, seleccionarCarta};