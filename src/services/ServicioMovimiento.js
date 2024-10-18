import { ServicioPartida } from './ServicioPartida';

const llamarServicio = async (match_id, player_id, newFichasSeleccionadas, cartaSeleccionada, setUsarMovimiento, setMensajeAlerta, setMostrarAlerta) => {
  try {
    const resJson = await ServicioPartida.validarMovimiento(
      match_id,
      player_id,
      newFichasSeleccionadas,
      cartaSeleccionada[1]
    );
    console.log(resJson);

    setTimeout(() => {
      setUsarMovimiento(prev => ({
        ...prev,
        fichasSeleccionadas: [],
        cartaSeleccionada: null,
        cartasUsadas: [...prev.cartasUsadas, prev.cartaSeleccionada],
        highlightCarta: { state: false, key: '' },
      }));
    }, 700);
  } catch (err) {
    setMensajeAlerta("Error al validar movimiento");
    setMostrarAlerta(true);
    setUsarMovimiento(prev => ({
      ...prev,
      fichasSeleccionadas: [],
    }));
    setTimeout(() => {
      setMostrarAlerta(false);
    }, 1000);
    console.log(err);
  }
};

/**
 * Deshace el último movimiento parcial realizado por el jugador. Muestra una alerta en caso de error. 
 * 
 * @param {string} match_id - ID de la partida.
 * @param {string} player_id - ID del jugador.
 * @param {function} setUsarMovimiento - Función para actualizar el estado de usarMovimiento.
 * @param {function} setMensajeAlerta - Función para actualizar el mensaje de alerta.
 * @param {function} setMostrarAlerta - Función para mostrar la alerta en caso de error.
 */
const deshacerMovimiento = async (match_id, player_id, setUsarMovimiento, setMensajeAlerta, setMostrarAlerta) => {
  try {
    const resJson = await ServicioPartida.deshacerMovimientoParcial(match_id, player_id);
    console.log(resJson);

    const cartaADeshacer = resJson.payload.movement_card;

    setUsarMovimiento(prev => ({
      ...prev,
      cartasUsadas: prev.cartasUsadas.filter(carta => carta !== cartaADeshacer[1]),
    }));

    // TODO: Agregar lógica para deshacer movimiento parcial en el tablero.

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
  return fichasSeleccionadas.some(ficha => ficha.rowIndex === rowIndex && ficha.columnIndex === columnIndex);
};

const esMovimientoPosible = (rowIndex, columnIndex, movimientosPosibles) => {
  return movimientosPosibles.some(movimiento => movimiento[0] === rowIndex && movimiento[1] === columnIndex);
};


function calcularMovimientos (rowIndex, columnIndex, carta) {
  const tableroTam = 6;
  const movimientosPosibles = [];
  const estaDentroDelTablero = (i, j) => i >= 0 && i < tableroTam && j >= 0 && j < tableroTam;

  switch (carta) {
    case "Diagonal": {
      const diagonal = [
        [-2, -2], [-2, 2], [2, -2], [2, 2]
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
        [-2, 0], [2, 0], [0, -2], [0, 2]
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
        [-1, 0], [1, 0], [0, -1], [0, 1]
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
        [-1, -1], [-1, 1], [1, -1], [1, 1]
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
        [2, 1], [-1, 2], [1, -2], [-2, -1]
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
        [-2, 1], [2, -1], [-1, -2], [1, 2]
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
        [0, columnIndex], [rowIndex, 0], [rowIndex, 5], [5, columnIndex],  
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
};

export const ServicioMovimiento = {
  calcularMovimientos,
  llamarServicio,
  deshacerMovimiento,
  estaHighlighted,
  esMovimientoPosible
};
