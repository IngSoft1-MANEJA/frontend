import { ServicioPartida } from "./ServicioPartida";

const llamarServicio = async (
  match_id,
  player_id,
  tiles,
  newFichasSeleccionadas,
  cartaSeleccionada,
  setUsarMovimiento,
  setMensajeAlerta,
  setMostrarAlerta,
  setTiles,
  setHaValidadoMovimiento,
) => {
  try {
    const resJson = await ServicioPartida.validarMovimiento(
      match_id,
      player_id,
      newFichasSeleccionadas,
      cartaSeleccionada[0],
    );
    console.log(resJson);

    swapFichas(newFichasSeleccionadas, tiles, setTiles, setUsarMovimiento);
    setHaValidadoMovimiento(false);

    setTimeout(() => {
      setUsarMovimiento((prev) => ({
        ...prev,
        fichasSeleccionadas: [],
        cartaSeleccionada: null,
        cartasUsadas: [...prev.cartasUsadas, prev.cartaSeleccionada || ""],
        highlightCarta: { state: false, key: "" },
      }));
    }, 700);
  } catch (err) {
    setMensajeAlerta("Error al validar movimiento");
    setMostrarAlerta(true);
    setUsarMovimiento((prev) => ({
      ...prev,
      fichasSeleccionadas: [],
    }));
    setTimeout(() => {
      setMostrarAlerta(false);
    }, 1000);
    console.log(err);
  }
};

function swapFichas(fichasSeleccionadas, tiles, setTiles) {
  if (fichasSeleccionadas.length === 2) {
    const [ficha1, ficha2] = fichasSeleccionadas;

    const { rowIndex: filaFicha1, columnIndex: columnaFicha1 } = ficha1;
    const { rowIndex: filaFicha2, columnIndex: columnaFicha2 } = ficha2;

    const ficha1Element = document.getElementById(
      `ficha-${filaFicha1}-${columnaFicha1}`,
    );
    const ficha2Element = document.getElementById(
      `ficha-${filaFicha2}-${columnaFicha2}`,
    );

    // Aplicar la clase para desvanecer las fichas
    ficha1Element.classList.add("oculto");
    ficha2Element.classList.add("oculto");

    // Esperar a que la animación termine antes de intercambiar
    setTimeout(() => {
      // Intercambiar las fichas en el estado
      const newTiles = tiles.map((row) => [...row]);

      const temp = newTiles[filaFicha1][columnaFicha1];
      newTiles[filaFicha1][columnaFicha1] = newTiles[filaFicha2][columnaFicha2];
      newTiles[filaFicha2][columnaFicha2] = temp;

      setTiles(newTiles);

      // Mostrar las fichas intercambiadas
      ficha1Element.classList.remove("oculto");
      ficha2Element.classList.remove("oculto");
    }, 500); // Duración de la animación (0.5s)
  }
  return tiles;
}

/**
 * Deshace el último movimiento parcial realizado por el jugador. Muestra una alerta en caso de error.
 *
 * @param {string} match_id - ID de la partida.
 * @param {string} player_id - ID del jugador.
 * @param {function} setUsarMovimiento - Función para actualizar el estado de usarMovimiento.
 * @param {function} setMensajeAlerta - Función para actualizar el mensaje de alerta.
 * @param {function} setMostrarAlerta - Función para mostrar la alerta en caso de error.
 * @param {Array<Array<string>>} tiles - Tablero de fichas, matriz de colores.
 * @param {function} setTiles - Función para actualizar el estado de las fichas.
 */
const deshacerMovimiento = async (
  match_id,
  player_id,
  setUsarMovimiento,
  setMensajeAlerta,
  setMostrarAlerta,
  tiles,
  setTiles,
) => {
  try {
    const respuesta = await ServicioPartida.deshacerMovimientoParcial(
      match_id,
      player_id,
    );
    console.log(respuesta);

    const cartaADeshacer = respuesta.movement_card;

    setUsarMovimiento((prev) => ({
      ...prev,
      cartasUsadas: prev.cartasUsadas.filter(
        (carta) => carta[0] !== cartaADeshacer[0],
      ),
    }));

    ServicioMovimiento.swapFichas(respuesta.tiles, tiles, setTiles);
  } catch (err) {
    setMensajeAlerta("Error al deshacer movimiento");
    setMostrarAlerta(true);
    setTimeout(() => {
      setMostrarAlerta(false);
    }, 1000);
    console.log(err);
  }
};

