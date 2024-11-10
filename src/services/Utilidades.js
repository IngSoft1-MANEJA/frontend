/**
 * Función que calcula el tiempo restante dada duracion en segundos y dado un
 * timestamp en ISO 8601 en el pasado que indica cuando empezo "algo". 
 * @param {String} timestampEmpezado 
 * @param {Number} tiempoDeDuracion 
 * @returns Tiempo restante en segundos, 0 si el tiempo ya se agotó o null si el
 *  timestamp no es valido.
 */
export function calcularTiempoRestante(timestampEmpezado, tiempoDeDuracion) {
  const tiempoEmpezado = new Date(timestampEmpezado);

  if (isNaN(tiempoEmpezado)) {
    return null;
  } else {
    const ahora = new Date();

    const diffEnMillisegundos = ahora.getTime() - tiempoEmpezado.getTime();

    if (diffEnMillisegundos < 0) {
        return null;
    } else {
      const tiempoPasadoEnSegundos = Math.floor(diffEnMillisegundos / 1000);
      return Math.max(tiempoDeDuracion - tiempoPasadoEnSegundos, 0);
    }
  }
}
