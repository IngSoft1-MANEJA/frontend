export function calcularMovimientos (rowIndex, columnIndex, carta) {
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

export default calcularMovimientos;