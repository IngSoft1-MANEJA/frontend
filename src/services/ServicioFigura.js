function cartaStringName(carta) {
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
  }
}

function cambiarIdiomaColorFigura(carta) {
  switch (carta) {
    case "red":
      return "rojo";
    case "blue":
      return "azul";
    case "green":
      return "verde";
    case "yellow":
      return "amarillo";
    default:
      return "Color no encontrado.";
  }
}

function repartirCartasFigura(
  ultimoEvento,
  miTurno,
  cartasFiguras,
  setCartasFiguras,
  oponentes,
  setOponentes,
  cartasFigurasCompletadas,
  isBloqued,
) {
  // Setea cartas de figuras del jugador
  const jugadorData = ultimoEvento.payload.find(
    (jugador) => jugador.turn_order === miTurno,
  );

  const cartasNoUsadas = cartasFiguras.filter(
    (carta) =>
      !cartasFigurasCompletadas.some(
        (c) => c === carta[0] || c[0] === carta[0],
      ),
  );

  if (isBloqued) {
    setCartasFiguras(cartasNoUsadas);
  } else if (jugadorData) {
    const nuevasCartas = jugadorData.shape_cards;
    setCartasFiguras([...cartasNoUsadas, ...nuevasCartas]);
  } else {
    console.log(
      "CartasFiguras - No se encontró jugador con turn_order:",
      miTurno,
    );
  }

  // Setea cartas de figuras de los oponentes
  const oponentesActualizados = (oponentes || []).map((oponenteExistente) => {
    const nuevo = ultimoEvento.payload.find(
      (oponente) => oponente.turn_order === oponenteExistente.turn_order,
    );

    if (nuevo) {
      const cartasNoUsadasOponente = (
        oponenteExistente.shape_cards || []
      ).filter((carta) => !cartasFigurasCompletadas.includes(carta[0]));

      const nuevasCartasOponente = nuevo.shape_cards.filter(
        (carta) => !cartasNoUsadasOponente.some((c) => c[0] === carta[0]),
      );

      return {
        ...oponenteExistente,
        shape_cards: [...cartasNoUsadasOponente, ...nuevasCartasOponente],
      };
    }

    return oponenteExistente;
  });

  setOponentes(oponentesActualizados);
}

function ordenarOponentes(oponentes, maxPlayers, miTurno) {
  if (!Array.isArray(oponentes)) {
    return [];
  }
  const oponentesOrdenados = oponentes.sort((a, b) => {
    const turnoA =
      a.turn_order < miTurno ? a.turn_order + maxPlayers : a.turn_order;
    const turnoB =
      b.turn_order < miTurno ? b.turn_order + maxPlayers : b.turn_order;
    return turnoA - turnoB;
  });

  return oponentesOrdenados;
}

const claseCarta = (
  cartaId,
  cartaSeleccionada,
  cartaMovSeleccionada,
  isPlayerTurn,
  cartasFigurasCompletadas,
  bloqueada,
  habilitarAccionesUsuario,
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

  if (cartaMovSeleccionada !== null && bloqueada) {
    return deshabilitada;
  }

  if (!isPlayerTurn || bloqueada || !habilitarAccionesUsuario) {
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

const seleccionarCarta = (
  cartaId,
  isPlayerTurn,
  cartaMovSeleccionada,
  cartaSeleccionada,
  setCartaSeleccionada,
  cartasFigurasCompletadas,
  setEsCartaOponente,
  esOponente,
  bloqueada,
  habilitarAccionesUsuario,
) => {
  if (
    !habilitarAccionesUsuario ||
    !isPlayerTurn ||
    cartaMovSeleccionada !== null ||
    bloqueada ||
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
    setEsCartaOponente(esOponente);
  }
};

export const ServicioFigura = {
  cartaStringName,
  cambiarIdiomaColorFigura,
  ordenarOponentes,
  claseCarta,
  seleccionarCarta,
  repartirCartasFigura,
};
