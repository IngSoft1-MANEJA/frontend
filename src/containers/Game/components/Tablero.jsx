import React, { useCallback } from "react";
import { useEffect, useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { Ficha } from "./Ficha.jsx";
import { Alerts } from "../../../components/Alerts";
import "./Tablero.css";
import { UsarMovimientoContext } from "../../../contexts/UsarMovimientoContext.jsx";
import { DatosJugadorContext } from "../../../contexts/DatosJugadorContext.jsx";
import { EventoContext } from "../../../contexts/EventoContext.jsx";
import { TilesContext } from "../../../contexts/tilesContext.jsx";
import { FigurasContext } from "../../../contexts/FigurasContext.jsx";
import { CompletarFiguraContext } from "../../../contexts/CompletarFiguraContext.jsx";
import { ServicioMovimiento } from "../../../services/ServicioMovimiento.js";
import { ServicioPartida } from "../../../services/ServicioPartida.js";
import { ServicioFigura } from "../../../services/ServicioFigura.js";

export const Tablero = () => {
  const { match_id } = useParams();

  const { datosJugador } = useContext(DatosJugadorContext);
  const { usarMovimiento, setUsarMovimiento } = useContext(
    UsarMovimientoContext,
  );
  const { ultimoEvento } = useContext(EventoContext);
  const { tiles, setTiles } = useContext(TilesContext);
  const { figuras, agregarFiguras, setFiguras } = useContext(FigurasContext);
  const {
    cartaSeleccionada: cartaFiguraSeleccionada,
    setCartaSeleccionada: setCartaFiguraSeleccionada,
  } = useContext(CompletarFiguraContext);

  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState("");
  const [haValidadoMovimiento, setHaValidadoMovimiento] = useState(false);

  useEffect(() => {
    if (ultimoEvento !== null) {
      if (ultimoEvento.key === "GET_PLAYER_MATCH_INFO") {
        setTiles(ultimoEvento.payload.board);
        setFiguras({
          ...figuras,
          color_prohibido:
            ultimoEvento.payload.ban_color === null
              ? "Ninguno"
              : ServicioFigura.cambiarIdiomaColorFigura(
                  ultimoEvento.payload.ban_color,
                ),
        });
      }
      if (ultimoEvento.key === "PLAYER_RECEIVE_NEW_BOARD") {
        ServicioMovimiento.swapFichas(
          ultimoEvento.payload.swapped_tiles,
          tiles,
          setTiles,
          setUsarMovimiento,
        );
      }
      if (ultimoEvento.key === "ALLOW_FIGURES") {
        agregarFiguras(ultimoEvento.payload);
      }
      if (ultimoEvento.key === "COMPLETED_FIGURE") {
        setFiguras({
          ...figuras,
          color_prohibido:
            ultimoEvento.payload.ban_color === null
              ? "Ninguno"
              : ServicioFigura.cambiarIdiomaColorFigura(
                  ultimoEvento.payload.ban_color,
                ),
        });
      }
    }
  }, [ultimoEvento]);

  const manejarFiguraSeleccionadaEnClick = useCallback(
    async (rowIndex, columnIndex, tileColor) => {
      const figura = ServicioMovimiento.obtenerFiguraDeFicha(
        rowIndex,
        columnIndex,
        figuras.figuras_actuales,
      );

      if (figura) {
        if (tileColor !== figuras.color_prohibido) {
          try {
            const respuesta = await ServicioPartida.completarFicha(
              match_id,
              datosJugador.player_id,
              cartaFiguraSeleccionada,
              figura,
            );

            setCartaFiguraSeleccionada(null);

            respuesta.movement_cards.forEach((cartaADeshacer) => {
              setUsarMovimiento((prev) => ({
                ...prev,
                cartasUsadas: prev.cartasUsadas.filter(
                  (carta) => carta[0] !== cartaADeshacer[0],
                ),
              }));
            });

            setUsarMovimiento((prev) => ({
              ...prev,
              cartasCompletadas:
                prev.cartasUsadas.length - respuesta.movement_cards.length,
            }));
          } catch (err) {
            console.error(err);
            switch (err.status) {
              case 409:
                if (tileColor !== figuras.color_prohibido) {
                  setMensajeAlerta("La figura es del color prohibido.");
                } else {
                  setMensajeAlerta("La figura seleccionada es incorrecta.");
                }
                break;
              default:
                setMensajeAlerta("Error al completar figura");
                break;
            }
            setMostrarAlerta(true);
            setTimeout(() => {
              setMostrarAlerta(false);
            }, 1000);
          }
        } else {
          setMensajeAlerta("La figura es del color prohibido");
          setMostrarAlerta(true);
          setTimeout(() => {
            setMostrarAlerta(false);
          }, 1000);
        }
      }
    },
    [usarMovimiento, figuras, datosJugador, cartaFiguraSeleccionada, match_id],
  );

  const handleFichaClick = async (rowIndex, columnIndex, tileColor) => {
    if (cartaFiguraSeleccionada !== null) {
      manejarFiguraSeleccionadaEnClick(rowIndex, columnIndex, tileColor);
    }
    if (usarMovimiento.cartaSeleccionada !== null) {
      const fichaEstaSeleccionada = usarMovimiento.fichasSeleccionadas.some(
        (ficha) =>
          ficha.rowIndex === rowIndex && ficha.columnIndex === columnIndex,
      );

      if (fichaEstaSeleccionada) {
        // Deseleccionar la ficha si ya estaba seleccionada
        const newFichasSeleccionadas =
          usarMovimiento.fichasSeleccionadas.filter(
            (ficha) =>
              ficha.rowIndex !== rowIndex || ficha.columnIndex !== columnIndex,
          );
        setUsarMovimiento((prev) => ({
          ...prev,
          fichasSeleccionadas: newFichasSeleccionadas,
        }));
      } else if (usarMovimiento.fichasSeleccionadas.length === 0) {
        // Seleccionar la primera ficha y calcular los movimientos posibles
        setUsarMovimiento((prev) => {
          const newFichasSeleccionadas = [
            ...prev.fichasSeleccionadas,
            { rowIndex, columnIndex },
          ];
          return { ...prev, fichasSeleccionadas: newFichasSeleccionadas };
        });

        // Calcular movimientos inmediatamente después de seleccionar la primera ficha
        const movimientosCalculados = ServicioMovimiento.calcularMovimientos(
          rowIndex,
          columnIndex,
          usarMovimiento.cartaSeleccionada[1],
        );
        setTimeout(() => {
          setUsarMovimiento((prev) => ({
            ...prev,
            movimientosPosibles: movimientosCalculados,
          }));
        }, 0);
      } else if (usarMovimiento.fichasSeleccionadas.length === 1) {
        // Seleccionar la segunda ficha
        setUsarMovimiento((prev) => {
          const newFichasSeleccionadas = [
            ...prev.fichasSeleccionadas,
            { rowIndex, columnIndex },
          ];
          return { ...prev, fichasSeleccionadas: newFichasSeleccionadas };
        });
      }
    } else {
      setUsarMovimiento({ ...usarMovimiento, fichasSeleccionadas: [] });
    }
  };

  useEffect(() => {
    if (
      usarMovimiento.fichasSeleccionadas.length === 2 &&
      !haValidadoMovimiento
    ) {
      setHaValidadoMovimiento(true);
      ServicioMovimiento.llamarServicio(
        match_id,
        datosJugador.player_id,
        tiles,
        usarMovimiento.fichasSeleccionadas,
        usarMovimiento.cartaSeleccionada,
        setUsarMovimiento,
        setMensajeAlerta,
        setMostrarAlerta,
        setTiles,
        setHaValidadoMovimiento,
      );
    }
  }, [usarMovimiento.fichasSeleccionadas]);

  const gridCell = tiles.map((row, rowIndex) => {
    return row.map((tileColor, columnIndex) => {
      const highlighted = ServicioMovimiento.estaHighlighted(
        rowIndex,
        columnIndex,
        usarMovimiento.fichasSeleccionadas,
      );
      const movimientoPosible = ServicioMovimiento.esMovimientoPosible(
        rowIndex,
        columnIndex,
        usarMovimiento.movimientosPosibles,
      );
      const deshabilitado = !highlighted && !movimientoPosible;
      const isFiguraInicial = ServicioMovimiento.estaFiguraInicial(
        rowIndex,
        columnIndex,
        figuras.figuras_actuales,
      );
      return (
        <Ficha
          id={`ficha-${rowIndex}-${columnIndex}`}
          key={`${rowIndex}-${columnIndex}`}
          color={tileColor}
          onClick={() => handleFichaClick(rowIndex, columnIndex, tileColor)}
          highlightClass={highlighted}
          movimientoPosible={movimientoPosible}
          disabled={deshabilitado}
          highlightFiguraInicial={isFiguraInicial}
        />
      );
    });
  });

  return (
    <div className="tablero flex w-100 h-screen justify-center items-center">
      {mostrarAlerta && (
        <div className="fixed top-3 right-3 w-1/3 z-50">
          <Alerts type={"error"} message={mensajeAlerta} />
        </div>
      )}
      <div className="tablero-grid grid grid-cols-6 gap-1">{gridCell}</div>
    </div>
  );
};

export default Tablero;
