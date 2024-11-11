export class ServicioLocalStorage {

  static guardar_objeto(nombre, objeto) {
    localStorage.setItem(nombre, JSON.stringify(objeto));
  }

  static obtener_objeto(nombre) {
    return JSON.parse(localStorage.getItem(nombre));
  }

}