const estaHighlighted = (rowIndex, columnIndex, fichasSeleccionadas) => {
  return fichasSeleccionadas.some(
    (ficha) => ficha.rowIndex === rowIndex && ficha.columnIndex === columnIndex,
  );
};

const esMovimientoPosible = (rowIndex, columnIndex, movimientosPosibles) => {
  return movimientosPosibles.some(
    (movimiento) => movimiento[0] === rowIndex && movimiento[1] === columnIndex,
  );
};

function calcularMovimientos(rowIndex, columnIndex, carta) {
  const tableroTam = 6;
  const movimientosPosibles = [];
  const estaDentroDelTablero = (i, j) =>
    i >= 0 && i < tableroTam && j >= 0 && j < tableroTam;

  switch (carta) {
    case "Diagonal": {
      const diagonal = [
        [-2, -2],
        [-2, 2],
        [2, -2],
        [2, 2],
      ];
      diagonal.forEach(([dx, dy]) => {
        const nuevaX = rowIndex + dx;
        const nuevaY = columnIndex + dy;
        if (estaDentroDelTablero(nuevaX, nuevaY)) {
          movimientosPosibles.push([nuevaX, nuevaY]);
        }
      });
      break;
    }

    case "Line Between": {
      const lineBetween = [
        [-2, 0],
        [2, 0],
        [0, -2],
        [0, 2],
      ];
      lineBetween.forEach(([dx, dy]) => {
        const nuevaX = rowIndex + dx;
        const nuevaY = columnIndex + dy;
        if (estaDentroDelTablero(nuevaX, nuevaY)) {
          movimientosPosibles.push([nuevaX, nuevaY]);
        }
      });
      break;
    }

    case "Line": {
      const line = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
      ];
      line.forEach(([dx, dy]) => {
        const nuevaX = rowIndex + dx;
        const nuevaY = columnIndex + dy;
        if (estaDentroDelTablero(nuevaX, nuevaY)) {
          movimientosPosibles.push([nuevaX, nuevaY]);
        }
      });
      break;
    }

    case "Inverse Diagonal": {
      const inverseDiagonal = [
        [-1, -1],
        [-1, 1],
        [1, -1],
        [1, 1],
      ];
      inverseDiagonal.forEach(([dx, dy]) => {
        const nuevaX = rowIndex + dx;
        const nuevaY = columnIndex + dy;
        if (estaDentroDelTablero(nuevaX, nuevaY)) {
          movimientosPosibles.push([nuevaX, nuevaY]);
        }
      });
      break;
    }

    case "L": {
      const saltoL = [
        [2, 1],
        [-1, 2],
        [1, -2],
        [-2, -1],
      ];
      saltoL.forEach(([dx, dy]) => {
        const nuevaX = rowIndex + dx;
        const nuevaY = columnIndex + dy;
        if (estaDentroDelTablero(nuevaX, nuevaY)) {
          movimientosPosibles.push([nuevaX, nuevaY]);
        }
      });
      break;
    }

    case "Inverse L": {
      const saltoInverseL = [
        [-2, 1],
        [2, -1],
        [-1, -2],
        [1, 2],
      ];
      saltoInverseL.forEach(([dx, dy]) => {
        const nuevaX = rowIndex + dx;
        const nuevaY = columnIndex + dy;
        if (estaDentroDelTablero(nuevaX, nuevaY)) {
          movimientosPosibles.push([nuevaX, nuevaY]);
        }
      });
      break;
    }

    case "Line Border": {
      const lineBorder = [
        [0, columnIndex],
        [rowIndex, 0],
        [rowIndex, 5],
        [5, columnIndex],
      ];
      lineBorder.forEach(([dx, dy]) => {
        if (!(dx === rowIndex && dy === columnIndex)) {
          movimientosPosibles.push([dx, dy]);
        }
      });
      break;
    }

    default:
      console.log("Carta desconocida");
  }

  return movimientosPosibles;
}

export const ServicioMovimiento = {
  calcularMovimientos,
  llamarServicio,
  deshacerMovimiento,
  estaHighlighted,
  esMovimientoPosible,
  swapFichas,
};
